<template>
    <NuxtLayout name="admin">
        <main>

            <Head>
                <Title>Credit Memo - {{ runtimeConfig.public.appName }}</Title>
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
                    <input type="text" v-model="searchQuery" placeholder="Search"
                        class="block w-75 rounded-md border border-gray-400 text-sm pl-8 pr-3 py-1.5" />
                </div>
                <!-- Add Credit Memo Button -->
                <div class="mt-4 sm:ml-16 sm:mt-3 sm:flex-none mr-8">
                    <button type="button" @click="toggleForm"
                        class="block rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        ADD CREDIT MEMO
                    </button>
                </div>
            </div>

            <!-- Credit Memo Form -->
            <div v-if="showForm" class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mt-20">
                    <form @submit.prevent="saveCreditMemo">
                        <div class="text-center mb-6">
                            <h2 class="text-xl font-semibold text-gray-800">Credit Memo Details</h2>
                        </div>
                        <Alert type="danger" :text="state?.error?.message"
                            v-if="state.error?.message && state.error.message.length > 0" />

                        <div class="grid grid-cols-1 mt-3 mx-2">
                            <FormLabel for="credittype" label="Credit Memo" class="mr-3" />
                            <div class="flex items-center mb-1">
                                <FormSelect id="credittype" name="credittype" v-model="creditmemo.type"
                                    :options="typeOptions" placeholder="Credit Type" required />
                                <FormError :error="state?.error?.errors?.type?.[0]" />
                            </div>
                            <!-- Customer ID -->
                            <FormLabel label="Customer ID" />
                            <div class="flex items-center mb-1">
                                <FormSelect id="product_category_id" v-model="creditmemo.customer_id"
                                    :options="state.customers.filter(customer => customer.is_active).map(customer => ({ value: customer.id, label: customer.firstname + ' ' + customer.lastname }))"
                                    placeholder="select customer" required />
                            </div>

                            <!-- Sales Representative -->
                            <FormLabel label="Sales Representative" />
                            <div class="flex items-center mb-1">
                                <FormSelect id="employee" v-model="creditmemo.sales_representative"
                                    :options="state.employees.filter(employee => employee.is_active).map(employee => ({ value: employee.id, label: employee.firstname + ' ' + employee.lastname }))"
                                    placeholder="select sales representative" required />
                            </div>
                            <!-- Invoice Number -->
                            <label class="block text-sm font-medium text-gray-700 ml-1 mb-1 mt-1">Invoice No</label>
                            <div class="flex items-center mb-1">
                                <FormSelect id="invoice_no" v-model="creditmemo.invoice_no"
                                    :options="filteredInvoices.map(invoice => ({ value: invoice.invoice_no, label: invoice.invoice_no + ' (' + invoice.amount + ')' }))"
                                    placeholder="select invoice" @change="" required />
                            </div>

                            <!-- Document No (display only, as per retrieved data) -->
                            <div v-if="creditmemo.document_no" class="mb-2">
                                <label class="block text-sm font-medium text-gray-700 ml-1 mb-1">Document No</label>
                                <div class="p-2 border border-gray-300 rounded-md">
                                    {{ creditmemo.document_no }}
                                </div>
                            </div>
                            <div>
                                <FormLabel label="Credit Memo Date" />
                                <div class="flex items-center mb-1">
                                    <FormTextField type="date" id="memodate" name="memodate" v-model="creditmemo.date"
                                        placeholder="Date" required />
                                </div>
                            </div>
                            <div>

                                <label class="block text-sm font-medium text-gray-700 ml-1 mb-2">Remarks</label>
                                <div class="flex items-center mb-3">
                                    <FormTextField for="remarks" name="remarks" v-model="creditmemo.remarks"
                                        placeholder="Remarks" />
                                    <FormError :error="state?.error?.errors?.amount?.[0]" />
                                </div>
                            </div>

                            <label class="block text-sm font-medium text-gray-700 ml-1 ">Amount</label>
                            <div class="flex items-center">
                                <FormTextField for="amount" name="amount" v-model="creditmemo.amount"
                                    placeholder="Amount" required />
                                <FormError :error="state?.error?.errors?.amount?.[0]" />
                            </div>

                            <!-- Form Actions -->
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

            <!-- Table -->
            <Alert type="danger" :text="state.error?.message" v-if="state.error" />
            <div class="table-responsive">
                <Table :columnHeaders="state.columnHeaders" :data="{ data: filteredData }"
                    :isLoading="state.isTableLoading" :sortData="state.sortData" @sort="sort">

                    <template #body>
                        <!-- Display rows if data exists -->
                        <tr v-for="(creditmemo, index) in filteredData" :key="index">
                            <td class="pl-3">{{ creditmemo.credit_type }}</td>
                            <td class="pl-3">{{ creditmemo.customer_id }}</td>
                            <td class="pl-3">{{ creditmemo.sales_representative_id }}</td>
                            <td class="pl-3">{{ creditmemo.invoice_no }}</td>
                            <td class="pl-3">{{ creditmemo.remarks }}</td>
                            <td class="pl-3">{{ creditmemo.date }}</td>
                            <td class="pl-3">₱ {{ Number(creditmemo.amount).toFixed(2) }}</td>
                            <td class="pl-3">
                                <span
                                    :class="{ 'text-red-600': creditmemo.is_cancelled, 'text-green-600': !creditmemo.is_cancelled }">
                                    {{ creditmemo.is_cancelled ? 'Cancelled' : 'Not Cancelled' }}
                                </span>
                            </td>
                            <td class="pl-3">
                                <div class="flex space-x-2">
                                    <button @click="viewBill(creditmemo.id)" class="text-gray-600 hover:text-gray-900">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24"
                                            fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M12 4.5C8.798 4.5 6 7.057 6 10.5S8.798 16.5 12 16.5 18 13.943 18 10.5 15.202 4.5 12 4.5ZM12 15.5C10.343 15.5 9 14.156 9 12.5S10.343 9.5 12 9.5 15 10.844 15 12.5 13.657 15.5 12 15.5ZM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM12 20C7.03 20 3 15.97 3 12S7.03 4 12 4s9 4.03 9 9-4.03 9-9 9Z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                    <!-- <button @click="editBill(creditmemo.id)" class="text-gray-600 hover:text-gray-900">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path
                                                d="M17.414 2.586a2 2 0 00-2.828 0l-10 10V16a1 1 0 001 1h3.414l10-10a2 2 0 000-2.828l-1.586-1.586zM5 13l-1.5 1.5V13h1.5zm4.5-4.5L14 4l2 2-4.5 4.5H9.5V8.5z" />
                                        </svg>
                                    </button>
                                    <button @click="deleteBill(creditmemo.id)" class="text-red-600 hover:text-red-900">
                                        Cancel
                                    </button> -->
                                </div>
                            </td>
                        </tr>
                    </template>
                </Table>
            </div>
        </main>
    </NuxtLayout>
