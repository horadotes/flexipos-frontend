import BaseAPIService from "../BaseAPIService";

class CustomerReturnDetailService extends BaseAPIService {
    // Fetch all products
    async getCustomerReturnDetails(): Promise<any> {
        return await this.request(`/admin/customer_return_detail`, "GET");
    }

    // Fetch a single product by ID
    async getCustomerReturnDetailById(id: number): Promise<any> {
        return await this.request(`/admin/customer_return_detail/${id}`, "GET");
    }

    // Create a new product
    async createCustomerReturnDetail(params: object): Promise<any> {
        return await this.request(`/admin/customer_return_detail`, "POST", params);
    }

    // Update an existing product
    async updateCustomerReturnDetail(id: number, params: object): Promise<any> {
        return await this.request(`/admin/customer_return_detail/${id}`, "PUT", params);
    }

    // Delete a product by ID
    async deleteCustomerReturnDetail(id: number): Promise<any> {
        return await this.request(`/admin/customer_return_detail/${id}`, "DELETE");
    }
}

export const customerReturnDetailService = new CustomerReturnDetailService();