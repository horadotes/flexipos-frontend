<template>
    <div>
        <NuxtLayout name="admin">
            <main>

                <Head>
                    <Title>Suppliers - {{ runtimeConfig.public.appName }}</Title>
                </Head>
                <div class="sm:flex sm:items-center sm:justify-between">
                    <!-- Search Bar -->
                    <div class="relative flex flex-1 ml-8 mt-5">
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
                    <!-- Add Supplier Button -->
                    <div class="mt-4 sm:ml-16 sm:mt-3 sm:flex-none mr-6">
                        <button type="button" @click="toggleForm"
                            class="block rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Add Supplier
                        </button>
                    </div>
                </div>
                <div class="sm:flex sm:items-center sm:justify-between mt-4 ml-8">
                    <div class="sm:flex-auto">
                        <h1 class="text-base font-semibold leading-6 text-gray-900">Suppliers</h1>
                        <p class="mt-2 text-sm text-gray-700">A list of all the suppliers and their details.</p>
                    </div>
                </div>
                <!-- Supplier Form -->
                <div v-if="showForm" class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <form @submit.prevent="saveSupplier">
                            <FormLabel label="Supplier Details" class="text-xl" />
                            <Alert type="danger" :text="state?.error?.message"
                                v-if="state.error?.message && state.error.message.length > 0" />
                            <div class="grid grid-cols-1 gap-1 mt-3 mx-2">
                                <FormLabel for="supplierName" label="Supplier Name" />
                                <div class="flex items-center mb-1">
                                    <FormTextField for="supplierName" name="supplierName" v-model="supplier.name"
                                        placeholder="Supplier Name" required />
                                </div>
                                <FormLabel for="address" label="Address" />
                                <div class="flex items-center mb-1">
                                    <FormTextField for="address" name="address" v-model="supplier.address"
                                        placeholder="Address" required />
                                </div>
                                <FormLabel for="phone" label="Phone" />
                                <div class="flex items-center mb-1">
                                    <FormNumberField for="phone" name="phone" v-model="supplier.phone"
                                        placeholder="Phone" required />
                                </div>
                                <span>
                                    <FormLabel for="alternate_phone" label="Alternate Phone" />
                                    <FormLabel class="text-red-600" for="alternate_phone" label=" *Optional" />
                                </span>
                                <div class="flex items-center mb-1">
                                    <FormTextField for="alternate_phone" name="alternate_phone"
                                        v-model="supplier.alternate_phone" placeholder="Alternate Phone" />
                                </div>
                                <FormLabel for="is_active" label="is Active" class="mr-3" />
                                <div class="mb-1">
                                    <FormSelectField v-model="selectedIsActive" :options="activeInactiveOptions" />
                                    <FormError :error="state?.error?.errors?.is_active?.[0]" />
                                </div>
                                <div class="flex justify-end gap-2 mt-4">
                                    <button type="submit"
                                        class="rounded-md bg-gray-900 px-4 py-2 text-xxs font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                                        Save
                                    </button>
                                    <button @click="toggleForm" type="button"
                                        class="rounded-md bg-gray-200 px-4 py-2 text-xxs font-semibold text-gray-700 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- View Details -->
                <div v-if="supplierToView"
                    class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <div class="grid grid-cols-1 gap-1 mt-3 mx-2">
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Supplier Name:</label>
                                <span>{{ state.suppliers.data.find(s => s.id === supplierToView)?.name
                                    }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Address:</label>
                                <span>{{ state.suppliers.data.find(s => s.id === supplierToView)?.address
                                    }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Phone:</label>
                                <span>{{ state.suppliers.data.find(s => s.id === supplierToView)?.phone
                                    }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Alternate Phone:</label>
                                <span>{{ state.suppliers.data.find(s => s.id ===
                                    supplierToView)?.alternate_phone
                                    }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Is Active:</label>
                                <span
                                    :class="state.suppliers.data.find(s => s.id === supplierToView)?.is_active
                                        ? 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'
                                        : 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20'">
                                    {{ state.suppliers.data.find(s => s.id === supplierToView)?.is_active ?
                                        'Active' : 'Inactive' }}
                                </span>
                            </div>
                            <div class="flex justify-end gap-2 mt-4">
                                <button @click="supplierToView = null"
                                    class="rounded-md bg-gray-200 px-4 py-2 text-xxs font-semibold text-gray-700 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Supplier Table -->
                <div>
                    <Alert type="danger" :text="state.error?.message" v-if="state.error" />
                    <div class="table-responsive">
                        <Table :columnHeaders="state.columnHeaders" :data="state.suppliers"
                            :isLoading="state.isTableLoading" :sortData="state.sortData" @sort="sort">
                            <template #body v-if="!(
                                state.isTableLoading ||
                                (state.suppliers?.data &&
                                    state.suppliers?.data.length === 0)
                            )">
                                <tr v-for="(supplier, index) in state.suppliers?.data" :key="index">
                                    <td>
                                        <span class="truncate">{{ supplier.name }}</span>
                                    </td>
                                    <td>
                                        <span class="pl-3">{{ supplier.address }}</span>
                                    </td>
                                    <td>
                                        <span class="pl-3">{{ supplier.phone }}</span>
                                    </td>
                                    <td>
                                        <span class="pl-3">{{ supplier.alternate_phone }}</span>
                                    </td>
                                    <td>
                                        <span class="ml-2"
                                            :class="supplier.is_active
                                                ? 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'
                                                : 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20'">
                                            {{ supplier.is_active ? 'Active' : 'Inactive' }}
                                        </span>
                                    </td>
                                    <td class="pl-2 py-2 text-xxs text-gray-700">
                                        <div class="flex space-x-2">
                                            <button @click="viewSupplier(supplier.id)"
                                                class="text-gray-600 hover:text-gray-900">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                    <path fill-rule="evenodd"
                                                        d="M12 4.5C8.798 4.5 6 7.057 6 10.5S8.798 16.5 12 16.5 18 13.943 18 10.5 15.202 4.5 12 4.5ZM12 15.5C10.343 15.5 9 14.156 9 12.5S10.343 9.5 12 9.5 15 10.844 15 12.5 13.657 15.5 12 15.5ZM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM12 20C7.03 20 3 15.97 3 12S7.03 4 12 4s9 4.03 9 9-4.03 9-9 9Z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>

                                            <button @click="editSupplier(supplier.id)"
                                                class="text-gray-600 hover:text-gray-900">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 20 20" fill="currentColor">
                                                    <path
                                                        d="M17.414 2.586a2 2 0 00-2.828 0l-10 10V16a1 1 0 001 1h3.414l10-10a2 2 0 000-2.828l-1.586-1.586zM5 13l-1.5 1.5V13h1.5zm4.5-4.5L14 4l2 2-4.5 4.5H9.5V8.5z" />
                                                </svg>
                                            </button>
                                            <!-- <button @click="deleteSupplier(supplier.id)"
                                                class="text-red-600 hover:text-red-900">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd"
                                                        d="M6 2a2 2 0 00-2 2v1H2v2h1v9a2 2 0 002 2h8a2 2 0 002-2V7h1V5h-2V4a2 2 0 00-2-2H6zm4 12a1 1 0 102 0V8a1 1 0 10-2 0v6zm-3-1a1 1 0 002 0V8a1 1 0 10-2 0v5zm8-1a1 1 0 10-2 0V8a1 1 0 102 0v5z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button> -->
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <!-- <template #empty v-if="state.suppliers?.data?.length === 0">
                                <tr>
                                    <td colspan="7" class="text-center py-4 text-sm text-gray-600">
                                        No suppliers found.
                                    </td>
                                </tr>
                            </template> -->
                        </Table>
                    </div>
                    <Pagination :data="state.suppliers" @previous="previous" @next="next" />
                </div>
            </main>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { supplierService } from '~/components/api/admin/SupplierService.js';
const runtimeConfig = useRuntimeConfig();
console.log(runtimeConfig.public);

import type { Error } from '@/types/error';

const activeInactiveOptions = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
];

const selectedIsActive = computed({
    get: () => supplier.value.is_active,
    set: (newValue: boolean) => {
        supplier.value.is_active = newValue;
    }
});

// Reactive state
const state = reactive({
    columnHeaders: [
        { name: "Supplier Name", sorter: true, key: "supplierName" },
        { name: "Address", sorter: true, key: "address" },
        { name: "Telephone 1", sorter: true, key: "Telephone1" },
        { name: "Telephone 2", sorter: true, key: "Telephone2" },
        { name: "Is Active", sorter: true, key: "isactive" },
        { name: "Actions", key: "actions" },
    ],
    error: null as Error | null,
    isTableLoading: false,
    sortData: { sortField: "", sortOrder: null } as SortData,
    suppliers: { data: [] } as Suppliers,
});

// Reactive references
const showForm = ref(false);
const supplierToEdit = ref<number | null>(null);
const supplierToView = ref<number | null>(null);
const currentTablePage = ref(1);

const formTitle = computed(() => supplierToEdit.value ? 'Edit Supplier' : 'Add Supplier');

// Interfaces
interface SortData {
    sortField: string;
    sortOrder: "ascend" | "descend" | null;
}

interface Suppliers {
    data: any[];
}

// Fetch suppliers
async function fetchSuppliers() {
    state.isTableLoading = true;
    state.error = null;
    try {
        const params = {
            page: currentTablePage.value,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
        };
        const response = await supplierService.getSuppliers();
        state.suppliers = response;
    } catch (error: any) {
        state.error = error;
    }
    state.isTableLoading = false;
}

onMounted(() => {
    fetchSuppliers();
});

// Pagination functions
function previous() {
    if (currentTablePage.value > 1) {
        currentTablePage.value--;
        fetchSuppliers();
    }
}

function next() {
    currentTablePage.value++;
    fetchSuppliers();
}

// Sorting function
function sort(sortingData: { column: string; sort: string }) {
    currentTablePage.value = 1;
    if (sortingData.sort === 'ascend' || sortingData.sort === 'descend') {
        state.sortData = {
            sortField: sortingData.column,
            sortOrder: sortingData.sort,
        };
    } else {
        console.error('Invalid sort order:', sortingData.sort);
        state.sortData = {
            sortField: sortingData.column,
            sortOrder: 'ascend',
        };
    }
    fetchSuppliers();
}

// Supplier form data
const supplier = ref({
    name: '',
    address: '',
    phone: '',
    alternate_phone: '',
    is_active: true,
});

// Save supplier function
async function saveSupplier() {
    try {
        const suppliers = {
            name: supplier.value.name,
            address: supplier.value.address,
            phone: supplier.value.phone,
            alternate_phone: supplier.value.alternate_phone,
            is_active: supplier.value.is_active,
        };

        let response;

        if (supplierToEdit.value) {
            // Update existing supplier
            response = await supplierService.updateSupplier(supplierToEdit.value, suppliers);
            alert(response ? 'Supplier has been updated!' : 'Supplier update failed!');
        } else {
            // Create new supplier
            response = await supplierService.createSupplier(suppliers);
            alert(response ? 'Supplier has been added!' : 'Supplier creation failed!');
        }

        fetchSuppliers(); // Refresh the supplier list
        toggleForm(); // Hide the form after save
    } catch (error: any) {
        console.error('Error saving supplier:', error.message);
        alert('An error occurred while saving the supplier.');
    }
}

// View supplier function
function viewSupplier(id: number) {
    const selectedSupplier = state.suppliers.data.find(s => s.id === id);
    if (selectedSupplier) {
        supplierToView.value = id;
    } else {
        console.error(`Supplier with ID ${id} not found.`);
    }
}

// Delete supplier function
async function deleteSupplier(id: number) {
    try {
        const response = await supplierService.deleteSupplier(id);
        alert(response ? 'Supplier has been deleted!' : 'Supplier deletion failed!');
        fetchSuppliers(); // Refresh the supplier list
    } catch (error: any) {
        console.error(error.message);
    }
}

// Edit supplier function
function editSupplier(id: number) {
    const selectedSupplier = state.suppliers.data.find(s => s.id === id);
    if (selectedSupplier) {
        supplier.value = { ...selectedSupplier };
        supplierToEdit.value = id;
        showForm.value = true;
    } else {
        console.error(`Supplier with ID ${id} not found.`);
    }
}

// Toggle form visibility
function toggleForm() {
    showForm.value = !showForm.value;
    if (!showForm.value) {
        supplier.value = {
            name: '',
            address: '',
            phone: '',
            alternate_phone: '',
            is_active: true,
        };
        supplierToEdit.value = null;
    }
}
</script>
