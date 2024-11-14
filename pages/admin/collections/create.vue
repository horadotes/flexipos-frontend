<template>
    <div>
        <NuxtLayout name="admin">
            <main class="w-full mx-auto">

                <Head>
                    <Title>Collections - {{ runtimeConfig.public.appName }}</Title>
                </Head>
                <div>
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center" aria-hidden="true">
                            <div class="w-full border-t border-gray-300" />
                        </div>
                        <div class="relative flex">
                            <h2 class="bg-white text-lg font-semibold">COLLECTIONS</h2>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div class="flex items-center space-x-4 mt-8">
                            <div class="w-1/2">
                                <FormLabel label="Customer" />
                                <FormSelect id="supplier_id" v-model="state.selectedCustomerId"
                                    :options="state.customers.map(s => ({ value: s.id, label: s.firstname + ' ' + s.lastname }))"
                                    placeholder="select supplier" required />
                            </div>
                            <div class="w-1/2">
                                <FormLabel label="Is Cancelled" />
                                <FormSelect v-model="payment.is_cancelled" :options="[
                                    { value: false, label: 'No' },
                                    { value: true, label: 'Yes' },
                                ]">
                                </FormSelect>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4 mt-8">
                            <div class="w-1/4">
                                <FormLabel label="Payment Type" />
                                <FormSelect v-model="payment.payment_type" :options="[
                                    { value: 'cash', label: 'Cash' },
                                    { value: 'cheque', label: 'Cheque' },
                                    { value: 'gcash', label: 'Gcash' },
                                ]">
                                </FormSelect>
                            </div>
                            <div class="w-1/4">
                                <FormLabel label="Cash Voucher Number" />
                                <FormTextField id="cashvoucher" name="cashvoucher" v-model="makepayment.cash_voucher_no"
                                    placeholder="voucher number" />
                            </div>
                            <div class="w-1/4">
                                <FormLabel label="Date" />
                                <input id="date" type="date" v-model="makepayment.date"
                                    class="block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm px-3 py-2"
                                    required />
                            </div>
                            <div class="w-1/4">
                                <FormLabel label="Prepared By" />
                                <FormNumberField for="prepared_by_id" name="prepared_by_id"
                                    :placeholder="`${firstname} ${lastname}`" :value="`${firstname} ${lastname}`"
                                    readonly class="block cursor-default bg-gray-200" />
                            </div>
                        </div>
                        <div v-if="state.selectedCustomerId" class="relative">
                            <div class="absolute inset-0 flex items-center" aria-hidden="true">
                                <div class="w-full border-t border-gray-300" />
                            </div>
                            <div class="relative flex">
                                <h2 class="bg-white text-lg font-semibold">COLLECTION DETAILS</h2>
                            </div>
                        </div>
                        <!--v-if="state.selectedCustomerId"-->
                        <div class="flex mt-8">
                            <div class="w-full">
                                <div class="relative">
                                    <div class="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div class="w-full border-t border-gray-300" />
                                    </div>
                                    <div class="relative flex">
                                        <h2 class="bg-white text-lg font-normal">Unpaid Invoices</h2>
                                    </div>
                                </div>
                                <!-- Product Table -->
                                <Alert type="danger" :text="state.error?.message" v-if="state.error" />
                                <div class="table-responsive">
                                    <Table :columnHeaders="state.unpaidInvoiceColumnHeader" :data="state.unpaidInvoices"
                                        :isLoading="state.isTableLoading" :sortData="state.sortData" @sort="sort">
                                        <template #body
                                            v-if="!state.isTableLoading && state.unpaidInvoices?.data.length">
                                            <tr v-for="(invoice, index) in state.unpaidInvoices?.data" :key="index">
                                                <td class="pl-3">
                                                    {{ invoice.id }}
                                                </td>
                                                <td class="pl-3">
                                                    {{ invoice.invoice_no }}
                                                </td>
                                                <td class="pl-3">
                                                    {{ invoice.date }}
                                                </td>
                                                <td class="pl-3">
                                                    {{ invoice.amount }}
                                                </td>
                                                <td class="pl-3">
                                                    <FormButton button-style="warning" @click="selectInvoice(invoice)">
                                                        Select
                                                    </FormButton>
                                                </td>
                                            </tr>
                                        </template>
                                    </Table>
                                </div>
                                <!-- <Pagination :data="state.categories" @previous="previous" @next="next" /> -->
                            </div>
                        </div>
                        <div v-if="state.selectedCustomerId" class="flex space-x-4 mt-8">
                            <div class="w-1/2">
                                <FormLabel label="Bill ID" />
                                <FormNumberField id="billid" name="Bill ID" v-model="selectedInvoiceInput.id"
                                    placeholder="Bill ID" />
                                <FormLabel label="Purchase Order Number" />
                                <FormTextField id="ponumber" name="ponumber" v-model="selectedInvoiceInput.invoice_no"
                                    placeholder="Purchase Order Number" />
                                <FormLabel label="Date" />
                                <FormTextField id="date" name="date" v-model="selectedInvoiceInput.date"
                                    placeholder="Date" />
                                <FormLabel label="amount" />
                                <FormNumberField id="amount" name="amount" v-model="selectedInvoiceInput.amount"
                                    placeholder="Amount" />
                                <FormLabel label="Payment Amount" />
                                <FormNumberField id="paymentamount" name="paymentamount"
                                    v-model="selectedInvoiceInput.amount_to_pay" placeholder="Payment Amount" />
                                <FormButton class="mt-3 w-full" button-style="success" @click="addInvoicePaymentDetail">
                                    Add Invoices
                                    Payment
                                    Detail
                                </FormButton>
                            </div>
                            <div class="w-1/2">
                                <FormButton v-if="payment.payment_type === 'cheque'" button-style="xxx"
                                    @click="toggleForm">Add
                                    Cheque
                                </FormButton>
                                <FormLabel v-if="payment.payment_type === 'cheque'" label="Cheque Amount" />
                                <FormNumberField v-if="payment.payment_type === 'cheque'"
                                    v-model="formattedChequeAmount" name="chequeamount" placeholder="Cheque Amount"
                                    readonly />
                                <FormLabel v-if="payment.payment_type === 'gcash'" label="Gcash Amount" />
                                <FormNumberField v-if="payment.payment_type === 'gcash'" v-model="payment.gcash"
                                    name="gcashamount" placeholder="Gcash Amount" />
                                <FormLabel v-if="payment.payment_type === 'gcash'" label="Gcash Reference Number" />
                                <FormNumberField v-if="payment.payment_type === 'gcash'"
                                    v-model="payment.gcashreference" name="gcashreference"
                                    placeholder="Gcash Reference Number" />
                                <FormLabel label="Cash Amount" />
                                <FormNumberField v-model="payment.cash" name="cashamount" placeholder="Cash Amount" />
                                <FormLabel label="Total Amount" />
                                <FormNumberField v-model="formattedPaymentAmount" name="totalamount"
                                    placeholder="Total Amount" readonly />
                                <FormLabel label="Amount To Pay" />
                                <FormNumberField v-model="formattedTotalAmountToPay" name="totalamount"
                                    placeholder="Amount to Pay" readonly />
                            </div>
                        </div>
                        <div class="flex space-x-4 mt-8">
                            <div v-if="state.selectedCustomerId" class="w-full">
                                <div class="relative">
                                    <div class="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div class="w-full border-t border-gray-300" />
                                    </div>
                                    <div class="relative flex">
                                        <h2 class="bg-white text-lg font-normal">Cheque Details</h2>
                                    </div>
                                </div>
                                <!-- Product table -->
                                <Alert type="danger" :text="state.error?.message" v-if="state.error" />
                                <div class="table-responsive">
                                    <Table :columnHeaders="state.chequeDetailColumnHeader" :data="state.cheques"
                                        :isLoading="state.isTableLoading" :sortData="state.sortData" @sort="sort">
                                        <template #body v-if="!state.isTableLoading && state.cheques?.data.length">
                                            <tr v-for="(cheque, index) in state.cheques?.data" :key="index">
                                                <td class="pl-3">
                                                    {{ cheque.voucher_number }}
                                                </td>
                                                <td class="pl-3">
                                                    {{ cheque.payee }}
                                                </td>
                                                <td class="pl-3">
                                                    {{ cheque.bank }}
                                                </td>
                                                <td class="pl-3">
                                                    {{ cheque.cheque_number }}
                                                </td>
                                                <td class="pl-3">
                                                    {{ cheque.cheque_date }}
                                                </td>
                                                <td class="pl-3">
                                                    {{ cheque.amount }}
                                                </td>
                                            </tr>
                                        </template>
                                    </Table>
                                </div>
                                <!-- <Pagination :data="state.categories" @previous="previous" @next="next" /> -->
                            </div>
                            <div v-if="state.selectedCustomerId" class="w-full">
                                <div class="relative">
                                    <div class="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div class="w-full border-t border-gray-300" />
                                    </div>
                                    <div class="relative flex">
                                        <h2 class="bg-white text-lg font-normal">Selected Invoices</h2>
                                    </div>
                                </div>
                                <!-- Product table -->
                                <Alert type="danger" :text="state.error?.message" v-if="state.error" />
                                <div class="table-responsive">
                                    <Table :columnHeaders="state.selectedInvoiceColumnHeader"
                                        :data="state.selectedInvoices" :isLoading="state.isTableLoading"
                                        :sortData="state.sortData" @sort="sort">
                                        <template #body
                                            v-if="!state.isTableLoading && state.selectedInvoices?.data.length">
                                            <tr v-for="(invoice, index) in state.selectedInvoices?.data" :key="index">
                                                <td class="pl-3">
                                                    {{ invoice.id }}
                                                </td>
                                                <td class="pl-3">
                                                    {{ invoice.invoice_no }}
                                                </td>
                                                <td class="pl-3">
                                                    {{ invoice.date }}
                                                </td>
                                                <td class="pl-3">
                                                    {{ invoice.amount }}
                                                </td>
                                                <td class="pl-3">
                                                    {{ invoice.amount_to_pay }}
                                                </td>
                                            </tr>
                                        </template>
                                    </Table>
                                </div>
                                <!-- <Pagination :data="state.categories" @previous="previous" @next="next" /> -->
                            </div>
                        </div>
                        <div v-if="state.selectedCustomerId" class="flex space-x-4 mt-8">

                        </div>
                        <div v-if="isPaymentAmountValid" class="flex space-x-4 mt-8">
                            <div class="w-full">
                                <FormButton class="w-full" button-style="success" @click="makePayment">Make
                                    Payment
                                </FormButton>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Category Form -->
                <div v-if="showForm" class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <form @submit.prevent="addCheque()">
                            <div class="grid grid-cols-1 gap-1 mt-3 mx-2">
                                <!-- Category Name Field -->
                                <div class="mb-1">
                                    <FormLabel label="Voucher Number" />
                                    <FormTextField id="vouchernum" name="vouchernum"
                                        v-model="chequeDetail.voucher_number" placeholder="Voucher Number" required />
                                    <FormLabel label="Payee" />
                                    <FormTextField id="payee" name="payee" v-model=chequeDetail.payee
                                        placeholder="Payee" />
                                    <FormLabel label="Bank" />
                                    <FormTextField id="bank" name="bank" v-model="chequeDetail.bank" placeholder="Bank"
                                        required />
                                    <FormLabel label="Cheque Number" />
                                    <FormTextField id="chequenumber" name="chequenumber"
                                        v-model="chequeDetail.cheque_number" placeholder="Cheque Number" required />
                                    <FormLabel label="Cheque Date" />
                                    <FormTextField type="date" id="chequedate" name="chequedate"
                                        v-model="chequeDetail.cheque_date" placeholder="Cheque Date" required />
                                    <FormLabel label="Amount" />
                                    <FormNumberField id="amount" name="amount" v-model="chequeDetail.amount"
                                        placeholder="Amount" required />
                                </div>
                                <!-- Action Buttons -->
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
            </main>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed, warn } from 'vue';
