import { expect, type Request } from '@playwright/test';


export class apiMethods{
    readonly request: Request;

    constructor(request: Request){
        this.request = request;
    }

    async api_release_TO(id){
        const response = await this.request.post(`${process.env.LEDGER_SERVICE_API_BASE_URL}/treasury-orders/${id}/release`,{headers:{'X-API-KEY': `${process.env.API_TOKEN}`,}});
        expect(response.ok()).toBeTruthy();
    }

    async api_release_RTT(id){
        const response = await this.request.post(`${process.env.LEDGER_SERVICE_API_BASE_URL}/treasury-orders/cancelation/${id}/complete`,{headers:{'X-API-KEY': `${process.env.API_TOKEN}`,}});
        expect(response.ok()).toBeTruthy();
    }
}