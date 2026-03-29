import { test, describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { ref } from 'vue';
import { usePagination } from './usePagination.js';

describe('usePagination', () => {
    it('initializes correctly', () => {
        const data = ref(Array.from({ length: 25 }, (_, i) => i + 1));
        const { currentPage, itemsPerPage, totalPages, paginatedData } = usePagination(data, 10);

        assert.equal(currentPage.value, 1);
        assert.equal(itemsPerPage.value, 10);
        assert.equal(totalPages.value, 3);
        assert.equal(paginatedData.value.length, 10);
        assert.deepEqual(paginatedData.value, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('navigates pages', () => {
        const data = ref(Array.from({ length: 25 }, (_, i) => i + 1));
        const { currentPage, nextPage, prevPage, paginatedData } = usePagination(data, 10);

        nextPage();
        assert.equal(currentPage.value, 2);
        assert.deepEqual(paginatedData.value, [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

        nextPage();
        assert.equal(currentPage.value, 3);
        assert.deepEqual(paginatedData.value, [21, 22, 23, 24, 25]);

        // Should stop at last page
        nextPage();
        assert.equal(currentPage.value, 3);

        prevPage();
        assert.equal(currentPage.value, 2);

        // Should stop at first page
        prevPage();
        prevPage();
        assert.equal(currentPage.value, 1);
    });

    it('adjusts total pages when data changes', () => {
         const data = ref(Array.from({ length: 25 }, (_, i) => i + 1));
         const { totalPages } = usePagination(data, 10);
         assert.equal(totalPages.value, 3);

         data.value = Array.from({ length: 5 }, (_, i) => i + 1);
         assert.equal(totalPages.value, 1);
    });

    it('updates paginated data when itemsPerPage changes', () => {
         const data = ref(Array.from({ length: 25 }, (_, i) => i + 1));
         const { itemsPerPage, totalPages } = usePagination(data, 10);

         itemsPerPage.value = 5;
         assert.equal(totalPages.value, 5);
    });

    it('clamps currentPage when totalPages decreases', async () => {
        const data = ref(Array.from({ length: 25 }, (_, i) => i + 1));
        const { currentPage, nextPage, totalPages } = usePagination(data, 10);

        nextPage(); // page 2
        nextPage(); // page 3
        assert.equal(currentPage.value, 3);

        // Reduce data to 15 items (2 pages)
        data.value = Array.from({ length: 15 }, (_, i) => i + 1);

        // Wait for watcher
        await new Promise(resolve => setTimeout(resolve, 50));

        assert.equal(totalPages.value, 2);
        assert.equal(currentPage.value, 2, 'Current page should be clamped to 2');
    });
});
