import BaseAPIService from "../BaseAPIService";

class CustomerReturnService extends BaseAPIService {
    // Fetch all products
    async getCustomerReturns(): Promise<any> {
        return await this.request(`/admin/customer_returns`, "GET");
    }

    // Fetch a single product by ID
    async getCustomerReturnById(id: number): Promise<any> {
        return await this.request(`/admin/customer_returns/${id}`, "GET");
    }

    // Create a new product
    async createCustomerReturn(params: object): Promise<any> {
        return await this.request(`/admin/customer_returns`, "POST", params);
    }

    // Update an existing product
    async updateCustomerReturn(id: number, params: object): Promise<any> {
        return await this.request(`/admin/customer_returns/${id}`, "PUT", params);
    }

    // Delete a product by ID
    async deleteCustomerReturn(id: number): Promise<any> {
        return await this.request(`/admin/customer_returns/${id}`, "DELETE");
    }
}

export const customerReturnService = new CustomerReturnService();