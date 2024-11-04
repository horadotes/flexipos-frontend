<template>
    <NuxtLayout name="admin">
        <main>

            <Head>
                <Title>Bills - {{ runtimeConfig.public.appName }}</Title>
            </Head>

            <!-- Add Bill Button -->
            <div class="mt-4 sm:ml-16 sm:mt-3 sm:flex-none mr-6">
                <button type="button" @click="toggleBillForm()"
                    class="block rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Add Bill
                </button>
            </div>
            <!-- Bill Form -->
            <div v-if="showBillForm" class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                    <form @submit.prevent="saveBill">
                        <!-- Form for Bills -->
                        <div>
                            <FormLabel label="Bill Details" class="text-xl" />
                            <Alert type="danger" :text="state?.error?.message"
                                v-if="state.error?.message && state.error.message.length > 0" />
                            <div class="grid grid-cols-1">
                                <div>
                                    <FormLabel for="supplier_id" label="Supplier ID" />
                                    <div class="flex items-center mb-1">
                                        <FormSelect id="supplier_id" v-model="bill.supplier_id"
                                            :options="state.suppliers.filter(suppliers => suppliers.is_active).map(suppliers => ({ value: suppliers.id, label: suppliers.name }))"
                                            placeholder="Select supplier" required />
                                        <FormError :error="state?.error?.errors?.supplier_id?.[0]" />
                                    </div>
                                    <FormLabel for="prepared_by_id" label="Prepared By" />
                                    <div class="flex items-center mb-1">
                                        <FormNumberField for="prepared_by_id" name="prepared_by_id"
                                            v-model="bill.prepared_by_id" :placeholder="`${firstname} ${lastname}`"
                                            :value="`${firstname} ${lastname}`" readonly
                                            class="cursor-default bg-gray-200" />
                                    </div>
                                    <FormLabel for="purchase_order_no" label="Purchase Order No" />
                                    <div class="flex items-center mb-1">
                                        <FormTextField for="purchase_order_no" name="purchase_order_no"
                                            v-model="bill.purchase_order_no" placeholder="Purchase Order No" required />
                                    </div>
                                    <FormLabel for="bill_date" label="Bill Date" />
                                    <div class="flex items-center mb-1">
                                        <flat-pickr v-model="bill.bill_date" :config="dateConfig"
                                            class="w-full py-2 pl-3 ring-1 ring-slate-200 rounded-md focus:outline-none focus:ring-primary-700 focus:border-primary-700 focus:z-10"
                                            placeholder="Bill Date" required />
                                    </div>
                                    <FormLabel for="payment_terms" label="Payment Terms" />
                                    <div class="flex items-center mb-1">
                                        <FormTextField for="payment_terms" name="payment_terms"
                                            v-model="bill.payment_terms" placeholder="Payment Terms" required />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Form for Bills Details -->
                        <div class="space-y-4">
                            <FormLabel for="product_id" label="Product ID" />
                            <div class="flex items-center mb-1">
                                <FormSelect id="product_id" v-model="billDetail.product_id"
                                    :options="state.products.filter(products => products.is_active).map(products => ({ value: products.id, label: products.name }))"
                                    placeholder="Select product" />
                                <FormError :error="state?.error?.errors?.product_id?.[0]" />
                            </div>
                            <div class="flex flex-wrap gap-4 mb-6">
                                <div class="flex-1 min-w-[120px] max-w-[200px]">
                                    <label for="barcode" class="text-xxs font-medium text-gray-700">Barcode</label>
                                    <input id="barcode" v-model="billDetail.barcode" type="text"
                                        class="block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xxs px-2 py-1" />
                                </div>
                                <div class="flex-1 min-w-[120px] max-w-[200px]">
                                    <label for="unit" class="text-xxs font-medium text-gray-700">Unit</label>
                                    <input id="unit" v-model="billDetail.unit" type="text"
                                        class="block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xxs px-2 py-1" />
                                </div>
                                <div class="flex-1 min-w-[120px] max-w-[200px]">
                                    <label for="expiry_date" class="text-xxs font-medium text-gray-700">Expiry
                                        Date</label>
                                    <input id="expiry_date" v-model="billDetail.expiry_date" type="text"
                                        class="block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xxs px-2 py-1" />
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-4 mt-4">
                                <div class="flex-1 min-w-[120px] max-w-[200px]">
                                    <label for="quantity" class="text-xxs font-medium text-gray-700">Quantity</label>
                                    <input id="quantity" v-model="billDetail.quantity" type="text"
                                        class=" block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xxs px-2 py-1" />
                                </div>
                                <div class="flex-1 min-w-[120px] max-w-[200px]">
                                    <label for="price" class="text-xxs font-medium text-gray-700">Price</label>
                                    <input id="price" v-model="billDetail.price" type="text"
                                        class="block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xxs px-2 py-1" />
                                </div>
                                <div class="flex justify-end  sm:mt-2 sm:flex-none">
                                    <button @click="addBillDetails" type="button"
                                        class="rounded-md bg-gray-900 px-2 py-1 text-center text-xxs font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 flex items-center justify-center gap-2">
                                        Add Bill Details
                                    </button>
                                </div>
                            </div>
                        </div>
                        <!-- Second Table (inside the form) -->
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200 mt-6">
                                <thead class="bg-gray-900 text-white">
                                    <tr>
                                        <th scope="col" class="px-4 py-2 text-left text-xxs font-light">Product Name
                                        </th>
                                        <th scope="col" class="px-4 py-2 text-left text-xxs font-light">Barcode</th>
                                        <th scope="col" class="px-4 py-2 text-left text-xxs font-light">Unit</th>
                                        <th scope="col" class="px-4 py-2 text-left text-xxs font-light">Expiry Date</th>
                                        <th scope="col" class="px-4 py-2 text-left text-xxs font-light">Quantity</th>
                                        <th scope="col" class="px-4 py-2 text-left text-xxs font-light">Price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-gray-100">
                                    <tr v-for="(billDetail, index) in billDetailsList" :key="index"
                                        class="border-t bg-gray-50">
                                        <td class="px-4 py-2 text-xxs text-gray-700">{{ billDetail.name }}</td>
                                        <td class="px-4 py-2 text-xxs text-gray-700">{{ billDetail.barcode }}</td>
                                        <td class="px-4 py-2 text-xxs text-gray-700">{{ billDetail.unit }}</td>
                                        <td class="px-4 py-2 text-xxs text-gray-700">{{ billDetail.expiry_date }}</td>
                                        <td class="px-4 py-2 text-xxs text-gray-700">{{ billDetail.quantity }}</td>
                                        <td class="px-4 py-2 text-xxs text-gray-700">{{ billDetail.price }}</td>
                                    </tr>
                                    <tr v-if="billDetailsList.length === 0">
                                        <td colspan="8"
                                            class="px-4 py-2 text-xxs text-gray-500 text-center bg-gray-100">No bill
                                            details
                                            available.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="flex justify-end gap-2 mt-4">
                            <button type="submit"
                                class="rounded-md bg-gray-900 px-4 py-2 text-xxs font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                                Save
                            </button>
                            <button @click="toggleBillForm" type="button"
                                class="rounded-md bg-gray-200 px-4 py-2 text-xxs font-semibold text-gray-700 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <!-- Bills Table -->
            <div>
                <Alert type="danger" :text="state.error?.message" v-if="state.error" />
                <div class="table-responsive">
                    <Table :columnHeaders="state.columnHeaders" :data="state.bills" :isLoading="state.isTableLoading"
                        :sortData="state.sortData" @sort="sort">
                        <template #body v-if="!state.isTableLoading && state.bills?.data.length">
                            <tr v-for="(bill, index) in state.bills?.data" :key="index">
                                <td class="pl-3">
                                    {{ bill.supplier_id }}
                                </td>
                                <td class="pl-3">
                                    {{ bill.prepared_by_id }}
                                </td>
                                <td class="pl-3">
                                    {{ bill.cancelled_by_id }}
                                </td>
                                <td class="pl-3">
                                    {{ bill.purchase_order_no }}
                                </td>
                                <td class="pl-3">
                                    {{ bill.bill_date }}
                                </td>
                                <td class="pl-3">
                                    ₱{{ Number(bill.amount).toFixed(2) }}
                                </td>
                                <td class="pl-3">
                                    {{ bill.payment_terms }}
                                </td>
                                <td class="pl-3">
                                    <span
                                        :class="{ 'text-red-600': bill.is_cancelled, 'text-green-600': !bill.is_cancelled }">
                                        {{ bill.is_cancelled ? 'Cancelled' : 'Not Cancelled' }}
                                        <!-- Displaying cancellation status -->
                                    </span>
                                </td>
                                <td class="pl-3">
                                    <div class="flex space-x-2">
                                        <button @click="viewBill(bill.id)" class="text-gray-600 hover:text-gray-900">
                                            View
                                        </button>
                                        <button @click="editBill(bill.id)" class="text-gray-600 hover:text-gray-900">
                                            Edit
                                        </button>
                                        <button @click="deleteBill(bill.id)" class="text-red-600 hover:text-red-900">
                                            Cancel
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </Table>
                </div>
                <!-- <Pagination :data="state.bills" @previous="previos" @next="next" /> -->
            </div>
        </main>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { helpers, required } from '@vuelidate/validators';
