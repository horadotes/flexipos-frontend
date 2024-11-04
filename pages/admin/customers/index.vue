<template>
    <div>
        <NuxtLayout name="admin">
            <main>

                <Head>
                    <Title>Customers - {{ runtimeConfig.public.appName }}</Title>
                </Head>

                <!-- Add Button and Description -->
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
                    <!-- Add Customer Button -->
                    <div class="mt-4 sm:ml-16 sm:mt-3 sm:flex-none mr-6">
                        <button type="button" @click="toggleForm"
                            class="block rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Add Customer
                        </button>
                    </div>
                </div>
                <div class="sm:flex sm:items-center sm:justify-between mt-4 ml-8">
                    <div class="sm:flex-auto">
                        <h1 class="text-base font-semibold leading-6 text-gray-900">Customers</h1>
                        <p class="mt-2 text-sm text-gray-700">A list of all the customers and their details.</p>
                    </div>
                </div>

                <!-- Customer Form -->
                <div v-if="showForm" class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <form @submit.prevent="saveCustomer">
                            <FormLabel label="Customer Details" class="text-xl" />
                            <Alert type="danger" :text="state?.error?.message" v-if="
                                state.error?.message &&
                                state.error.message.length > 0
                            " />
                            <div class="grid grid-cols-1 gap-1 mt-3 mx-2">
                                <FormLabel for="isactive" label="First Name" class="mr-3" />
                                <div class="flex items-center mb-1">
                                    <FormTextField id="firstname" name="firstname" v-model="customer.firstname"
                                        placeholder="First Name" />
                                    <FormError :error="v$?.firstname?.$errors[0]?.$message.toString()" />
                                    <FormError :error="state?.error?.errors?.firstname?.[0]" />
                                </div>
                                <FormLabel for="isactive" label="Last Name" class="mr-3" />
                                <div class="flex items-center mb-1">
                                    <FormTextField id="lastname" name="lastname" v-model="customer.lastname"
                                        placeholder="Last Name" />
                                    <FormError :error="v$?.formCustomer?.lastname?.$errors[0]?.$message.toString()" />
                                    <FormError :error="state?.error?.errors?.lastname?.[0]" />
                                </div>
                                <FormLabel for="isactive" label="Email" class="mr-3" />
                                <div class="flex items-center mb-1">
                                    <FormTextField id="email" name="email" v-model="customer.email" type="email"
                                        placeholder="Email" />
                                    <FormError :error="v$?.formCustomer?.email?.$errors[0]?.$message.toString()" />
                                    <FormError :error="state?.error?.errors?.email?.[0]" />
                                </div>
                                <FormLabel for="isactive" label="Phone Number" class="mr-3" />
                                <div class="flex items-center mb-1">
                                    <FormNumberField id="phonenumber" name="phonenumber" v-model="customer.phone"
                                        placeholder="Phone Number" />
                                    <FormError
                                        :error="v$?.formCustomer?.phonenumber?.$errors[0]?.$message.toString()" />
                                    <FormError :error="state?.error?.errors?.phone?.[0]" />
                                </div>
                                <FormLabel for="isactive" label="Billing Address" class="mr-3" />
                                <div class="flex items-center mb-1">
                                    <FormTextField id="billingaddress" name="billingaddress" v-model="customer.address"
                                        placeholder="Billing Address" />
                                    <FormError
                                        :error="v$?.formCustomer?.billingaddress?.$errors[0]?.$message.toString()" />
                                    <FormError :error="state?.error?.errors?.billingaddress?.[0]" />
                                </div>
                                <div class="mb-1">
                                    <FormLabel for="isactive" label="isActive" class="mr-3" />
                                    <FormSelectField v-model="selectedIsActive" :options="activeInactiveOptions" />
                                    <FormError :error="v$?.formCustomer?.is_active?.$errors[0]?.$message.toString()" />
                                    <FormError :error="state?.error?.errors?.is_active?.[0]" />
                                </div>
                                <div class="flex justify-end gap-2 mt-4">
                                    <FormButton type="submit" buttonStyle="success" class="w-full">
                                        Save
                                    </FormButton>
                                    <FormButton @click="toggleForm" buttonStyle="xxx" class="w-full">
                                        Cancel
                                    </FormButton>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- View Details -->
                <div v-if="customerToView"
                    class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <div class="grid grid-cols-1 gap-1 mt-3 mx-2">
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">First Name:</label>
                                <span>{{ customer?.firstname }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Last Name:</label>
                                <span>{{ customer?.lastname }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Email:</label>
                                <span>{{ customer?.email }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Phone:</label>
                                <span>{{ customer?.phone }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Billing Address:</label>
                                <span>{{ customer?.address }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Active:</label>
                                <span
                                    :class="customer?.is_active ? 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20' : 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20'">
                                    {{ customer?.is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </div>
                            <div class="flex justify-end gap-2 mt-4">
                                <button @click="customerToView = null"
                                    class="rounded-md bg-gray-200 px-4 py-2 text-xxs font-semibold text-gray-700 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Customer Table -->
                <div>
                    <Alert type="danger" :text="state.error?.message" v-if="state.error" />
                    <div class="table-responsive">
                        <Table :columnHeaders="state.columnHeaders" :data="state.customers"
                            :isLoading="state.isTableLoading" :sortData="state.sortData" @sort="sort">
                            <template #body
                                v-if="!(state.isTableLoading || (state.customers?.data && state.customers?.data.length === 0))">
                                <tr v-for="(customer, index) in state.customers?.data" :key="index">
                                    <td>
                                        <span class="truncate pl-3">{{ customer.firstname }}</span>
                                    </td>
                                    <td>
                                        <span class="pl-3">{{ customer.lastname }}</span>
                                    </td>
                                    <td>
                                        <span class="pl-3">{{ customer.email }}</span>
                                    </td>
                                    <td>
                                        <span class="pl-3">{{ customer.phone }}</span>
                                    </td>
                                    <td>
                                        <span class="pl-3">{{ customer.address }}</span>
                                    </td>
                                    <td>
                                        <span class="pl-3"
                                            :class="customer.is_active ? 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20' : 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20'">
                                            {{ customer.is_active ? 'Active' : 'Inactive' }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-2 text-xxs text-gray-700">
                                        <div class="flex space-x-2">
                                            <button @click="viewCustomer(customer.id)"
                                                class="text-gray-600 hover:text-gray-900">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                    <path fill-rule="evenodd"
                                                        d="M12 4.5C8.798 4.5 6 7.057 6 10.5S8.798 16.5 12 16.5 18 13.943 18 10.5 15.202 4.5 12 4.5ZM12 15.5C10.343 15.5 9 14.156 9 12.5S10.343 9.5 12 9.5 15 10.844 15 12.5 13.657 15.5 12 15.5ZM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM12 20C7.03 20 3 15.97 3 12S7.03 4 12 4s9 4.03 9 9-4.03 9-9 9Z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                            <button @click="editCustomer(customer.id)"
                                                class="text-gray-600 hover:text-gray-900">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                    <path
                                                        d="M4.293 18.293a1 1 0 0 1-.293-.707V16a1 1 0 0 1 .293-.707l8-8a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-.707.293H5a1 1 0 0 1-.707-.293ZM5 16v1a1 1 0 0 0 .293.707L15 9l-1.414-1.414L5.293 16ZM3 12a9 9 0 0 1 15.027-6.088l1.97 1.97A9.005 9.005 0 0 1 21 12a8.96 8.96 0 0 1-1.672 5.163l-1.457-1.457A6.961 6.961 0 0 0 19 12a6.973 6.973 0 0 0-1.25-4.027l-1.457 1.457A8.978 8.978 0 0 1 12 21a9 9 0 0 1-9-9ZM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM12 20c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9Z" />
                                                </svg>
                                            </button>
                                            <!-- <button @click="deleteCustomer(customer.customerID)"
                                                class="text-gray-600 hover:text-gray-900">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                    <path fill-rule="evenodd"
                                                        d="M4 6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1H4V6Zm2 2h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM7 10a1 1 0 0 1 .993.883L8 11v8a1 1 0 0 1-1.993.117L6 19v-8a1 1 0 0 1 1-1Zm7 0a1 1 0 0 1 .993.883L15 11v8a1 1 0 0 1-1.993.117L13 19v-8a1 1 0 0 1 1-1ZM12 2a1 1 0 0 1 .993.883L13 3v1H9V3a1 1 0 0 1 1-1h2Z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button> -->
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </Table>
                    </div>
                    <Pagination :data="state.customers" @previous="previous" @next="next" />
                </div>
            </main>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { customerService } from '~/components/api/admin/CustomerService';
import { helpers, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { useAlert } from '@/composables/alert';
import { useI18n } from 'vue-i18n';
import type { Error } from '@/types/error';

// Define interface for sort data and customers
interface SortData {
    sortField: string;
    sortOrder: "ascend" | "descend" | null;
}

interface Customers {
    data: any[];
    pagination: {
        currentPage: number;
        totalPages: number;
    };
}

// State variables and constants
const runtimeConfig = useRuntimeConfig();
let currentTablePage = 1;

const activeInactiveOptions = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
];

const customer = ref({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    is_active: true, // Changed to boolean
});

const selectedIsActive = computed({
    get: () => customer.value.is_active,
    set: (newValue: boolean) => {
        customer.value.is_active = newValue;
    }
});

const state = reactive({
    columnHeaders: [
        { name: "First Name", sorter: true, key: "firstname" },
        { name: "Last Name", sorter: true, key: "lastname" },
        { name: "Email", sorter: true, key: "email" },
        { name: "Phone", sorter: true, key: "phonenumber" },
        { name: "Billing Address", sorter: false, key: "billingaddress" },
        { name: "Active", sorter: true, key: "isactive" },
        { name: "Actions", key: "actions" },
    ],
    error: null as Error | null,
    isTableLoading: false,
    sortData: { sortField: "", sortOrder: null } as SortData,
    customers: { data: [], pagination: { currentPage: 1, totalPages: 1 } } as Customers,
});

const rules = computed(() => ({
    customer: {
        firstname: {
            required: helpers.withMessage('This field is required.', required),
        },
        lastname: {
            required: helpers.withMessage('This field is required.', required),
        },
        email: {
            required: helpers.withMessage('This field is required.', required),
        },
        phonenumber: {
            required: helpers.withMessage('This field is required.', required),
        },
        billingaddress: {
            required: helpers.withMessage('This field is required.', required),
        },
        isactive: {
            required: helpers.withMessage('This field is required.', required),
        },
    },
}));

// Pass only the form data to useVuelidate
const v$ = useVuelidate(rules, { customer });

// Alert and i18n setup
const { successAlert } = useAlert();
const { errorAlert } = useAlert();
const { t } = useI18n()

onMounted(() => {
    fetchCustomers();
});

async function fetchCustomers() {
    state.isTableLoading = true;
    state.error = null;
    try {
        const params = {
            page: currentTablePage,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
        };
        const response = await customerService.getCustomers();
        state.customers = response;
    } catch (error: any) {
        errorAlert("error", "Something went wrong while fetching customers.");
    }
    state.isTableLoading = false;
}

function previous() {
    if (currentTablePage > 1) {
        currentTablePage--;
        fetchCustomers();
    }
}

function next() {
    if (currentTablePage < state.customers.pagination.totalPages) {
        currentTablePage++;
        fetchCustomers();
    }
}

function sort(sortingData: { column: string; sort: string }) {
    currentTablePage = 1;
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
    fetchCustomers();
}

const customerToEdit = ref<number | null>(null);

async function saveCustomer() {
    try {
        const customerData = {
            firstname: customer.value.firstname,
            lastname: customer.value.lastname,
            email: customer.value.email,
            phone: customer.value.phone,
            address: customer.value.address,
            is_active: customer.value.is_active,
        };

        let response;

        if (customerToEdit.value) {
            // Update existing customer.
            response = await customerService.updateCustomer(customerToEdit.value, customerData);
            if (response) {
                successAlert(`${t('alert.Success')}!`, `${t('alert.customerSuccessfullyUpdated')}.`);
            } else {
                errorAlert(`${t('alert.Error')}!`, `${t('alert.customerUpdateFailed')}.`);
            }
        } else {
            // Create new customer.
            response = await customerService.createCustomer(customerData);
            if (response) {
                successAlert(`${t('alert.Success')}!`, `${t('alert.customerSuccessfullyCreated')}.`);
            } else {
                errorAlert(`ERROR!`, `${t('alert.customerCreationFailed')}.`);
            }
        }

        fetchCustomers(); // Refresh the customer list.
        toggleForm(); // Hide the form after save.
    } catch (error: any) {
        console.error('Error saving customer:', error.message);
        errorAlert(`ERRRORYAWA!`, `${t('alert.errorOccurredWhileSavingCustomer')}.`);
    }
}

// View customer function
function viewCustomer(id: number) {
    const selectedCustomer = state.customers.data.find(c => c.id === id);
    if (selectedCustomer) {
        customer.value = { ...selectedCustomer }; // Set the customer details to be viewed
        customerToView.value = id; // Show the view modal
    } else {
        console.error(`Customer with ID ${id} not found.`);
        errorAlert(`${t('alert.Error')}!`, `${t('alert.errorOccuredWhileViewingCustomer')}.`);
    }
}

const customerToView = ref<number | null>(null);

async function deleteCustomer(id: number) {
    try {
        const response = await customerService.deleteCustomer(id);
        successAlert(`${t('alert.Success')}!`, `${t('alert.customerHasBeenDeleted')}.`);
        fetchCustomers();
    } catch (error: any) {
        errorAlert(`${t('alert.Error')}!`, `${t('alert.customerDeletionFailed')}.`);
        console.error(error.message);
    }
}

function editCustomer(id: number) {
    const selectedCustomer = state.customers.data.find(c => c.id === id);

    if (selectedCustomer) {
        customer.value = { ...selectedCustomer };
        customerToEdit.value = id;
        showForm.value = true;
    } else {
        errorAlert(`${t('alert.Error')}!`, `${t('alert.customerNotFound' + ' With ID:' + { id })}.`);
    }
}

const showForm = ref(false);

function toggleForm() {
    showForm.value = !showForm.value;
    if (!showForm.value) {
        customer.value = {
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            address: '',
            is_active: true, // Changed to boolean
        };
        customerToEdit.value = null;
    }
}
</script>
