<template>
    <div>
        <NuxtLayout name="admin">
            <main>

                <Head>
                    <Title>Products - {{ runtimeConfig.public.appName }}</Title>
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
                    <!-- Add Product Button -->
                    <div class="mt-4 sm:ml-16 sm:mt-3 sm:flex-none mr-6">
                        <button type="button" @click="toggleForm"
                            class="block rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Add Product
                        </button>
                    </div>
                </div>
                <div class="sm:flex sm:items-center sm:justify-between mt-4 ml-8">
                    <div class="sm:flex-auto">
                        <h1 class="text-base font-semibold leading-6 text-gray-900">Products</h1>
                        <p class="mt-2 text-sm text-gray-700">A list of all the products and their details.</p>
                    </div>
                </div>
                <!-- Product Form -->
                <div v-if="showForm" class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <form @submit.prevent="saveProduct">
                            <FormLabel label="Product Details" class="text-xl" />
                            <Alert type="danger" :text="state?.error?.message"
                                v-if="state.error?.message && state.error.message.length > 0" />
                            <div class="grid grid-cols-1 gap-1 mt-3 mx-2">
                                <FormLabel for="product_category_id" label="Category" class="mr-3" />
                                <div class="flex items-center mb-1">
                                    <FormSelect id="product_category_id" v-model="product.product_category_id"
                                        :options="state.categories.filter(category => category.is_active).map(category => ({ value: category.id, label: category.name }))"
                                        placeholder="Select a category" required />
                                    <FormError :error="state?.error?.errors?.product_category_id?.[0]" />
                                </div>

                                <FormLabel for="barcode" label="Barcode" class="mr-3" />
                                <div class="flex items-center mb-1">
                                    <FormNumberField id="barcode" name="barcode" v-model="product.barcode"
                                        placeholder="Barcode" />
                                    <FormError :error="state?.error?.errors?.barcode?.[0]" />
                                </div>

                                <FormLabel for="productname" label="Product Name" class="mr-3" />
                                <div class="flex items-center mb-1">
                                    <FormTextField id="productname" name="productname" v-model="product.name"
                                        placeholder="Product Name" required />
                                    <FormError :error="state?.error?.errors?.name?.[0]" />
                                </div>

                                <FormLabel for="brandname" label="Brand Name" class="mr-3" />
                                <div class="flex items-center mb-1">
                                    <FormTextField id="brandname" name="brandname" v-model="product.brand"
                                        placeholder="Brand Name" />
                                    <FormError :error="state?.error?.errors?.brand?.[0]" />
                                </div>

                                <FormLabel for="wholesaleunit" label="Wholesale Unit" class="mr-3" />
                                <div class="flex items-center mb-1">
                                    <FormSelect id="wholesaleunit" name="wholesaleunit" v-model="product.wholesale_unit"
                                        :options="wholesaleUnitOptions" placeholder="Wholesale Unit" />
                                    <FormError :error="state?.error?.errors?.wholesale_unit?.[0]" />
                                </div>

                                <FormLabel for="retailunit" label="Retail Unit" class="mr-3" />
                                <div class="flex items-center mb-1">
                                    <FormNumberField id="retailunit" name="retailunit" v-model="product.retail_unit"
                                        placeholder="Retail Unit" />
                                    <FormError :error="state?.error?.errors?.retail_unit?.[0]" />
                                </div>

                                <FormLabel for="wholesale_quantity" label="Retail Qty" class="mr-3" />
                                <div class="flex items-center mb-1">
                                    <FormNumberField id="wholesale_quantity" name="wholesale_quantity"
                                        v-model="product.wholesale_quantity" min="0" placeholder="Retail Qty" />
                                    <FormError :error="state?.error?.errors?.wholesale_quantity?.[0]" />
                                </div>

                                <FormLabel for="reorder_point" label="Reorder Point" class="mr-3" />
                                <div class="flex items-center mb-1">
                                    <FormNumberField id="reorder_point" name="reorder_point"
                                        v-model="product.reorder_point" min="0" placeholder="Reorder Point" />
                                    <FormError :error="state?.error?.errors?.reorder_point?.[0]" />
                                </div>

                                <FormLabel for="markup" label="Markup" class="mr-3" />
                                <div class="flex items-center mb-1">
                                    <FormNumberField id="markup" name="markup" v-model="product.markup" min="0"
                                        max="100" placeholder="Markup" />
                                    <span>%</span>
                                    <FormError :error="state?.error?.errors?.markup?.[0]" />
                                </div>

                                <FormLabel for="quantity_onhand" label="Quantity On Hand" class="mr-3" />
                                <div class="flex items-center mb-1">
                                    <FormNumberField id="quantity_onhand" name="quantity_onhand"
                                        v-model="product.quantity_onhand" placeholder="0" value="0" readonly
                                        class="cursor-default bg-gray-200" />
                                </div>

                                <div class="mb-1">
                                    <FormLabel for="is_active" label="isActive" class="mr-3" />
                                    <FormSelectField v-model="selectedIsActive" :options="activeInactiveOptions" />
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
                <div v-if="productToView"
                    class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <div class="grid grid-cols-1 gap-1 mt-3 mx-2">
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Category:</label>
                                <span>{{ state.products.data.find(p => p.id ===
                                    productToView)?.categoryname
                                    }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Product Name:</label>
                                <span>{{ state.products.data.find(p => p.id ===
                                    productToView)?.name
                                    }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Brand Name:</label>
                                <span>{{ state.products.data.find(p => p.id ===
                                    productToView)?.brand
                                    }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Qty on Hand:</label>
                                <span>{{ state.products.data.find(p => p.id === productToView)?.quantity_onhand
                                    }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Unit:</label>
                                <span>{{ state.products.data.find(p => p.id === productToView)?.wholesale_unit
                                    }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Retail Unit:</label>
                                <span>{{ state.products.data.find(p => p.id === productToView)?.retail_unit
                                    }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Retail Qty:</label>
                                <span>{{ state.products.data.find(p => p.id ===
                                    productToView)?.wholesale_quantity }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Reorder Point:</label>
                                <span>{{ state.products.data.find(p => p.id === productToView)?.reorder_point
                                    }}</span>
                            </div>
                            <div class="flex items-center mb-1 ml-7">
                                <label class="text-xxs font-medium text-gray-700 w-20 mr-2">Markup:</label>
                                <span>{{ state.products.data.find(p => p.id === productToView)?.markup }}</span>
                            </div>
                            <div class="flex justify-end gap-2 mt-4">
                                <button @click="productToView = null"
                                    class="rounded-md bg-gray-200 px-4 py-2 text-xxs font-semibold text-gray-700 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!--Product Table-->
                <div>
                    <Alert type="danger" :text="state.error?.message" v-if="state.error" />
                    <div class="table-responsive">
                        <Table :columnHeaders="state.columnHeaders" :data="state.products"
                            :isLoading="state.isTableLoading" :sortData="state.sortData" @sort="sort">
                            <template #body v-if="!(
                                state.isTableLoading ||
                                (state.products?.data &&
                                    state.products?.data.length === 0)
                            )">
                                <tr v-for="(product, index) in state.products?.data" :key="index">
                                    <td>
                                        <span class="pl-3 pr-3">{{ product.barcode }}</span>
                                    </td>
                                    <td>
                                        <span>{{ product.name }}</span>
                                    </td>
                                    <td>
                                        <span>{{ product.categoryname }}</span>
                                    </td>
                                    <td>
                                        <span>{{ product.brand }}</span>
                                    </td>
                                    <td>
                                        <span>{{ product.quantity_onhand }}</span>
                                    </td>
                                    <td>
                                        <span>{{ product.wholesale_unit }}</span>
                                    </td>
                                    <td>
                                        <span>{{ product.retail_unit }}</span>
                                    </td>
                                    <td>
                                        <span>{{ product.wholesale_quantity }}</span>
                                    </td>
                                    <td>
                                        <span>{{ product.current_price }}</span>
                                    </td>
                                    <td>
                                        <span>{{ product.reorder_point }}</span>
                                    </td>
                                    <td>
                                        <span>{{ product.markup + "%" }}</span>
                                    </td>

                                    <td>
                                        <span
                                            :class="product.is_active
                                                ? 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'
                                                : 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20'">
                                            {{ product.is_active ? 'Active' : 'Inactive' }}
                                        </span>
                                    </td>

                                    <td class="pl-1 py-2 text-xxs text-gray-700">
                                        <div class="flex space-x-2">
                                            <button @click="viewProduct(product.id)"
                                                class="text-gray-600 hover:text-gray-900">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                    <path fill-rule="evenodd"
                                                        d="M12 4.5C8.798 4.5 6 7.057 6 10.5S8.798 16.5 12 16.5 18 13.943 18 10.5 15.202 4.5 12 4.5ZM12 15.5C10.343 15.5 9 14.156 9 12.5S10.343 9.5 12 9.5 15 10.844 15 12.5 13.657 15.5 12 15.5ZM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM12 20C7.03 20 3 15.97 3 12S7.03 4 12 4s9 4.03 9 9-4.03 9-9 9Z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>

                                            <button @click="editProduct(product.id)"
                                                class="text-gray-600 hover:text-gray-900">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 20 20" fill="currentColor">
                                                    <path
                                                        d="M17.414 2.586a2 2 0 00-2.828 0l-10 10V16a1 1 0 001 1h3.414l10-10a2 2 0 000-2.828l-1.586-1.586zM5 13l-1.5 1.5V13h1.5zm4.5-4.5L14 4l2 2-4.5 4.5H9.5V8.5z" />
                                                </svg>
                                            </button>
                                            <button @click="deleteProduct(product.id)"
                                                class="text-red-600 hover:text-red-900">
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
                    <Pagination :data="state.products" @previous="previous" @next="next" />
                </div>
            </main>
        </NuxtLayout>
    </div>
</template>


<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { productService } from '~/components/api/admin/ProductService.js';
import { productCategoryService } from '@/components/api/admin/ProductCategoryService.js';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';

const runtimeConfig = useRuntimeConfig();
let currentTablePage = 1;

import type { Error } from '@/types/error';

const activeInactiveOptions = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
];

const selectedIsActive = computed({
    get: () => product.value.is_active,
    set: (newValue: boolean) => {
        product.value.is_active = newValue;
    }
});

interface SortData {
    sortField: string;
    sortOrder: "ascend" | "descend" | null;
}

interface Products {
    data: any[];
}

interface ProductCategory {
    id: number;
    name: string;
    is_active: boolean;
}

const wholesaleUnitOptions = [
    { value: 'PC', label: 'PC' },
    { value: 'BOX', label: 'BOX' },
    { value: 'BOTTLE', label: 'BOTTLE' }
];

const state = reactive({
    columnHeaders: [
        { name: "Barcode", sorter: true, key: "barcode" },
        { name: "Product Name", sorter: true, key: "productname" },
        { name: "Category", sorter: true, key: "productcategory" },
        { name: "Brand", sorter: true, key: "brandname" },
        { name: "Quantity on Hand", sorter: true, key: "quantity_onhand" },
        { name: "Wholesale", sorter: true, key: "wholesaleunit" },
        { name: "Retail", sorter: true, key: "retailunit" },
        { name: "Retail Quantity", sorter: true, key: "retailqtyperwholesaleunit" },
        { name: "Current Price", sorter: true, key: "current_price" },
        { name: "Reorder Point", sorter: true, key: "reorderpoint" },
        { name: "Markup", sorter: true, key: "markup" },
        { name: "Is Active", sorter: true, key: "is_active" },
        { name: "Actions", key: "actions" },
    ],
    error: null as Error | null,
    isTableLoading: false,
    sortData: { sortField: "", sortOrder: null } as SortData,
    products: { data: [] } as Products,
    categories: [] as ProductCategory[],
});

onMounted(() => {
    fetchProducts();
    fetchProductCategory();
});

async function fetchProductCategory() {
    state.isTableLoading = true;
    state.error = null;
    try {
        const response = await productCategoryService.getProductCategories();
        state.categories = response.data; // Adjust if necessary based on API response structure
        console.log('Fetched categories:', response.data); // Log fetched categories
        state.products.data.forEach(product => {
            const selectedCategory = state.categories.find(category => category.id === product.product_category_id);
            product.categoryname = selectedCategory ? selectedCategory.name : 'Unknown'; // Fallback if category not found
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
        const params = {
            page: currentTablePage,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
        };
        const response = await productService.getProducts();
        fetchProductCategory();
        state.products = response;
        console.log(response);
    } catch (error: any) {
        state.error = error;
    }
    state.isTableLoading = false;
}

function previous() {
    if (currentTablePage > 1) {
        currentTablePage--;
        fetchProducts();
    }
}

function next() {
    currentTablePage++;
    fetchProducts();
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
    fetchProducts();
}

const rules = computed(() => ({
    product: {
        product_category_id: {
            required: helpers.withMessage('This field is required.', required),
        },
        categoryname: {
            required: helpers.withMessage('This field is required.', required),
        },
        barcode: {
            required: helpers.withMessage('This field is required.', required),
        },
        name: {
            required: helpers.withMessage('This field is required.', required),
        },
        brand: {
            required: helpers.withMessage('This field is required.', required),
        },
        quantity_onhand: {
            required: helpers.withMessage('This field is required.', required),
        },
        wholesale_unit: {
            required: helpers.withMessage('This field is required.', required),
        },
        retail_unit: {
            required: helpers.withMessage('This field is required.', required),
        },
        wholesale_quantity: {
            required: helpers.withMessage('This field is required.', required),
        },
        reorder_point: {
            required: helpers.withMessage('This field is required.', required),
        },
        markup: {
            required: helpers.withMessage('This field is required.', required),
        },
        is_active: {
            required: helpers.withMessage('This field is required.', required),
        },
    },
}));

const product = ref({
    product_category_id: null,
    categoryname: '',
    barcode: '',
    name: '',
    brand: '',
    wholesale_unit: '',
    retail_unit: '',
    wholesale_quantity: '',
    reorder_point: '',
    markup: '',
    is_active: true,
    quantity_onhand: '0',
});

const v$ = useVuelidate(rules, { product });

const productToEdit = ref<number | null>(null);

// Watch for changes to the selected product category ID
watch(() => product.value.product_category_id, (id) => {
    const selectedCategory = state.categories.find(category => category.id === id);
    product.value.categoryname = selectedCategory ? selectedCategory.name : '';
});

async function saveProduct() {
    try {
        console.log('Product before save:', product.value);
        const products = {
            product_category_id: product.value.product_category_id,
            barcode: product.value.barcode,
            name: product.value.name,
            brand: product.value.brand,
            quantity_onhand: 0,
            wholesale_unit: product.value.wholesale_unit,
            retail_unit: product.value.retail_unit,
            wholesale_quantity: product.value.wholesale_quantity,
            current_price: 0,
            reorder_point: product.value.reorder_point,
            markup: product.value.markup,
            is_active: product.value.is_active,
        };

        let response;

        if (productToEdit.value) {
            // Update existing product.
            response = await productService.updateProduct(productToEdit.value, products);
            alert(response ? 'Product has been updated!' : 'Product update failed!');
        } else {
            // Create new product.
            response = await productService.createProduct(products);
            alert(response ? 'Product has been added!' : 'Product creation failed!');
        }

        fetchProducts(); // Refresh the product list.
        fetchProductCategory();
        toggleForm(); // Hide the form after save.
    } catch (error: any) {
        console.error('Error saving product:', error.message);
        alert('An error occurred while saving the product.');
    }
}
const productToView = ref<number | null>(null);

function viewProduct(id: number) {
    const selectedProduct = state.products.data.find(p => p.id === id);
    console.log(selectedProduct);
    if (selectedProduct) {
        productToView.value = id;
    } else {
        console.error(`Product with ID ${id} not found.`);
    }
}


// Delete product function.
async function deleteProduct(id: number) {
    try {
        const response = await productService.deleteProduct(id);
        alert(response ? 'Product has been deleted!' : 'Product deletion failed!');
        fetchProducts();
        fetchProductCategory();
    } catch (error: any) {
        console.error(error.message);
    }
}

// Update product function.
function editProduct(id: number) {
    const selectedProduct = state.products.data.find(p => p.id === id);

    if (selectedProduct) {
        product.value = { ...selectedProduct };
        productToEdit.value = id;
        showForm.value = true;
    } else {
        console.error(`Product with ID ${id} not found.`);
    }
}

const showForm = ref(false);

function toggleForm() {
    showForm.value = !showForm.value;
    if (!showForm.value) {
        product.value = {
            product_category_id: null,
            categoryname: '',
            barcode: '',
            name: '',
            brand: '',
            wholesale_unit: '',
            retail_unit: '',
            wholesale_quantity: '',
            reorder_point: '',
            markup: '',
            is_active: true,
            quantity_onhand: '0',
        };
        productToEdit.value = null;
    }
}
</script>