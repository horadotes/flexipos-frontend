import BaseAPIService from "../BaseAPIService";

class InventoryAdjustmentDetailService extends BaseAPIService {
    async getInventoryAdjustmentDetails(): Promise<any> {
        return await this.request(`/admin/inventory_adjustment_details`, "GET");
    }

    async getInventoryAdjustmentDetailById(productId: number): Promise<any> {
        return await this.request(`/admin/inventory_adjustment_details/${productId}`, "GET");
    }

    async createInventoryAdjustmentDetail(params: object): Promise<any> {
        return await this.request(`/admin/inventory_adjustment_details`, "POST", params);
    }

    async updateInventoryAdjustmentDetail(productId: number, params: object): Promise<any> {
        return await this.request(`/admin/inventory_adjustment_details/${productId}`, "PUT", params);
    }

    async deleteInventoryAdjustmentDetail(productId: number): Promise<any> {
        return await this.request(`/admin/inventory_adjustment_details/${productId}`, "DELETE");
    }
}

export const inventoryAdjustmentDetailService = new InventoryAdjustmentDetailService();