import type { Error } from '@/types/error';
import { customerService } from '~/components/api/admin/CustomerService';
import { salesInvoiceService } from '~/components/api/admin/SalesInvoiceService';
import { salesInvoiceDetailService } from '~/components/api/admin/SalesInvoiceDetailService';
import { paymentDetailService } from '~/components/api/admin/PaymentDetailService';
import { paymentService } from '~/components/api/admin/PaymentService';

// Alert and i18n setup
import { useI18n } from 'vue-i18n';
import { paymentChequeService } from '~/components/api/admin/PaymentChequeService';
const { successAlert } = useAlert();
const { errorAlert } = useAlert();
const { warningAlert } = useAlert();
const { t } = useI18n()

const user_id = computed(() => localStorage.getItem('user_id'));
const firstname = computed(() => localStorage.getItem('firstname'));
const lastname = computed(() => localStorage.getItem('lastname'));
const runtimeConfig = useRuntimeConfig();

const showForm = ref(false);

function toggleForm() {
    showForm.value = !showForm.value;
}

let currentTablePage = 1;

interface SalesInvoiceDetail {
    id: number;
    sales_invoice_id: string;
    product_id: string;
    sales_invoice_ref_doc_no: string;
    barcode: string;
    unit: string;
    expiry_date: string;
    quantity: string;
    price: string;
}

