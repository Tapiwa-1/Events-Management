import esmock from 'esmock';
import assert from 'node:assert';
import { mock, describe, it, beforeEach } from 'node:test';
import { createPinia, setActivePinia } from 'pinia';

describe('Auth Store', () => {
    let useAuthStore;
    let apiMock;

    beforeEach(async () => {
        // Setup Pinia
        setActivePinia(createPinia());

        // Mock api
        apiMock = {
            post: mock.fn(async () => ({ data: { user: { id: 1, name: 'Test User', role: 'customer' } } })),
            get: mock.fn(async () => ({ data: { id: 1, name: 'Test User', role: 'customer' } })),
            interceptors: {
                response: {
                    use: mock.fn(),
                }
            },
            defaults: {
                headers: {
                    common: {}
                }
            }
        };

        // Use esmock to import the module under test with mocks
        const module = await esmock('./auth.js', {
            '../api.js': {
                default: apiMock
            }
        });
        useAuthStore = module.useAuthStore;
    });

    describe('State & Getters', () => {
        it('should initialize with default state', () => {
            const store = useAuthStore();
            assert.strictEqual(store.user, null);
            assert.strictEqual(store.isAuthenticated, false);
            assert.strictEqual(store.loading, false);
            assert.strictEqual(store.error, null);
        });

        it('should correctly identify admin role', () => {
            const store = useAuthStore();
            store.user = { role: 'admin' };
            assert.strictEqual(store.isAdmin, true);
            assert.strictEqual(store.isStaff, true);
            assert.strictEqual(store.isAuthenticated, true);
        });

        it('should correctly identify staff role', () => {
            const store = useAuthStore();
            store.user = { role: 'staff' };
            assert.strictEqual(store.isAdmin, false);
            assert.strictEqual(store.isStaff, true);
            assert.strictEqual(store.isAuthenticated, true);
        });

        it('should correctly identify customer role', () => {
            const store = useAuthStore();
            store.user = { role: 'customer' };
            assert.strictEqual(store.isAdmin, false);
            assert.strictEqual(store.isStaff, false);
            assert.strictEqual(store.isAuthenticated, true);
        });
    });

    describe('Actions', () => {
        describe('login', () => {
            it('should handle successful login', async () => {
                const store = useAuthStore();
                const credentials = { email: 'test@example.com', password: 'password' };

                const success = await store.login(credentials);

                assert.strictEqual(success, true);
                assert.deepStrictEqual(store.user, { id: 1, name: 'Test User', role: 'customer' });
                assert.strictEqual(store.isAuthenticated, true);
                assert.strictEqual(apiMock.post.mock.callCount(), 1);

                // check arguments
                const call = apiMock.post.mock.calls[0];
                assert.strictEqual(call.arguments[0], '/auth/login');
                assert.deepStrictEqual(call.arguments[1], credentials);
            });

            it('should handle failed login', async () => {
                apiMock.post.mock.mockImplementationOnce(async () => {
                    const err = new Error('Login failed');
                    err.response = { data: { error: 'Invalid credentials' } };
                    throw err;
                });

                const store = useAuthStore();
                const success = await store.login({ email: 'test@example.com', password: 'wrong' });

                assert.strictEqual(success, false);
                assert.strictEqual(store.user, null);
                assert.strictEqual(store.error, 'Invalid credentials');
                assert.strictEqual(store.isAuthenticated, false);
                assert.strictEqual(store.loading, false);
            });

            it('should handle login error without response data', async () => {
                 apiMock.post.mock.mockImplementationOnce(async () => {
                    throw new Error('Network Error');
                });

                const store = useAuthStore();
                const success = await store.login({ email: 'test@example.com', password: 'wrong' });

                assert.strictEqual(success, false);
                assert.strictEqual(store.error, 'Login failed');
            });
        });

        describe('register', () => {
            it('should handle successful registration', async () => {
                const store = useAuthStore();
                const userData = { email: 'new@example.com', password: 'password' };

                const success = await store.register(userData);

                assert.strictEqual(success, true);
                assert.strictEqual(store.loading, false);
                assert.strictEqual(apiMock.post.mock.callCount(), 1);

                const call = apiMock.post.mock.calls[0];
                assert.strictEqual(call.arguments[0], '/auth/register');
                assert.deepStrictEqual(call.arguments[1], userData);
            });

            it('should handle failed registration', async () => {
                apiMock.post.mock.mockImplementationOnce(async () => {
                    const err = new Error('Registration failed');
                    err.response = { data: { error: 'Email already exists' } };
                    throw err;
                });

                const store = useAuthStore();
                const success = await store.register({ email: 'exists@example.com' });

                assert.strictEqual(success, false);
                assert.strictEqual(store.error, 'Email already exists');
                assert.strictEqual(store.loading, false);
            });
        });

        describe('logout', () => {
            it('should handle successful logout', async () => {
                const store = useAuthStore();
                store.user = { id: 1, name: 'User' };

                await store.logout();

                assert.strictEqual(store.user, null);
                assert.strictEqual(apiMock.post.mock.callCount(), 1);
                assert.strictEqual(apiMock.post.mock.calls[0].arguments[0], '/auth/logout');
            });

            it('should clear user even if logout api fails', async () => {
                apiMock.post.mock.mockImplementationOnce(async () => {
                    throw new Error('Logout failed');
                });

                const store = useAuthStore();
                store.user = { id: 1, name: 'User' };

                await store.logout();

                assert.strictEqual(store.user, null);
            });
        });

        describe('checkAuth', () => {
            it('should fetch user if not present', async () => {
                const store = useAuthStore();

                await store.checkAuth();

                assert.deepStrictEqual(store.user, { id: 1, name: 'Test User', role: 'customer' });
                assert.strictEqual(apiMock.get.mock.callCount(), 1);
                assert.strictEqual(apiMock.get.mock.calls[0].arguments[0], '/auth/me');
            });

            it('should not fetch if user is already present', async () => {
                const store = useAuthStore();
                store.user = { id: 2, name: 'Existing' };

                await store.checkAuth();

                assert.deepStrictEqual(store.user, { id: 2, name: 'Existing' });
                assert.strictEqual(apiMock.get.mock.callCount(), 0);
            });

            it('should handle checkAuth failure', async () => {
                apiMock.get.mock.mockImplementationOnce(async () => {
                    throw new Error('Not authenticated');
                });

                const store = useAuthStore();
                // set user initially to verify it gets cleared?
                // Wait, logic is: try { fetch } catch { user = null }
                // So if we start with null, it remains null.
                // If we start with something but fetch fails (weird case if checkAuth is called when user exists, but it returns early).
                // Actually checkAuth is for initial load.

                // Let's assume user is null initially.
                await store.checkAuth();

                assert.strictEqual(store.user, null);
            });
        });
    });
});
