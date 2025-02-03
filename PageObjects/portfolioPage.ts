import { expect, type Locator, type Page } from '@playwright/test';

export class portfolioPage{
    readonly page: Page;
    readonly close_alert: Locator;
    readonly user_name: Locator;
    readonly logout_btn: Locator;
    readonly holding_table: Locator;

    constructor(page: Page){
        this.page = page;
        this.close_alert = page.getByLabel('close');
        this.user_name = page.getByLabel('user-account');
        this.logout_btn = page.getByRole('button', { name: 'Logout' });
        this.holding_table = page.locator('table.MuiTable-root tbody').first(); 
    }
    async validate_username(name){
        await this.close_alert.click();
        await expect(this.user_name).toHaveText(name);
    }

    async logout(){
        await this.user_name.click();
        await this.logout_btn.click();
    }

    async get_issuer_quantity(issue, issuer){
        await this.holding_table.waitFor();
        await expect(this.holding_table).toBeVisible();
        const row_count = await this.holding_table.locator('tr').count();
        var issuer_UI, issue_UI: string;
        for(var row=0; row<row_count; row++){
            issuer_UI = await this.holding_table.locator('tr').nth(row).locator('td').nth(0).innerText();
            issue_UI = await this.holding_table.locator('tr').nth(row).locator('td').nth(1).innerText();
            if(issuer  ==  issuer_UI  && issue ==  issue_UI){
                return parseInt((await this.holding_table.locator('tr').nth(row).locator('td').nth(2).innerText()).replace(',',''));
            }
        }
    }
}