interface UnpaidInvoices {
    data: any[];
}

interface SelectedInvoices {
    data: any[];
}

interface Cheques {
    data: any[];
}

interface Customer {
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    address: string,
    is_active: boolean,
}

const customer = reactive({
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    is_active: true,
});

interface Payment {
    customer_id: string;
    payment_type: string;
    voucher_number: string;
    date: string;
    amount: string;
    is_cancelled: boolean;
}

const payment = reactive({
    customer_id: '',
    payment_type: 'cash',
    voucher_number: '',
    date: '',
    gcash: '',
    gcashreference: '',
    cheque: '',
    cash: '',
    amount: '',
    is_cancelled: false,
});

interface MakePayment {
    customer_id: number;
    prepared_by_id: number;
    approved_by_id: number;
    cancelled_by_id: number;
    payment_type: string;
    cash_voucher_no: string;
    date: string;
    is_cancelled: boolean;
}

const makepayment = reactive({
    customer_id: user_id.value,
    prepared_by_id: user_id.value,
    approved_by_id: '',
    cancelled_by_id: '',
    payment_type: payment.payment_type,
    cash_voucher_no: payment.voucher_number,
    date: payment.date,
    is_cancelled: payment.is_cancelled,
});

interface selectedInvoiceInput {
    id: string;
    invoice_no: string;
    date: string;
    amount: string;
    amount_to_pay: string;
    document_no: string;
}

