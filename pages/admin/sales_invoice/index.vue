<template>
    <div>
        <NuxtLayout name="admin">

            <Head>
                <Title>Sales Invoice - {{ runtimeConfig.public.appName }}</Title>
            </Head>
            <main>
                <!-- Search and Add Product Button Container -->
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

                    <!-- Add Product Button -->
                    <button @click="goToSalesInvoice" type="button"
                        class="rounded-md bg-gray-900 px-3 py-2 text-center text-xxs font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 flex items-center justify-center gap-2">
                        <PlusIcon class="h-3 w-3" aria-hidden="true" />
                        Create Sales Invoice
                    </button>
                </div>
                <!--Product Table-->
                <div>
                    <Alert type="danger" :text="state.error?.message" v-if="state.error" />
                    <div class="table-responsive">
                        <Table :columnHeaders="state.columnHeaders" :data="state.salesInvoices"
                            :isLoading="state.isTableLoading" :sortData="state.sortData" @sort="sort">
                            <template #body v-if="!(
                                state.isTableLoading ||
                                (state.salesInvoices?.data &&
                                    state.salesInvoices?.data.length === 0)
                            )">
                                <tr v-for="(invoices, index) in state.salesInvoices?.data" :key="index">
                                    <td>
                                        <span class="pl-3 pr-3">{{ invoices.invoice_no }}</span>
                                    </td>
                                    <td>
                                        <span>{{ invoices.document_no }}</span>
                                    </td>
                                    <td>
                                        <span>{{ invoices.prepared_by_id }}</span>
                                    </td>
                                    <td>
                                        <span>{{ invoices.customer_id }}</span>
                                    </td>
                                    <td>
                                        <span>{{ invoices.sales_representative }}</span>
                                    </td>
                                    <td>
                                        <span>{{ invoices.date }}</span>
                                    </td>
                                    <td>
                                        <span>{{ invoices.due_date }}</span>
                                    </td>
                                    <td>
                                        <span>{{ invoices.terms }}</span>
                                    </td>
                                    <td>
                                        <span>{{ invoices.amount }}</span>
                                    </td>
                                    <td>
                                        <span>{{ invoices.cancelled_by_id }}</span>
                                    </td>
                                    <td>
                                        <span>{{ invoices.approved_by_id }}</span>
                                    </td>
                                    <td>
                                        <span>{{ invoices.is_cancelled }}</span>
                                    </td>
                                    <td>
                                        <span>{{ invoices.is_approved }}</span>
                                    </td>
                                    <td>
                                        <span>{{ invoices.remarks }}</span>
                                    </td>
                                    <td class="pl-1 py-2 text-xxs text-gray-700">
                                        <div class="flex space-x-2">
                                            <button @click="" class="text-gray-600 hover:text-gray-900">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                    <path fill-rule="evenodd"
                                                        d="M12 4.5C8.798 4.5 6 7.057 6 10.5S8.798 16.5 12 16.5 18 13.943 18 10.5 15.202 4.5 12 4.5ZM12 15.5C10.343 15.5 9 14.156 9 12.5S10.343 9.5 12 9.5 15 10.844 15 12.5 13.657 15.5 12 15.5ZM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM12 20C7.03 20 3 15.97 3 12S7.03 4 12 4s9 4.03 9 9-4.03 9-9 9Z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>

                                            <button @click="" class="text-gray-600 hover:text-gray-900">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 20 20" fill="currentColor">
                                                    <path
                                                        d="M17.414 2.586a2 2 0 00-2.828 0l-10 10V16a1 1 0 001 1h3.414l10-10a2 2 0 000-2.828l-1.586-1.586zM5 13l-1.5 1.5V13h1.5zm4.5-4.5L14 4l2 2-4.5 4.5H9.5V8.5z" />
                                                </svg>
                                            </button>
                                            <button @click="" class="text-red-600 hover:text-red-900">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd"
                                                        d="M6 2a2 2 0 00-2 2v1H2v2h1v9a2 2 0 002 2h8a2 2 0 002-2V7h1V5h-2V4a2 2 0 00-2-2H6zm4 12a1 1 0 102 0V8a1 1 0 10-2 0v6zm-3-1a1 1 0 002 0V8a1 1 0 10-2 0v5zm8-1a1 1 0 10-2 0V8a1 1 0 102 0v5z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </Table>
                    </div>
                    <Pagination :data="state.salesInvoices" @previous="previous" @next="next" />
                </div>
            </main>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { salesInvoiceService } from '~/components/api/admin/SalesInvoiceService';

const runtimeConfig = useRuntimeConfig();
let currentTablePage = 1;

interface SortData {
    sortField: string;
    sortOrder: "ascend" | "descend" | null;
}

interface SalesInvoice {
    data: any[];
}

// const salesInvoice = ref({
//     id: '',
//     branch_id: '',
//     sales_order_id: '',
//     customer_id: '',
//     prepared_by_id: '',
//     sales_representative: '',
//     cancelled_by_id: '',
//     approved_by_id: '',
//     invoice_no: '',
//     document_no: '',
//     date: '',
//     due_date: '',
//     payment_type: 'Cash',
//     terms: '0',
//     is_cancelled: false,
//     is_approved: false,
//     remarks: '',
//     total: '',
// });

const state = reactive({
    columnHeaders: [
        { name: "Invoice No", sorter: true, key: "invoice_no" },
        { name: "Document No", sorter: true, key: "document_no" },
        { name: "Prepared By", sorter: true, key: "prepared_by_id" },
        { name: "Customer", sorter: true, key: "customer_id" },
        { name: "Sales Representative", sorter: true, key: "sales_representative" },
        { name: "Date", sorter: true, key: "date" },
        { name: "Due Date", sorter: true, key: "due_date" },
        { name: "Terms", sorter: true, key: "terms" },
        { name: "Amount", sorter: true, key: "amount" },
        { name: "Cancelled By", sorter: true, key: "cancelled_by_id" },
        { name: "Approved By", sorter: true, key: "approved_by_id" },
        { name: "Cancelled", sorter: true, key: "is_cancelled" },
        { name: "Approved", sorter: true, key: "is_approved" },
        { name: "Remarks", sorter: true, key: "remarks" },
        { name: "Actions", key: "actions" },
    ],
    error: null as Error | null,
    isTableLoading: false,
    sortData: { sortField: "", sortOrder: null } as SortData,
    salesInvoices: { data: [] } as SalesInvoice,
});


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
    fetchSalesInvoice();
}

async function fetchSalesInvoice() {
    state.isTableLoading = true;
    state.error = null;
    try {
        const params = {
            page: currentTablePage,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
        };
        const response = await salesInvoiceService.getSalesInvoices();
        state.salesInvoices = response;
        console.log(response);
    } catch (error: any) {
        state.error = error;
    }
    state.isTableLoading = false;
}

function goToSalesInvoice() {
    navigateTo('sales_invoice/create');
}

function editSale(index: number) {

}

function deleteSale(index: number) {

}

function previous() {
    currentTablePage--;
}

function next() {
    currentTablePage++;
}

onMounted(() => {
    fetchSalesInvoice();
});
</script>