import { ref, reactive, onMounted, computed } from 'vue';
import { billService } from '~/components/api/admin/BillService.js';
import { useAlert } from '@/composables/alert';
import { useI18n } from 'vue-i18n';
import type { Error } from '@/types/error';
import { supplierService } from '~/components/api/admin/SupplierService.js';
import { productService } from '~/components/api/admin/ProductService.js';
import { billDetailService } from '~/components/api/admin/BillDetailService.js';
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/themes/dark.css';

const user_id = computed(() => localStorage.getItem('user_id'));
const firstname = computed(() => localStorage.getItem('firstname'));
const lastname = computed(() => localStorage.getItem('lastname'));
const dateConfig = ref<{ dateFormat: string }>({ dateFormat: "m/d/Y" });

const currentTablePage = ref(1);

// Alert and i18n setup
const { successAlert, errorAlert, warningAlert } = useAlert();
const { t } = useI18n();

const runtimeConfig = useRuntimeConfig();

interface SortData {
    sortField: string;
    sortOrder: "ascend" | "descend" | null;
}

interface Bill {
    data: any[];
}

interface BillDetail {
    product_id: string;
    name: string;
    barcode: string;
    unit: string;
    expiry_date: string;
    quantity: string;
    price: string;
}

interface Suppliers {
    id: number;
    name: string;
    is_active: boolean;
}