const selectedInvoiceInput = reactive({
    id: '',
    invoice_no: '',
    date: '',
    amount: '',
    amount_to_pay: '',
    document_no: '',
});


const chequeDetail = reactive({
    voucher_number: '',
    payee: '',
    bank: '',
    cheque_number: '',
    cheque_date: '',
    amount: '',
});

interface SortData {
    sortField: string;
    sortOrder: "ascend" | "descend" | null;
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
    fetchInvoices();
}

// Computed property to check if payment amount is valid
const isPaymentAmountValid = computed(() => {
    return paymentAmountNumber.value > 0;
});

const totalChequeAmount = computed(() => {
    return state.cheques?.data.reduce((total, cheque) => total + Number(cheque.amount), 0);
});

const formattedChequeAmount = computed(() => {
    return totalChequeAmount.value.toFixed(2);
});

const totalAmountToPay = computed(() => {
    return state.selectedInvoices?.data.reduce((total, invoice) => total + Number(invoice.amount_to_pay), 0);
});

const formattedTotalAmountToPay = computed(() => {
    return totalAmountToPay.value.toFixed(2);
});

const formattedPaymentAmount = computed({
    get() {
        return paymentAmountNumber.value.toFixed(2);;
    },
    set(value) {
        paymentAmountNumber.value = Number(value);
    }
});

const paymentAmountNumber = computed({
    get() {
        return Number(payment.gcash) + Number(totalChequeAmount.value) + Number(payment.cash);
    },
    set(value) {
        payment.amount = value.toString();
    },
});

