import { expect, type Locator, type Page } from '@playwright/test';

export class dashboardPage{
    readonly page: Page;
    readonly close_alert: Locator;
    readonly user_name: Locator;
    readonly logout_btn: Locator;
    readonly issuers: Locator;
    readonly treasury_order: Locator;
    readonly holders: Locator;
    readonly transfers: Locator;
    readonly holder_management: Locator;
    readonly ia_holder: Locator;

    constructor(page: Page){
        this.page = page;
        this.close_alert = page.getByLabel('close');
        this.user_name = page.getByLabel('user-account');
        this.logout_btn = page.getByRole('button', { name: 'Logout' });
        this.issuers = page.getByRole('button', { name: 'Issuers' });
        this.treasury_order = page.getByRole('link', { name: 'theme-icon Treasury Orders' });
        this.holders = page.getByRole('button', { name: 'Holders' });
        this.transfers = page.getByRole('link', { name: 'theme-icon Transfers' });
        this.holder_management = page.getByRole('link', { name: 'theme-icon Holder Management' });
        this.ia_holder = page.getByRole('link', { name: 'theme-icon Holders' });

    }
    async validate_username(name){
        await this.close_alert.click();
        await expect(this.user_name).toHaveText(name);
    }

    async logout(){
        await this.user_name.click();
        await this.logout_btn.click();
    }

    async go_to_treasury_order_page(){
        await this.issuers.click();
        await this.treasury_order.click();
    }

    async go_to_transfers_page(){
        await this.holders.click();
        await this.transfers.click();
    }
    
    async go_to_holder_management(){
        await this.holders.click();
        await this.holder_management.click();
    }
}