</template>

<script setup lang="ts">
import 'flatpickr/dist/themes/dark.css';
import { ref, reactive, computed } from 'vue';
import type { Error } from '@/types/error';
import { creditMemoService } from '~/components/api/admin/CreditMemoService';
import { customerService } from '~/components/api/admin/CustomerService';
import { employeeService } from '~/components/api/admin/EmployeeService';
import { salesInvoiceService } from '~/components/api/admin/SalesInvoiceService';
// Alert and i18n setup
import { useI18n } from 'vue-i18n';
const { successAlert } = useAlert();
const { errorAlert } = useAlert();
const { warningAlert } = useAlert();
const { t } = useI18n()
const dateConfig = ref<{ dateFormat: string }>({ dateFormat: "m/d/Y" });
const searchQuery = ref('');  // Search query reactive value
const user_id = computed(() => localStorage.getItem('user_id'));
const firstname = computed(() => localStorage.getItem('firstname'));
const lastname = computed(() => localStorage.getItem('lastname'));
const runtimeConfig = useRuntimeConfig();

let currentTablePage = 1;

interface SortData {
    sortField: string;
    sortOrder: "ascend" | "descend" | null;
}

interface CreditMemo {
    id: string;
    prepared_by_id: string;
    cancelled_by_id: string;
    customer_id: string;
    sales_representative_id: string;
    credit_type: string;
    invoice_no: string;
    sales_invoice_document_no: string;
    date: string;
    amount: string;
    remarks: string;
    is_cancelled: boolean;
}

