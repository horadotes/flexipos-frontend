<template>
    <div>
        <NuxtLayout name="admin">
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
                    <button @click="navigateToCreate" type="button"
                        class="rounded-md bg-gray-900 px-3 py-2 text-center text-xxs font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 flex items-center justify-center gap-2">
                        <PlusIcon class="h-3 w-3" aria-hidden="true" />
                        New Payment
                    </button>
                </div>

                <!-- Payments List Table -->
                <div class="mt-4 overflow-x-auto">
                    <!-- Product Table -->
                    <Alert type="danger" :text="state.error?.message" v-if="state.error" />
                    <div class="table-responsive">
                        <Table :columnHeaders="state.unpaidBillColumnHeader" :data="state.billPayment"
                            :isLoading="state.isTableLoading" :sortData="state.sortData" @sort="sort">
                            <template #body v-if="!state.isTableLoading && state.billPayment?.data.length">
                                <tr v-for="(billpayment, index) in state.billPayment?.data" :key="index">
                                    <td class="pl-3">
                                        {{ billpayment.prepared_by_id }}
                                    </td>
                                    <td class="pl-3">
                                        {{ billpayment.approved_by_id }}
                                    </td>
                                    <td class="pl-3">
                                        {{ billpayment.cancelled_by_id }}
                                    </td>
                                    <td class="pl-3">
                                        {{ billpayment.payment_date }}
                                    </td>
                                    <td class="pl-3">
                                        {{ billpayment.payment_type }}
                                    </td>
                                    <td class="pl-3">
                                        {{ billpayment.cash_voucher_no }}
                                    </td>
                                    <td class="pl-3">
                                        {{ billpayment.is_cancelled }}
                                    </td>
                                    <td class="pl-3">
                                        <div class="flex space-x-2">
                                            <button @click="viewBill(bill.id)"
                                                class="text-gray-600 hover:text-gray-900">
                                                View
                                            </button>
                                            <button @click="editBill(bill.id)"
                                                class="text-gray-600 hover:text-gray-900">
                                                Edit
                                            </button>
                                            <button @click="deleteBill(bill.id)"
                                                class="text-red-600 hover:text-red-900">
                                                Cancel
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </Table>
                    </div>
                    <!-- <Pagination :data="state.categories" @previous="previous" @next="next" /> -->
                </div>
            </main>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { billPaymentService } from '~/components/api/admin/BillPaymentService';
import { employeeService } from '~/components/api/admin/EmployeeService';

interface BillPayment {
    data: any[];
}

const currentTablePage = 1;

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
}

const state = reactive({
    unpaidBillColumnHeader: [
        { name: "Prepared By", sorter: true, key: "preparedby" },
        { name: "Approved By", sorter: true, key: "approvedby" },
        { name: "Cancelled By", sorter: true, key: "cancelledby" },
        { name: "Payment Date", sorter: true, key: "paymentdate" },
        { name: "Payment Type", sorter: true, key: "paymentype" },
        { name: "Cash Voucher No", sorter: true, key: "cvn" },
        { name: "Is Cancelled", sorter: true, key: "is_cancelled" },
        { name: "Actions", sorter: true, key: "actions" },
    ],
    isTableLoading: false,
    error: null as Error | null,
    billPayment: { data: [] } as BillPayment,
    sortData: { sortField: 'id', sortOrder: 'ascend' } as SortData,
    employees: [],
});

// Function to fetch employees
async function fetchEmployees() {
    try {
        const response = await employeeService.getEmployees();
        state.employees = response.data; // Assuming the response structure contains the employee data
    } catch (error) {
        console.error('Failed to fetch employees:', error);
        state.error = error;
    }
}

// Update fetchBillsPayment to replace IDs with employee names
async function fetchBillsPayment() {
    state.error = null;
    state.isTableLoading = true;
    fetchEmployees();
    try {
        const response = await billPaymentService.getBillPayments();
        state.billPayment = response; // Store the fetched bill payments

        // Map employee IDs to names
        state.billPayment.data.forEach(billpayment => {
            const preparedBy = state.employees.find(emp => emp.id === billpayment.prepared_by_id);
            const approvedBy = state.employees.find(emp => emp.id === billpayment.approved_by_id);
            const cancelledBy = state.employees.find(emp => emp.id === billpayment.cancelled_by_id);

            billpayment.prepared_by_id = preparedBy ? `${preparedBy.firstname} ${preparedBy.lastname}` : '';
            billpayment.approved_by_id = approvedBy ? `${approvedBy.firstname} ${approvedBy.lastname}` : '';
            billpayment.cancelled_by_id = cancelledBy ? `${cancelledBy.firstname} ${cancelledBy.lastname}` : '';
        });
    } catch (error: any) {
        state.error = error;
    }
    state.isTableLoading = false;
}


function toggleForm() {
    showForm.value = !showForm.value;
    if (!showForm.value) {
        editingIndex.value = null;
        resetPaymentForm();
    }
}

function resetPaymentForm() {
    payment.value = {
        payment_type: '',
        payment_date: '',
        supplier: '',
        cash_voucher_no: '',
        is_cancelled: 'No',
        prepared_by_id: ''
    };
}

function editPayment(index: number) {
    payment.value = { ...payments.value[index] };
    editingIndex.value = index;
    showForm.value = true; // Open the form for editing.
}

function deletePayment(index: number) {
    payments.value.splice(index, 1);
}

// function previousPage() {
//     if (currentPage.value > 1) {
//         currentPage.value--;
//     }
// }

// function nextPage() {
//     if (currentPage.value < totalPages.value) {
//         currentPage.value++;
//     }
// }

function navigateToCreate() {
    navigateTo("payments/create")
}

onMounted(() => {
    fetchBillsPayment();
});
</script>