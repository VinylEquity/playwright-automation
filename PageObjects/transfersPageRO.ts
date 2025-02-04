import { expect, type Locator, type Page } from '@playwright/test';
import { timeHelper } from '../support/time.helper';

export class transfersPageRO{
    readonly page: Page;
    date: string;
    readonly new_transfer: Locator;
    readonly transfer_header: Locator;
    readonly account: Locator;
    readonly type: Locator;
    readonly drs_popup: Locator;
    readonly proceed_btn: Locator;
    readonly issue: Locator;
    readonly trasfer_date: Locator;
    readonly transfer_date_text: Locator;
    readonly holding_table: Locator;

    constructor(page: Page){
        this.page = page;
        this.new_transfer = page.getByRole('button', { name: 'New Transfer' });
        this.transfer_header =  page.locator('div').filter({ hasText: /^Select Securities for Transfer$/ }).first();
        this.account = page.getByLabel('Account').nth(1);
        this.type =  page.getByLabel('Account').nth(2);
        this.drs_popup = page.getByLabel('DRS Profile Transfer');
        this.proceed_btn = page.getByRole('button', { name: 'Proceed' });
        this.issue = page.getByLabel('Account').nth(3);
        this.trasfer_date = page.getByLabel('Choose date');
        this.holding_table = page.locator('table.MuiTable-root tbody').first(); 
        this.transfer_date_text = page.getByPlaceholder('YYYY-MM-DD')
    }

     async select_transfer_date(){
        await this.trasfer_date.click();
        this.date = timeHelper.get_effective_date();
        // select the very next available date if current day is weekend or holiday
        while(true){
            if(await this.page.getByRole('gridcell', { name: this.date, exact: true }).isDisabled()){
                this.date = String(parseInt(this.date) + 1).padStart(2, '0');
            }
            else{
                break;
            }
        }
        await expect(this.page.getByRole('gridcell', { name: this.date, exact: true })).toBeEnabled();
        await this.page.getByRole('gridcell', { name: this.date, exact: true }).click();
    }

    async select_securities(account, type, issue){
        await this.transfer_header.waitFor();
        await this.account.click();
        await this.page.getByRole('option', { name: account }).click();
        await this.type.click();
        await this.page.getByRole('option', { name: type }).click();
        await this.drs_popup.waitFor();
        await this.proceed_btn.click();
        await this.issue.click();
        await this.page.getByRole('option', { name: issue }).click();
    }

    async validate_taxlots_based_on_date(account, type, issue){
        await this.new_transfer.click();
        await this.select_securities(account, type, issue);
        await this.select_transfer_date();
        await this.holding_table.locator('tr').nth(0).locator('td').nth(0).waitFor();
        const row_count = await this.holding_table.locator('tr').count();
        for(var i=0; i<row_count; i++){
            if(await this.holding_table.locator('tr').nth(i).locator('td').nth(7).innerText() == '1933 Act'){
                await expect(this.holding_table.locator('tr').nth(i).locator('td').nth(0)).not.toBeEnabled();
            }
            else{
                await expect(this.holding_table.locator('tr').nth(i).locator('td').nth(0)).toBeEnabled();
            }
        }
        console.log(await this.transfer_date_text.inputValue());
        await this.transfer_date_text.fill('2025-08-05');
        for(var i=0; i<row_count; i++){
            await expect(this.holding_table.locator('tr').nth(i).locator('td').nth(0)).toBeEnabled();
        }
    }
}