interface Products {
    id: number;
    barcode: string;
    wholesale_unit: string;
    name: string;
    is_active: boolean;
}

const state = reactive({
    columnHeaders: [
        { name: "Supplier", sorter: true, key: "supplier_id" },
        { name: "Prepared By", sorter: true, key: "prepared_by_id" },
        { name: "Cancelled By", sorter: true, key: "cancelled_by_id" },
        { name: "P.O. Number", sorter: true, key: "purchase_order_no" },
        { name: "Bill Date", sorter: true, key: "bill_date" },
        { name: "Amount", sorter: true, key: "amount" },
        { name: "Terms", sorter: true, key: "payment_terms" },
        { name: "Status", sorter: true, key: "is_cancelled" },
        { name: "Actions", key: "actions" },
    ],
    error: null as Error | null,
    isTableLoading: false,
    sortData: { sortField: "", sortOrder: null } as SortData,
    bills: { data: [] } as Bill,
    suppliers: [] as Suppliers[],
    products: [] as Products[],
});

const showBillForm = ref(false);

onMounted(() => {
    fetchBills();
});

const rules = computed(() => ({
    bill: {
        date: { required: helpers.withMessage('This field is required.', required) },
        supplier: { required: helpers.withMessage('This field is required.', required) },
    },
}));

const bill = ref({
    supplier_id: '',
    prepared_by_id: '',
    cancelled_by_id: '',
    purchase_order_no: '',
    bill_date: '',
    amount: 0,
    payment_terms: '',
    is_cancelled: false
});

const billDetail = ref<{
    product_id: number | string; // Allow for both number and string
    name: string;
    barcode: string;
    unit: string;
    expiry_date: string;
    amount: number;
    quantity: string;
    price: string;
}>({
    product_id: '',
    name: '',
    barcode: '',
    unit: '',
    expiry_date: '',
    amount: 0,
    quantity: '',
    price: ''
});

const billDetailsList = ref<BillDetail[]>([]);

watch(
    () => billDetail.value.product_id,
    (newProductId) => {
        // Find the selected product based on the selected product_id
        const selectedProduct = state.products.find(product => product.id === newProductId);

        // Update the name in billDetail if the selected product exists
        if (selectedProduct) {
            billDetail.value.name = selectedProduct.name;
            billDetail.value.barcode = selectedProduct.barcode;
            billDetail.value.unit = selectedProduct.wholesale_unit;

        } else {
            billDetail.value.name = ''; // Reset name if no product is selected
        }
    }
);


async function fetchSuppliers() {
    state.isTableLoading = true;
    state.error = null;
    try {
        const response = await supplierService.getSuppliers();
        state.suppliers = response.data; // Adjust if necessary based on API response structure
        console.log('Fetched categories:', response.data); // Log fetched categories
        state.bills.data.forEach(bills => {
            const selectedSupplier = state.suppliers.find(suppliers => suppliers.id === bills.supplier_id);
            bills.supplier_id = selectedSupplier ? selectedSupplier.name : 'Unknown'; // Fallback if category not found
        });
    } catch (error: any) {
        state.error = error;
    }
    state.isTableLoading = false;
}

