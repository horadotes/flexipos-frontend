import BaseAPIService from "../BaseAPIService";

class CreditMemoService extends BaseAPIService {
    async getCreditMemos(): Promise<any> {
        return await this.request(`/admin/credit_memo`, "GET");
    }

    async getCreditMemoById(productId: number): Promise<any> {
        return await this.request(`/admin/credit_memo/${productId}`, "GET");
    }

    async createCreditMemo(params: object): Promise<any> {
        return await this.request(`/admin/credit_memo`, "POST", params);
    }

    async updateCreditMemo(productId: number, params: object): Promise<any> {
        return await this.request(`/admin/credit_memo/${productId}`, "PUT", params);
    }

    async deleteCreditMemo(productId: number): Promise<any> {
        return await this.request(`/admin/credit_memo/${productId}`, "DELETE");
    }
}

export const creditMemoService = new CreditMemoService();