interface Customer {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    is_active: boolean; // Changed to boolean
}

interface Employee {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    role: string;
    is_active: boolean;
}

interface SalesInvoice {
    id: number;
    invoice_no: string;
    document_no: string;
    customer_id: string;
    date: string;
    amount: string;
    is_cancelled: boolean;
}

const state = reactive({
    columnHeaders: [
        { key: 'credit_type', name: 'Credit Type', field: 'credit_type' },
        { key: 'customer_id', name: 'Customer ID', field: 'customer_id' },
        { key: 'sales_representative_id', name: 'Sales Representative ID', field: 'sales_representative_id' },
        { key: 'invoice_no', name: 'Invoice No', field: 'invoice_no' },
        { key: 'remarks', name: 'Remarks', field: 'remarks' },
        { key: 'date', name: 'Date', field: 'date' },
        { key: 'amount', name: 'Amount', field: 'amount' },
        { key: 'is_cancelled', name: 'Status', field: 'is_cancelled' },
        { key: 'actions', name: 'Actions', field: 'actions', sortable: false },
    ],
    isTableLoading: false,
    error: null as Error | null,
    sortData: { sortField: '', sortOrder: null } as SortData,
    creditMemos: [] as CreditMemo[],
    customers: [] as Customer[],
    employees: [] as Employee[],
    salesinvoices: [] as SalesInvoice[],
    selectedCustomerId: null as number | null,
    creditmemo: {
        customer_id: null,
        sales_representative: null,
        invoice_no: null,
    },
});


const typeOptions = [
    { value: 'Discount', label: 'Discount' },
    { value: 'PriceAdjustment', label: 'Price Adjustment' },
    { value: 'TaxAdjustment', label: 'Tax Adjustment' }
];

const fetchCreditMemos = async () => {
    state.isTableLoading = true;
    state.error = null;
    try {
        const response = await creditMemoService.getCreditMemos();
        state.creditMemos = response.data || [];
    } catch (error: any) {
        state.error = error;
    }
    state.isTableLoading = false;

};

async function fetchCustomers() {
    state.error = null;
    try {
        const response = await customerService.getCustomers();
        state.customers = response.data;
        if (state.creditMemos && state.creditMemos) {
            state.creditMemos.forEach((invoice: any) => {
                const selectedCustomer = state.customers.find(customer => customer.id === invoice.customer_id);
                invoice.customer_id = selectedCustomer ? `${selectedCustomer.firstname} ${selectedCustomer.lastname}` : 'Unknown';
            });
        }
    } catch (error: any) {
        state.error = error;
    }
}

async function fetchEmployees() {
    state.error = null;
    try {
        const response = await employeeService.getEmployees();
        state.employees = response.data;
        if (state.creditMemos && state.creditMemos) {
            state.creditMemos.forEach((invoice: any) => {
                const selectedEmployee = state.employees.find(employee => employee.id === invoice.sales_representative_id);
                invoice.sales_representative_id = selectedEmployee ? `${selectedEmployee.firstname} ${selectedEmployee.lastname}` : 'Unknown';
            });
        }
    } catch (error: any) {
        state.error = error;
    }
}

async function fetchInvoices() {
    state.error = null;
    try {
        const response = await salesInvoiceService.getSalesInvoices();
        state.salesinvoices = response.data;
    } catch (error: any) {
        errorAlert('Error', 'Failed to fetch invoices');
        state.error = error;
    }
}

async function fetchInvoicesForCustomer() {
    state.error = null;
    try {
        const response = await salesInvoiceService.getSalesInvoices();
        console.log("Fetched invoices:", response.data);  // Debug: Log all fetched invoices

        // Filter invoices by creditmemo.customer_id if it exists
        let filteredInvoices = response.data;

        // If customer_id exists, filter by customer
        if (state.creditmemo.customer_id) {
            filteredInvoices = filteredInvoices.filter((invoice: any) => {
                console.log("Checking invoice customer:", invoice.customer_id, "against", state.creditmemo.customer_id);
                return String(invoice.customer_id) === String(state.creditmemo.customer_id);
            });
        }

        // Now filter invoices to only include those with a non-zero amount
        filteredInvoices = filteredInvoices.filter((invoice: any) => parseFloat(invoice.amount) !== 0);

        // Set the final filtered invoices to the state
        state.salesinvoices = filteredInvoices;

        console.log("Filtered invoices:", state.salesinvoices);  // Debug: Log filtered invoices

    } catch (error: any) {
        errorAlert('Error', 'Failed to fetch invoices');
        state.error = error;
    }
}

