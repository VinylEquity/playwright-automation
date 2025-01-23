import { expect, type Locator, type Page } from '@playwright/test';

export class dashboardPage{
    readonly page: Page;
    readonly close_alert: Locator;
    readonly user_name: Locator;
    readonly logout_btn: Locator;
    readonly issuers: Locator;
    readonly treasury_order: Locator;

    constructor(page: Page){
        this.page = page;
        this.close_alert = page.getByLabel('close');
        this.user_name = page.getByLabel('user-account');
        this.logout_btn = page.getByRole('button', { name: 'Logout' });
        this.issuers = page.getByRole('button', { name: 'Issuers' });
        this.treasury_order = page.getByRole('link', { name: 'theme-icon Treasury Orders' })
    }
    async validate_username(name){
        await this.close_alert.click();
        // await expect(this.user_name).toHaveText(name);
    }

    async logout(){
        await this.user_name.click();
        await this.logout_btn.click();
    }

    async go_to_treasury_order_page(){
        await this.issuers.click();
        await this.treasury_order.click();
    }
}