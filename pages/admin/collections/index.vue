<template>
    <div>
        <NuxtLayout name="admin">
            <main class="w-full mx-auto">

                <Head>
                    <Title>Bills Payment - {{ runtimeConfig.public.appName }}</Title>
                </Head>
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
                        <Table :columnHeaders="state.unpaidBillColumnHeader" :data="state.payments"
                            :isLoading="state.isTableLoading" :sortData="state.sortData" @sort="sort">
                            <template #body v-if="!state.isTableLoading && state.payments?.data.length">
                                <tr v-for="(payment, index) in state.payments?.data" :key="index">
                                    <td class="pl-3">
                                        {{ payment.prepared_by_id }}
                                    </td>
                                    <td class="pl-3">
                                        {{ payment.customer_id }}
                                    </td>
                                    <td class="pl-3">
                                        {{ payment.approvedby }}
                                    </td>
                                    <td class="pl-3">
                                        {{ payment.cancelled_by_id }}
                                    </td>
                                    <td class="pl-3">
                                        {{ payment.or_number }}
                                    </td>
                                    <td class="pl-3">
                                        {{ payment.is_approved }}
                                    </td>
                                    <td class="pl-3">
                                        {{ payment.is_cancelled }}
                                    </td>
                                    <td class="pl-3">
                                        {{ payment.payment_date }}
                                    </td>
                                    <td class="pl-3">
                                        {{ payment.remarks }}
                                    </td>
                                    <td class="pl-3">
                                        <div class="flex space-x-2">
                                            <button @click="" class="text-gray-600 hover:text-gray-900">
                                                View
                                            </button>
                                            <button @click="" class="text-gray-600 hover:text-gray-900">
                                                Edit
                                            </button>
                                            <button @click="" class="text-red-600 hover:text-red-900">
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
import { employeeService } from '~/components/api/admin/EmployeeService';
import { paymentService } from '~/components/api/admin/PaymentService';

const runtimeConfig = useRuntimeConfig();

interface Payment {
    data: any[];
}

const currentTablePage = 1;

interface SortData {
    sortField: string;
    sortOrder: "ascend" | "descend" | null;
}

function sort(sortingData: { column: string; sort: string }) {
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
        { name: "Customer Name", sorter: true, key: "customer_id" },
        { name: "Approved By", sorter: true, key: "approvedby" },
        { name: "Cancelled By", sorter: true, key: "cancelled_by_id" },
        { name: "O.R Number", sorter: true, key: "or_number" },
        { name: "is Approved", sorter: true, key: "is_approved" },
        { name: "is Cancelled", sorter: true, key: "is_cancelled" },
        { name: "Payment Date", sorter: true, key: "payment_date" },
        { name: "Remarks", sorter: true, key: "remarks" },
        { name: "Actions", sorter: true, key: "actions" },
    ],
    isTableLoading: false,
    error: null as Error | null,
    payments: { data: [] } as Payment,
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
    }
}

// Update fetchBillsPayment to replace IDs with employee names
async function fetchPayments() {
    state.error = null;
    state.isTableLoading = true;
    await fetchEmployees();
    try {
        const response = await paymentService.getPayments();
        state.payments = response;

        state.payments.data.forEach(payment => {
            const preparedBy = state.employees.find(emp => (emp as any).id === payment.prepared_by_id);
            const approvedBy = state.employees.find(emp => (emp as any).id === payment.approved_by_id);
            const cancelledBy = state.employees.find(emp => (emp as any).id === payment.cancelled_by_id);

            payment.prepared_by_id = preparedBy ? `${(preparedBy as any).firstname} ${(preparedBy as any).lastname}` : '';
            payment.approved_by_id = approvedBy ? `${(approvedBy as any).firstname} ${(approvedBy as any).lastname}` : '';
            payment.cancelled_by_id = cancelledBy ? `${(cancelledBy as any).firstname} ${(cancelledBy as any).lastname}` : '';
        });
    } catch (error: any) {
        state.error = error;
    }
    state.isTableLoading = false;
}

function navigateToCreate() {
    navigateTo("collections/create")
}

onMounted(() => {
    fetchPayments();
});
</script>