const state = reactive({
    unpaidInvoiceColumnHeader: [
        { name: "ID", sorter: true, key: "id" },
        { name: "Invoice Number", sorter: true, key: "invoice_no" },
        { name: "Date", sorter: true, key: "date" },
        { name: "Balance", sorter: true, key: "amount" },
        { name: "Actions", sorter: true, key: "actions" },
    ],
    selectedInvoiceColumnHeader: [
        { name: "ID", sorter: true, key: "id" },
        { name: "Invoice Number", sorter: true, key: "invoice_no" },
        { name: "Date", sorter: true, key: "date" },
        { name: "Amount", sorter: true, key: "amount" },
        { name: "Payment Amount", sorter: true, key: "paymentamount" },
    ],
    chequeDetailColumnHeader: [
        { name: "Voucher Number", sorter: true, key: "voucher_number" },
        { name: "Payee", sorter: true, key: "payee" },
        { name: "Bank", sorter: true, key: "bank" },
        { name: "Cheque Number", sorter: true, key: "cheque_number" },
        { name: "Cheque Date", sorter: true, key: "cheque_date" },
        { name: "Amount", sorter: true, key: "amount" },
    ],
    isTableLoading: false,
    error: null as Error | null,
    sortData: { sortField: 'id', sortOrder: 'ascend' } as SortData,
    salesInvoiceDetail: [] as SalesInvoiceDetail[],
    unpaidInvoices: { data: [] } as UnpaidInvoices,
    selectedInvoices: { data: [] } as SelectedInvoices,
    cheques: { data: [] } as Cheques,
    customers: [] as Customer[],
    payments: [] as Payment[],
    makepaymentsData: [] as MakePayment[],
    selectedCustomerId: null as number | null,
});

async function fetchCustomers() {
    try {
        const response = await customerService.getCustomers();
        console.log(response);  // Log to see if the data structure matches expectations
        state.customers = response.data.filter((customer: Customer) => customer.is_active);
    } catch (error) {
        console.error(error);
    }
}

async function fetchInvoices() {
    state.error = null;
    state.isTableLoading = true;

    try {
        // Fetch all invoices
        const response = await salesInvoiceService.getSalesInvoices();
        console.log("Fetched invoices:", response.data);  // Debug: Log all fetched invoices

        // Filter invoices by selected customer ID if it exists
        if (state.selectedCustomerId) {
            const filteredInvoices = response.data.filter((invoice: any) => {
                console.log("Checking invoice customer:", invoice.customer_id, "against", state.selectedCustomerId);
                return String(invoice.customer_id) === String(state.selectedCustomerId);
            });

            state.unpaidInvoices = { data: filteredInvoices };
        } else {
            // If no customer is selected, show all invoices
            state.unpaidInvoices = response;
        }

    } catch (error: any) {
        errorAlert('Error', 'Failed to fetch invoices');
    }

    state.isTableLoading = false;
}

async function fetchSalesInvoiceDetail() {
    try {
        const response = await salesInvoiceDetailService.getSalesInvoiceDetails();
        state.salesInvoiceDetail = response.data; // Adjust if necessary based on API response structure
        console.log(response.data);  // Log to see if the data structure matches expectations
    } catch (error) {
        console.error(error);
    }
}

function selectInvoice(invoice: any) {
    const selectedInvoice = state.unpaidInvoices.data.find((i) => i.id === invoice.id);
    if (selectedInvoice) {
        // Populate selectedInvoiceInput with the selected invoice's data
        selectedInvoiceInput.id = selectedInvoice.id.toString();
        selectedInvoiceInput.invoice_no = selectedInvoice.invoice_no.toString();
        selectedInvoiceInput.date = selectedInvoice.date;
        selectedInvoiceInput.amount = selectedInvoice.amount;
        selectedInvoiceInput.document_no = selectedInvoice.document_no;
    }
    console.log("Selected invoice:", selectedInvoiceInput.document_no);
}

