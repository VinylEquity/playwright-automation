import { expect, type Locator, type Page } from '@playwright/test';
import { randomInt } from 'crypto';

export class transfersPage{
    readonly page: Page;
    readonly new_transfer: Locator;
    readonly issuer: Locator;
    readonly issue: Locator;
    readonly received_date: Locator;
    readonly transfer_type: Locator;
    readonly search_by: Locator;
    readonly notes: Locator;
    readonly brokerage_acnt_num: Locator;
    readonly transfer_control_num: Locator;
    readonly participant_id: Locator;
    readonly received_by: Locator;
    readonly returned_by: Locator;
    readonly total_quantity: Locator;
    readonly submit_transfer: Locator;
    readonly transfer_status_draft: Locator;
    readonly transfer_status_complete: Locator;
    readonly proceed_btn: Locator;
    readonly add_transferor: Locator;
    readonly search_transferor_user: Locator;
    readonly transferor_table: Locator;
    readonly added_transferor_table: Locator;
    readonly select_transferor: Locator;
    readonly transfer_quantity: Locator;
    readonly add_selected: Locator;
    readonly done: Locator;
    readonly submit_transferors: Locator;
    readonly tranferor_form_doc: Locator;
    readonly medallion_num: Locator;
    readonly medallion_transfer_value: Locator;
    readonly save_doc: Locator;
    readonly approve_transfer: Locator;
    readonly approve_popup: Locator;
    readonly approve_yes: Locator;

    constructor(page: Page){
        this.page = page;
        this.new_transfer = page.getByRole('button', { name: 'New Transfer' });
        this.issuer = page.getByLabel('Issuer').first();
        this.issue = page.getByLabel('Issuer').nth(1);
        this.received_date = page.getByLabel('Choose date');
        this.transfer_type = page.getByLabel('Issuer').nth(2);
        this.search_by = page.locator('.MuiGrid-root > div > div > div > .MuiFormControl-root > .MuiInputBase-root > #outlined-select').first();
        this.notes = page.locator('textarea[name="notes"]');
        this.brokerage_acnt_num = page.locator('input[name="brokerage_account_number"]');
        this.transfer_control_num = page.locator('input[name="transfer_control_number"]');
        this.participant_id = page.locator('div:nth-child(8) > div > .MuiFormControl-root > .MuiInputBase-root > #outlined-select');
        this.received_by = page.locator('div:nth-child(9) > div > .MuiFormControl-root > .MuiInputBase-root > #outlined-select');
        this.returned_by = page.locator('div:nth-child(10) > div > .MuiFormControl-root > .MuiInputBase-root > #outlined-select');
        this.total_quantity = page.locator('input[name="total_quantity"]');
        this.submit_transfer = page.getByRole('button', { name: 'Submit' });
        this.transfer_status_draft = page.getByText('Transfer StatusDraft');
        this.transfer_status_complete = page.getByText('Transfer StatusCompleted')
        this.proceed_btn = page.getByLabel('Proceed').getByRole('img');
        this.add_transferor = page.getByRole('button', { name: 'Add Transferors' });
        this.search_transferor_user = page.getByRole('combobox', { name: 'Search' });
        this.transferor_table = page.locator('table.MuiTable-root tbody').first();
        this.added_transferor_table = page.locator('table.MuiTable-root tbody');
        this.select_transferor = page.getByRole('checkbox', { name: 'Toggle select row' });
        this.transfer_quantity = page.getByPlaceholder('Transfer Quantity');
        this.add_selected = page.getByRole('button', { name: 'Add selected tax lot(s)' });
        this.done = page.getByRole('button', { name: 'Done' });
        this.submit_transferors = page.getByRole('button', { name: 'Submit Transferors' });
        this.tranferor_form_doc = page.getByRole('button', { name: 'Upload' }).nth(1);
        this.medallion_num = page.getByRole('textbox');
        this.medallion_transfer_value = page.getByLabel('Medallion Transfer Value Cap');
        this.save_doc = page.getByRole('button', { name: 'Save' });
        this.approve_transfer = page.getByRole('button', { name: 'Approve' });
        this.approve_popup = page.getByLabel('Approve Transfer');
        this.approve_yes = page.getByRole('button', { name: 'Yes' });
    }

