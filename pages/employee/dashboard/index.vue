<template>
    <NuxtLayout name="default">
        <Title>Dashboard - {{ runtimeConfig.public.appName }}</Title>
        <h1>default dashboard</h1>
    </NuxtLayout>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

async function saveSupplierReturn() {
    try {
        if (supplierReturnDetailList.value.length > 0) {
            console.log('Bill before save:', supplierReturnDetail.value);

            const supplierReturnData = {
                bill_id: masterSupplierReturn.bill_id,
                prepared_by_id: user_id,
                approved_by_id: masterSupplierReturn.approved_by_id,
                cancelled_by_id: masterSupplierReturn.cancelled_by_id,
                branch_no: masterSupplierReturn.branch_no,
                return_date: masterSupplierReturn.return_date,
                remarks: masterSupplierReturn.remarks,
                is_cancelled: masterSupplierReturn.is_cancelled,
            };

            console.log('Supplier Return Data:', supplierReturnData);

            // Attempt to create the supplier return
            const response = await supplierReturnService.createSupplierReturns(supplierReturnData);
            console.log('Response from createSupplierReturn:', response);

            // // Check if the response is valid and has the expected structure
            // if (response && response.data) {
            //     console.log('Supplier Return created successfully:', response.data);

            //     // Save each bill detail
            //     for (const detail of supplierReturnDetailList.value) {
            //         const supplierReturnDetailData = {
            //             product_id: detail.product_id,
            //             supplier_return_id: response.data.id,
            //             unit: detail.unit,
            //             expiry_date: detail.expiry_date,
            //             quantity: detail.quantity,
            //             price: detail.price,
            //         };

            //         console.log('Saving bill detail:', supplierReturnDetailData);

            //         // Attempt to create the supplier return detail
            //         const result = await supplierReturnDetailService.createSupplierReturnDetail(supplierReturnDetailData);
            //         console.log('Response from createSupplierReturnDetail:', result);

            //         // Check if the detail save was successful
            //         if (result) {
            //             console.log('Bill detail saved successfully:', result);
            //         } else {
            //             console.error('Failed to save bill detail:', supplierReturnDetailData);
            //         }
            //     }

            //     // Show success alert
            //     successAlert(t('alert.bill_created'), t('alert.success'));
            // } else {
            //     console.error('Failed to create supplier return:', response);
            //     errorAlert(t('Error'), t('Failed to create bill.'));
            // }

            // Refresh the bill list
            fetchSupplierReturns();
        } else {
            errorAlert(t('Error'), t('Please add at least one bill detail.'));
        }
    } catch (error) {
        console.error('Error saving bill:', error);
        errorAlert(t('Error'), t('An error occurred while saving the bill.'));
    }
}
</script>