async function fetchProducts() {
    state.isTableLoading = true;
    state.error = null;
    try {
        const response = await productService.getProducts();
        state.products = response.data; // Adjust if necessary based on API response structure
        console.log('Fetched products:', response.data); // Log fetched products
        state.bills.data.forEach(bills => {
            const selectedProduct = state.products.find(products => products.id === bills.product_id);
            bills.product_id = selectedProduct ? selectedProduct.name : 'Unknown'; // Fallback if product not found
        });
    } catch (error: any) {
        state.error = error;
    }
    state.isTableLoading = false;
}

async function fetchBills() {
    state.isTableLoading = true;
    state.error = null;
    try {
        const params = {
            page: currentTablePage.value,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
        };
        const response = await billService.getBills();
        fetchSuppliers();
        fetchProducts();
        console.log("Fetched bills:", response.data); // Log fetched bills
        state.bills = response;
    } catch (error: any) {
        state.error = error;
    }
    state.isTableLoading = false;
}

const toggleBillForm = () => {
    showBillForm.value = !showBillForm.value;
    billDetailsList.value = [];
    billDetail.value = {
        product_id: '',
        name: '',
        barcode: '',
        unit: '',
        expiry_date: '',
        amount: 0,
        quantity: '',
        price: ''
    };
};

async function saveBill() {
    try {
        if (billDetailsList.value.length > 0) {
            console.log('Bill before save:', bill.value);
            const billData = {
                supplier_id: bill.value.supplier_id,
                prepared_by_id: user_id.value,
                cancelled_by_id: bill.value.cancelled_by_id,
                bill_date: bill.value.bill_date,
                purchase_order_no: bill.value.purchase_order_no,
                amount: bill.value.amount, // You might want to calculate this based on bill details
                payment_terms: bill.value.payment_terms,
                is_cancelled: bill.value.is_cancelled || false,
            };

            // Calculate total amount from bill details
            const totalAmount = billDetailsList.value.reduce((total, detail) => {
                return total + (Number(detail.quantity) * Number(detail.price));
            }, 0);

            // Update the amount in billData with the calculated total amount
            billData.amount = totalAmount;

            // Create new bill.
            const response = await billService.createBills(billData);
            if (response && response.data.id) {
                console.log(response);

                // Save bill details
                for (const detail of billDetailsList.value) {
                    const billDetailData = {
                        bill_id: response.data.id, // Use the correct response ID
                        product_id: detail.product_id,
                        barcode: detail.barcode,
                        unit: detail.unit,
                        expiry_date: detail.expiry_date,
                        quantity: detail.quantity,
                        price: detail.price,
                    };

                    console.log('Saving bill detail:', billDetailData); // Log the detail being saved
                    const result = await billDetailService.createBillDetails(billDetailData);

                    if (result) {
                        console.log('Bill detail saved successfully:', result);
                        resetBillForm();
                    } else {
                        console.error('Failed to save bill detail:', billDetailData);
                    }
                }
                successAlert(t('alert.bill_created'), t('alert.success'));
            } else {
                errorAlert(t('Error'), t('Failed to create bill.'));
            }

            fetchBills(); // Refresh the bill list.
            toggleBillForm(); // Hide the form after save.
        } else {
            errorAlert(t('Error'), t('Please add at least one bill detail.'));
        }
    } catch (error: any) {
        console.error('Error saving bill:', error.message);
        errorAlert(t('Error'), t('An error occurred while saving the bill.'));
    }
}


const viewBill = async (id: number) => {

}

const editBill = async (id: number) => {

};

const deleteBill = async (id: number) => {
    try {
        await billService.deleteBills(id);
        successAlert(t('alert.bill_deleted'), t('alert.success'));
        fetchBills();
    } catch (error: any) {
        state.error = error.response?.data || error.message;
        errorAlert(t('alert.something_went_wrong'), t('alert.error'));
    }
};

const addBillDetails = () => {
    if (billDetail.value.price === '') {
        warningAlert(t('Error'), t('Please enter all fields.'));
        return;
    }

    // Add to billDetailsList
    billDetailsList.value.push({
        ...billDetail.value,
        product_id: String(billDetail.value.product_id), // Ensure this is a string
    });

    // Reset billDetail
    billDetail.value = {
        product_id: '',
        name: '',
        barcode: '',
        unit: '',
        expiry_date: '',
        amount: 0,
        quantity: '',
        price: ''
    };
};

function resetBillForm() {
    bill.value = {
        supplier_id: '',
        prepared_by_id: '',
        cancelled_by_id: '',
        purchase_order_no: '',
        bill_date: '',
        amount: 0,
        payment_terms: '',
        is_cancelled: false
    };
}

const sort = async (sortData: SortData) => {
    state.sortData = sortData;
    await fetchBills();
};

</script>