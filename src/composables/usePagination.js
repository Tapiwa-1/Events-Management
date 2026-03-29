import { ref, computed, watch } from 'vue';

/**
 * usePagination Composable
 *
 * @param {import('vue').Ref<Array>} data - The reactive data source to paginate (e.g., sorted/filtered list)
 * @param {number} [initialItemsPerPage=10] - Initial number of items per page
 * @returns {Object} Pagination state and controls
 */
export function usePagination(data, initialItemsPerPage = 10) {
    const currentPage = ref(1);
    const itemsPerPage = ref(initialItemsPerPage);

    const totalPages = computed(() => {
        if (!data.value || data.value.length === 0) return 1;
        return Math.ceil(data.value.length / itemsPerPage.value);
    });

    const paginatedData = computed(() => {
        if (!data.value) return [];
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;
        return data.value.slice(start, end);
    });

    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value++;
        }
    };

    const prevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page;
        }
    };

    // Watch totalPages to clamp currentPage if needed
    watch(totalPages, (newTotal) => {
        if (currentPage.value > newTotal) {
            currentPage.value = Math.max(1, newTotal);
        }
    });

    return {
        currentPage,
        itemsPerPage,
        totalPages,
        paginatedData,
        nextPage,
        prevPage,
        goToPage
    };
}
