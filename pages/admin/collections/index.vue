<template>
    <div>
        <NuxtLayout name="admin">
            <main>
                <!-- Search and Add Collection Button Container -->
                <div class="relative flex items-center space-x-4 mt-3">
                    <!-- Search Bar -->
                    <div class="relative flex flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
                            viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M9 3a6 6 0 11-6 6 6 6 0 016-6zM2 9a7 7 0 1114 0A7 7 0 012 9zm11.293 4.293a1 1 0 00-1.415-1.414L10 12.586l-1.879-1.878a1 1 0 00-1.415 1.414L8.586 14l-1.879 1.879a1 1 0 001.415 1.415L10 15.414l1.879 1.879a1 1 0 001.415-1.415L11.414 14l1.879-1.879a1 1 0 000-1.415z"
                                clip-rule="evenodd" />
                        </svg>
                        <input type="text" placeholder="Search"
                            class="block w-70 rounded-md border border-gray-400 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xs pl-8 pr-2 py-1.5" />
                    </div>

                    <!-- Add Collection Button -->
                    <button @click="navigateToCreate" type="button"
                        class="rounded-md bg-gray-900 px-3 py-2 text-center text-xxs font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 flex items-center justify-center gap-2">
                        <PlusIcon class="h-3 w-3" aria-hidden="true" />
                        New Collections
                    </button>
                </div>

                <!-- Collections List Table -->
                <div class="mt-4 overflow-x-auto">
                    <table class="min-w-full bg-white rounded-lg shadow-md mt-2 rounded-b-lg">
                        <thead>
                            <tr class="text-left">
                                <th class="px-4 py-2 text-xxs font-semibold text-white bg-gray-900">collection_type</th>
                                <th class="px-4 py-2 text-xxs font-semibold text-white bg-gray-900">collection_date</th>
                                <th class="px-4 py-2 text-xxs font-semibold text-white bg-gray-900">customer</th>
                                <th class="px-4 py-2 text-xxs font-semibold text-white bg-gray-900">cash_voucher_no</th>
                                <th class="px-4 py-2 text-xxs font-semibold text-white bg-gray-900">is_cancelled</th>
                                <th class="px-4 py-2 text-xxs font-semibold text-white bg-gray-900">prepared_by_id</th>
                                <th class="px-4 py-2 text-xxs font-semibold text-white bg-gray-900 rounded-tr-lg">
                                    actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-gray-100">
                            <tr v-for="(collection, index) in paginatedCollections" :key="index"
                                class="border-t bg-gray-50">
                                <td class="px-4 py-2 text-xxs text-gray-700">{{ collection.collection_type }}</td>
                                <td class="px-4 py-2 text-xxs text-gray-700">{{ collection.collection_date }}</td>
                                <td class="px-4 py-2 text-xxs text-gray-700">{{ collection.customer }}</td>
                                <td class="px-4 py-2 text-xxs text-gray-700">{{ collection.cash_voucher_no }}</td>
                                <td class="px-4 py-2 text-xxs text-gray-700">{{ collection.is_cancelled }}</td>
                                <td class="px-4 py-2 text-xxs text-gray-700">{{ collection.prepared_by_id }}</td>
                                <td class="px-4 py-2 text-xxs text-gray-700">
                                    <div class="flex space-x-2">
                                        <button @click="editCollection(index)"
                                            class="text-gray-600 hover:text-gray-900">
                                            <!-- Edit Icon -->
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                                fill="currentColor">
                                                <path
                                                    d="M17.414 2.586a2 2 0 00-2.828 0l-10 10V16a1 1 0 001 1h3.414l10-10a2 2 0 000-2.828l-1.586-1.586zM5 13l-1.5 1.5V13h1.5zm4.5-4.5L14 4l2 2-4.5 4.5H9.5V8.5z" />
                                            </svg>
                                        </button>
                                        <button @click="deleteCollection(index)"
                                            class="text-red-600 hover:text-red-900">
                                            <!-- Delete Icon -->
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                                fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M6 2a2 2 0 00-2 2v1H2v2h1v9a2 2 0 002 2h8a2 2 0 002-2V7h1V5h-2V4a2 2 0 00-2-2H6zm4 12a1 1 0 102 0V8a1 1 0 10-2 0v6zm-3-1a1 1 0 002 0V8a1 1 0 10-2 0v5zm8-1a1 1 0 10-2 0V8a1 1 0 102 0v5z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="collections.length === 0">
                                <td colspan="7" class="px-4 py-2 text-xxs text-gray-500 text-center bg-gray-100">No
                                    collections available.</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Pagination Controls -->
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-xxs text-gray-700 ml-1">Page {{ currentPage }} of {{ totalPages }}</span>
                        <div class="flex space-x-2">
                            <button @click="previousPage" :disabled="currentPage === 1"
                                class="px-4 py-2 text-xxs font-semibold text-gray-900 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-100">
                                Previous
                            </button>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="px-4 py-2 text-xxs font-semibold text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:bg-gray-700">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/outline';

const showForm = ref(false);
const collection = ref({
    collection_type: '',
    collection_date: '',
    customer: '',
    cash_voucher_no: '',
    is_cancelled: 'No',
    prepared_by_id: ''
});
const collections = ref<Array<{
    collection_type: string,
    collection_date: string,
    customer: string,
    cash_voucher_no: string,
    is_cancelled: string,
    prepared_by_id: string
}>>([]);
const currentPage = ref(1);
const itemsPerPage = 10;
let editingIndex = ref<number | null>(null);

const totalPages = computed(() => Math.ceil(collections.value.length / itemsPerPage));

const paginatedCollections = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return collections.value.slice(start, end);
});

function toggleForm() {
    showForm.value = !showForm.value;
    if (!showForm.value) {
        editingIndex.value = null;
        resetCollectionForm();
    }
}

function resetCollectionForm() {
    collection.value = {
        collection_type: '',
        collection_date: '',
        customer: '',
        cash_voucher_no: '',
        is_cancelled: 'No',
        prepared_by_id: ''
    };
}

function submitCollection() {
    if (isCollectionFormValid()) {
        if (editingIndex.value !== null) {
            // Update the existing collection.
            collections.value[editingIndex.value] = { ...collection.value };
            editingIndex.value = null;
        } else {
            // Add a new collection.
            collections.value.push({ ...collection.value });
        }
        resetCollectionForm();
        showForm.value = false;
    }
}

function isCollectionFormValid() {
    return collection.value.collection_type.trim() !== '' &&
        collection.value.customer.trim() !== '';
}

function editCollection(index: number) {
    collection.value = { ...collections.value[index] };
    editingIndex.value = index;
    showForm.value = true; // Open the form for editing.
}

function deleteCollection(index: number) {
    collections.value.splice(index, 1);
}

function previousPage() {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
}

function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
}

function navigateToCreate() {
    navigateTo("collections/create")
}
</script>