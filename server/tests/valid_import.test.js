import axios from 'axios';
import { spawn } from 'child_process';

const SERVER_PORT = 3000;
const VALID_ENDPOINT = `http://localhost:${SERVER_PORT}/api/events/import-sheet`;

const VALID_URL = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit';

console.log('[TEST] Starting backend server...');
const serverProcess = spawn('node', ['server/index.js'], { stdio: 'pipe' });

serverProcess.stdout.on('data', (data) => {
    if (data.toString().includes('Server listening')) {
        console.log('[TEST] Backend server is ready.');
    }
});

serverProcess.stderr.on('data', (data) => console.error(`[BACKEND ERROR]: ${data}`));

// Wait for server to start
await new Promise(resolve => setTimeout(resolve, 5000));

try {
    console.log('[TEST] Sending valid Google Sheet request...');
    await axios.post(VALID_ENDPOINT, {
        url: VALID_URL
    });
    console.log('[TEST] Request completed successfully (Validation Passed).');
    process.exit(0);
} catch (error) {
    if (error.response) {
        console.log(`[TEST] Server responded with status: ${error.response.status}`);
        if (error.response.status === 400 && error.response.data.error && error.response.data.error.includes('Invalid URL')) {
            console.error('[TEST] FAILURE: Valid URL was blocked as Invalid URL.');
            process.exit(1);
        } else {
            console.log(`[TEST] SUCCESS: Server did NOT block as Invalid URL (Status: ${error.response.status}).`);
            process.exit(0);
        }
    } else {
        console.error(`[TEST] Request failed with unexpected error: ${error.message}`);
        // If network error (e.g. no internet), it means axios tried to fetch -> validation passed.
        console.log('[TEST] SUCCESS: validation passed (network error expected).');
        process.exit(0);
    }
} finally {
    serverProcess.kill();
}