const filteredData = computed(() => {
    if (!searchQuery.value) {
        return state.creditMemos;
    }
    const query = searchQuery.value.toLowerCase();

    return state.creditMemos.filter((creditmemo: CreditMemo) =>
        Object.values(creditmemo).some(value =>
            String(value).toLowerCase().includes(query)
        )
    );
});

const creditmemo = ref({
    id: '',
    type: '',
    customer_id: '',
    sales_representative: '',
    invoice_no: '',
    document_no: '',
    date: '',
    remarks: '',
    amount: '',
    is_active: true,
});

const showForm = ref(false);

function toggleForm() {
    showForm.value = !showForm.value;
    if (!showForm.value) {
        creditmemo.value = {
            id: '',
            type: '',
            customer_id: '',
            sales_representative: '',
            invoice_no: '',
            document_no: '',
            date: '',
            remarks: '',
            amount: '',
            is_active: true,
        };
    }
}

async function saveCreditMemo() {
    try {
        const creditMemoData = {
            prepared_by_id: user_id.value,
            cancelled_by_id: '',
            sales_representative_id: creditmemo.value.sales_representative,
            customer_id: creditmemo.value.customer_id,
            credit_type: creditmemo.value.type,
            invoice_no: creditmemo.value.invoice_no,
            sales_invoice_document_no: creditmemo.value.document_no,
            date: creditmemo.value.date,
            amount: creditmemo.value.amount,
            remarks: creditmemo.value.remarks,
            is_cancelled: false,
        };

        const response = await creditMemoService.createCreditMemo(creditMemoData);
        console.log(response);

        if (response) {
            successAlert(`${t('alert.Success')}!`, `Product created successfully!`);
            Loaders();

            // Close the form and reset the fields after successful insertion
            showForm.value = false;
            creditmemo.value = {
                id: '',
                type: '',
                customer_id: '',
                sales_representative: '',
                invoice_no: '',
                document_no: '',
                date: '',
                remarks: '',
                amount: '',
                is_active: true,
            };
        } else {
            errorAlert(`${t('alert.Error')}!`, `Error occurred while creating credit memo.`);
        }
    } catch (error: any) {
        console.error('Error saving product:', error.message);
        errorAlert(`${t('alert.Error')}!`, `${t('alert.errorOccurredWhileSavingProduct')}.`);
    }
}


function sort(sortData: SortData) {
    state.sortData = sortData;
}

function viewBill(billId: string) {
}

function editBill(billId: string) {
}

function deleteBill(billId: string) {

}

// Filtered invoices based on the selected customer
const filteredInvoices = computed(() => {
    return state.salesinvoices.filter(invoice => invoice.customer_id === creditmemo.value.customer_id)
})

// Fetch invoices when the component is mounted or when the customer_id changes
watch(() => state.creditmemo.customer_id, fetchInvoicesForCustomer);

// Watch for changes in the selected invoice and retrieve document_no
watch(
    () => creditmemo.value.invoice_no,
    (newInvoiceNo) => {
        if (newInvoiceNo) {
            const selectedInvoice = state.salesinvoices.find(invoice => invoice.invoice_no === newInvoiceNo)
            if (selectedInvoice) {
                creditmemo.value.document_no = selectedInvoice.document_no
            }
        }
    }
)

// Watch for changes in the selected customer and clear invoice and document_no data
watch(
    () => creditmemo.value.customer_id,
    (newCustomerId, oldCustomerId) => {
        if (newCustomerId !== oldCustomerId) {
            creditmemo.value.invoice_no = ''
            creditmemo.value.document_no = ''
            fetchInvoicesForCustomer()
        }
    }
)

async function Loaders() {
    await fetchCreditMemos();
    await fetchCustomers();
    await fetchEmployees();
    await fetchInvoices();
}

onMounted(() => {
    Loaders();
});

</script>