    async select_received_date(){
        await this.received_date.click();
        var date = '1';
        // select the very next available date if current day is weekend or holiday
        while(parseInt(date) <= 31){
            if(await this.page.getByRole('gridcell', { name: date, exact: true }).isDisabled()){
                if(parseInt(date)<10){
                    date = String(parseInt(date) + 1);
                }
                else{
                    date = String(parseInt(date) + 1).padStart(2, '0');
                }
            }
            else{
                break;
            }
        }
        await expect(this.page.getByRole('gridcell', { name: date, exact: true  })).toBeEnabled();
        await this.page.getByRole('gridcell', { name: date, exact: true  }).click();
    }

    async create_new_transfer(issuer, issue, type, quantity){
        await this.new_transfer.click();
        await this.page.waitForURL(`${process.env.HOST}holders/transfers/create`);
        await this.issuer.click();
        await this.page.getByRole('option', { name: issuer }).click();
        await this.issue.click();
        await this.page.getByRole('option', { name: issue }).click();
        await this.select_received_date();
        await this.transfer_type.click();
        await this.page.getByRole('option', { name: type }).click();
        await this.search_by.waitFor();
        await expect(this.search_by).toBeVisible();
        await this.search_by.click();
        await this.page.getByRole('option', { name: 'DTC' }).click();
        await this.notes.fill('Test Transfers Automation');
        await this.brokerage_acnt_num.fill(`Test${randomInt(0,999)}`);
        await this.transfer_control_num.fill(`${randomInt(0,999)}`);
        await this.participant_id.click();
        await this.page.getByRole('option', { name: '0005 | GOLDMAN SACHS & CO. LLC' }).click();
        await this.received_by.click();
        await this.page.getByRole('option', { name: 'DTC Portal' }).click();
        await this.returned_by.click();
        await this.page.getByRole('option', { name: 'DTC Portal' }).click();
        await this.total_quantity.fill(String(quantity));
        await this.submit_transfer.click();
    }

    async is_transfer_created(){
        await this.transfer_status_draft.waitFor();
        await expect(this.transfer_status_draft).toBeVisible();
    }

    async add_transferer(url, name, account_num, quantity){
        await this.proceed_btn.click();
        await this.page.waitForURL(`${url}?tab=details`);
        await this.add_transferor.scrollIntoViewIfNeeded();
        await this.add_transferor.click();
        await this.search_transferor_user.fill('automation');
        await this.page.getByText(`${name} | ${account_num} |`).click();
        await this.page.waitForTimeout(2000);
        await this.page.waitForSelector('table.MuiTable-root tbody');
        await this.transferor_table.waitFor();
        await expect(this.transferor_table).toBeVisible();
        await this.select_transferor.check();
        await this.page.locator('td:nth-child(9)').first().dblclick();
        await this.transfer_quantity.fill(String(quantity));
        await expect(this.add_selected).toBeEnabled();
        await this.add_selected.click();
        await expect(this.done).toBeEnabled();
        await this.done.click();
    }

    async validate_added_transferor(name, account_num, quantity){
        await expect(this.added_transferor_table).toBeVisible();
        await expect(this.added_transferor_table.locator('tr').nth(0).locator('td').nth(1)).toHaveText(name);
        await expect(this.added_transferor_table.locator('tr').nth(0).locator('td').nth(2)).toHaveText(account_num);
        await expect(this.added_transferor_table.locator('tr').nth(0).locator('td').nth(4)).toHaveText(String(quantity));
    }

    async upload_documents_and_enter_medallion_details(url){
        await this.proceed_btn.click();
        await this.page.waitForURL(`${url}?tab=documents`);
        await this.tranferor_form_doc.waitFor();
        await this.tranferor_form_doc.setInputFiles('test_data/presigned_document.pdf');
        await this.medallion_num.fill(`${randomInt(0,999)}`);
        await this.medallion_transfer_value.click();
        await this.page.getByRole('option', { name: 'D -' }).click();
        await this.save_doc.click();
    }

    async approve_the_transfer(url){
        await this.proceed_btn.click();
        await this.page.waitForURL(`${url}?tab=details`);
        await this.approve_transfer.click();
        await expect(this.approve_popup).toBeVisible();
        await this.approve_yes.click();
        await this.page.waitForTimeout(5000); //wait for approval
    }
}