function addCheque() {
    const newCheque = {
        voucher_number: chequeDetail.voucher_number,
        payee: chequeDetail.payee,
        bank: chequeDetail.bank,
        cheque_number: chequeDetail.cheque_number,
        cheque_date: chequeDetail.cheque_date,
        amount: chequeDetail.amount,
    };

    state.cheques.data.push(newCheque);
    showForm.value = false;

    // Optionally clear the form
    chequeDetail.voucher_number = '';
    chequeDetail.payee = '';
    chequeDetail.bank = '';
    chequeDetail.cheque_number = '';
    chequeDetail.cheque_date = '';
    chequeDetail.amount = '';
}

function addInvoicePaymentDetail() {
    console.log("selected invoice amount to pay input: ", selectedInvoiceInput.amount_to_pay);
    console.log("selected invoice details: ", state.selectedInvoices.data);

    const invoiceDetail = {
        id: selectedInvoiceInput.id,
        invoice_no: selectedInvoiceInput.invoice_no,
        date: selectedInvoiceInput.date,
        amount: selectedInvoiceInput.amount,
        amount_to_pay: Number(selectedInvoiceInput.amount_to_pay).toFixed(2),
        document_no: selectedInvoiceInput.document_no,
    };
    console.log("Selected invoice:", invoiceDetail);
    state.selectedInvoices.data.push(invoiceDetail);
}

async function makePayment() {
    try {
        // Prepare the master invoice object
        const masterInvoice = {
            prepared_by_id: user_id.value,
            customer_id: state.selectedCustomerId,
            approvedby: '',
            is_approved: '',
            is_cancelled: payment.is_cancelled,
            payment_date: makepayment.date,
            cancelled_by_id: '',
            remarks: 'SALES INVOICE PAYMENT',
        };

        // Create the payment and get the response
        const response = await paymentService.createPayment(masterInvoice);
        console.log('Payment service response:', response);

        if (response && response.data.id) {
            console.log(response);

            // Loop through selected invoices and create payment invoice details
            for (const detail of state.selectedInvoices.data) {
                const paymentInvoiceDetail = {
                    payment_id: response.data.id,
                    sales_invoice_no: detail.invoice_no,
                    payment_method_id: payment.payment_type,
                    amount: payment.cash,
                };

                console.log('Saving payment invoice detail:', paymentInvoiceDetail);
                const result = await paymentDetailService.createPaymentDetail(paymentInvoiceDetail);

                if (result) {
                    console.log('Payment detail saved successfully:', result);
                } else {
                    console.error('Failed to save payment detail:', paymentInvoiceDetail);
                }
            }

            console.log(payment.payment_type);

            if (payment.payment_type === 'cheque') {
                console.log('inserting cheque details to db');
                for (const cheque of state.cheques.data) {
                    const chequeData = {
                        payment_id: response.data.id,
                        cheque_voucher_number: cheque.voucher_number,
                        payee: cheque.payee,
                        bank: cheque.bank,
                        cheque_number: cheque.cheque_number,
                        cheque_date: cheque.cheque_date,
                        amount: Number(cheque.amount),
                    };
                    console.log('Cheque Data:', chequeData);
                    const chequeResult = await paymentChequeService.createPaymentCheque(chequeData);
                    if (chequeResult) {
                        console.log('Cheque saved successfully:', chequeResult);
                    } else {
                        console.error('Failed to save cheque:', chequeData);
                    }
                }
            } else {
                console.log('cash payment no need to save cheque details.');
            }

            successAlert(t('alert.payment_created'), t('alert.success'));
            navigateTo('/admin/collections');
        } else {
            errorAlert(t('Error'), t('Failed to create payment.'));
        }
    } catch (error: any) {
        console.error('Error saving payment:', error.message);
        errorAlert(t('Error'), t('An error occurred while saving the payment.'));
    }
}

