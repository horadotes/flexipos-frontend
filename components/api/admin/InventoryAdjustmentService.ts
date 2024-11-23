import BaseAPIService from "../BaseAPIService";

class InventoryAdjustmentService extends BaseAPIService {
    async getInventoryAdjustments(): Promise<any> {
        return await this.request(`/admin/inventory_adjustments`, "GET");
    }

    async getInventoryAdjustmentById(productId: number): Promise<any> {
        return await this.request(`/admin/inventory_adjustments/${productId}`, "GET");
    }

    async createInventoryAdjustment(params: object): Promise<any> {
        return await this.request(`/admin/inventory_adjustments`, "POST", params);
    }

    async updateInventoryAdjustment(productId: number, params: object): Promise<any> {
        return await this.request(`/admin/inventory_adjustments/${productId}`, "PUT", params);
    }

    async deleteInventoryAdjustment(productId: number): Promise<any> {
        return await this.request(`/admin/inventory_adjustments/${productId}`, "DELETE");
    }
}

export const inventoryAdjustmentService = new InventoryAdjustmentService();