async function savePayment() {
    try {
        // Prepare the master invoice object
        const masterInvoice = {
            prepared_by_id: user_id.value,
            customer_id: state.selectedCustomerId,
            approvedby: '',
            is_approved: '',
            is_cancelled: payment.is_cancelled,
            payment_date: makepayment.date,
            cancelled_by_id: '',
            remarks: 'SALES INVOICE PAYMENT',
        };

        // Create the payment and get the response
        const response = await paymentService.createPayment(masterInvoice);
        console.log('Payment service response:', response);

        // Check if the response and required data exist
        if (response && response.data && response.data.id) {
            console.log('Payment created with ID:', response.data.id);

            // Fetch sales invoice details
            await fetchSalesInvoiceDetail();

            // Loop through selected invoices and create payment invoice details
            for (const detail of state.selectedInvoices.data) {
                if (!detail.invoice_no || !detail.amount_to_pay) {
                    console.warn('Missing detail data:', detail);
                    continue; // Skip if required detail data is missing
                }

                // Fetch all corresponding sales invoice details
                const salesInvoice = state.selectedInvoices.data.filter(invoice => invoice.invoice_no === detail.invoice_no);
                console.log('salesInvoiceDetails:', salesInvoice);

                if (salesInvoice.length > 0) {
                    if (payment.payment_type === 'cheque') {
                        for (const cheque of state.cheques.data) {
                            const paymentInvoiceDetail = {
                                payment_id: response.data.id,
                                payment_method_id: payment.payment_type,
                                bank_id: cheque.bank,
                                cheque_number: cheque.cheque_number,
                                cheque_date: cheque.cheque_date,
                                amount: cheque.amount,
                                sales_invoice_no: detail.invoice_no,
                            };
                            console.log('Cheque Details:', paymentInvoiceDetail);
                            // Send paymentInvoiceDetail to backend
                            await paymentDetailService.createPaymentDetail(paymentInvoiceDetail);
                        }
                    } else {
                        for (const salesInvoiceDetail of salesInvoice) {
                            const paymentInvoiceDetail = {
                                payment_id: response.data.id,
                                sales_invoice_no: detail.invoice_no,
                                payment_method_id: payment.payment_type,
                                bank_id: '',
                                cheque_number: '',
                                cheque_date: '',
                                amount: detail.amount_to_pay,
                            };
                            console.log('Payment invoice detail:', paymentInvoiceDetail);
                            // Send paymentInvoiceDetail to backend
                            await paymentDetailService.createPaymentDetail(paymentInvoiceDetail);
                        }
                    }
                    navigateTo('/admin/collections');
                } else {
                    warningAlert('No matching sales invoice detail found for invoice_no:', detail.invoice_no);
                    console.log('Detail:', detail);
                }
            }

            successAlert(t('Success'), t('Payment saved successfully.'));
        } else {
            errorAlert(t('Error'), t('Failed to create payment.'));
        }
    } catch (error: any) {
        console.error('Error saving invoice:', error.message);
        errorAlert('Error', 'An error occurred while saving the invoice.');
    }
}

const paymentInvoice = {
    payment_id: '',
    sales_invoice_id: '',
    amount: '',
    date: '',
};

watch(() => payment.amount, (newAmount) => {
    console.log('Payment amount changed:', newAmount);
});

watch(
    () => state.selectedCustomerId,
    (newValue, oldValue) => {
        console.log("Supplier changed from", oldValue, "to", newValue);  // Debug: Log supplier change
        fetchInvoices();
        state.selectedInvoices.data = [];
    }
);

watch(
    () => customer.id,
    (newCustomerId) => {
        // Find the selected product based on the selected product_id
        const selectedCustomer = state.customers.find(customer => customer.id === newCustomerId);

        // Update the name in billDetail if the selected product exists
        if (selectedCustomer) {
            customer.id = selectedCustomer.id;
            customer.firstname = selectedCustomer.firstname;
            customer.lastname = selectedCustomer.lastname;
            customer.email = selectedCustomer.email;
            customer.phone = selectedCustomer.phone;
            customer.address = selectedCustomer.address;
        } else {
            customer.firstname = '';
            customer.lastname = '';
            payment.payment_type = 'Cash';
            customer.email = '';
            customer.phone = '';
            customer.address = '';
        }
    }
);

// onMounted Hook to fetch initial data
onMounted(async () => {
    fetchCustomers();
    fetchInvoices();
    fetchSalesInvoiceDetail();

    console.log(state.unpaidInvoices);
});
</script>