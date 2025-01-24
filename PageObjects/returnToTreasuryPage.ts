import { expect, type Locator, type Page } from '@playwright/test';
import { timeHelper } from '../support/time.helper';

export class returnToTreasuryPage {
    readonly page: Page;
    readonly radio_TO: Locator;
    readonly radio_RT: Locator;
    readonly return_to_treasury_name: Locator;
    readonly return_to_treasury_issue: Locator;
    readonly return_to_treasury_reason: Locator;
    readonly select_securities: Locator;
    readonly search_security_by: Locator;
    readonly add_securities: Locator;
    readonly add_securities_done: Locator;
    readonly upload_RTT_doc_toggle: Locator;
    readonly upload_RTT_doc_btn: Locator;
    readonly effective_date: Locator;
    readonly upload_doc: Locator;
    readonly document_uploaded_msg: Locator;
    readonly close_doc_upload_popup: Locator;
    readonly search_secuirity: Locator;
    readonly search_by_email: Locator;
    readonly holding_table: Locator;
    readonly securities_table: Locator;
    readonly submit_order: Locator;
    readonly to_status_header: Locator;
    readonly rtt_details_completed: Locator;
    readonly rtt_presigned_doc_uploaded: Locator;
    readonly ro_doc_pending: Locator;
    readonly ro_doc_uploaded: Locator;
    readonly rtt_pending: Locator;
    readonly proceed_btn: Locator;
    readonly upload_holder_auth_doc: Locator;
    readonly upload_other_doc: Locator;
    readonly save_document: Locator;
    readonly rtt_completed: Locator;
    is_current_date_is_effective_date: Boolean;
    effective_date_selected: string;

    constructor(page: Page) {
        this.page = page;
        this.radio_TO = page.getByRole('radio', { name: 'Treasury Order' });
        this.radio_RT = page.getByRole('radio', { name: 'Return to Treasury' });
        this.return_to_treasury_name = page.locator('div').filter({ hasText: /^Return to Treasury Name$/ }).getByRole('textbox');
        this.return_to_treasury_issue = page.getByLabel('Issue').first();
        this.return_to_treasury_reason = page.getByLabel('Issue').nth(1);
        this.effective_date = page.locator('div').filter({ hasText: /^Effective Date$/ }).getByLabel('Choose date');
        this.select_securities = page.getByRole('button', { name: 'Select Securities' });
        this.search_security_by = page.getByRole('button', { name: 'Issue ​' });
        this.add_securities = page.getByRole('button', { name: 'Add selected tax lot(s)' });
        this.add_securities_done = page.getByRole('button', { name: 'Done' });
        this.upload_RTT_doc_toggle = page.locator('div').filter({ hasText: /^NO$/ }).nth(1);
        this.upload_RTT_doc_btn = page.locator('div').filter({ hasText: /^Upload Signed Document$/ });
        this.upload_doc = page.getByRole('button', { name: 'Upload' });
        this.document_uploaded_msg = page.locator('div').filter({ hasText: 'Document Uploaded' }).nth(2);
        this.close_doc_upload_popup = page.getByRole('button').first();
        this.search_secuirity = page.getByRole('combobox', { name: 'Search' });
        this.search_by_email = this.page.getByRole('option', { name: 'Register Owner Email' });
        this.holding_table = page.locator('table.MuiTable-root tbody').first(); 
        this.securities_table = page.locator('table.MuiTable-root tbody');
        this.submit_order = page.getByRole('button', { name: 'Submit Order' });
        this.to_status_header = page.getByText('Return to Treasury Order Status', { exact: true });
        this.rtt_details_completed = page.getByRole('button', { name: 'Return To Treasury Details' }).getByLabel('Completed');
        this.rtt_presigned_doc_uploaded = page.getByRole('button', { name: 'Pre-Signed Document Upload' }).getByLabel('Completed');
        this.ro_doc_pending = page.getByRole('button', { name: 'Registered Owner' }).getByLabel('In Progress');
        this.ro_doc_uploaded = page.getByRole('button', { name: 'Registered Owner' }).getByLabel('Completed')
        this.rtt_pending = page.getByRole('button', { name: 'Return To Treasury Complete' }).getByLabel('In Progress');
        this.rtt_completed = page.getByRole('button', { name: 'Return To Treasury Complete' }).getByLabel('Completed');
        this.proceed_btn = page.getByLabel('Proceed');
        this.upload_holder_auth_doc = page.locator('div').filter({ hasText: /^Upload Holder Authorization\(s\)UploadNo files selected$/ }).getByRole('button');
        this.upload_other_doc = page.locator('div').filter({ hasText: /^Upload Other DocumentsUploadNo files selected$/ }).getByRole('button');
        this.save_document = page.getByRole('button', { name: 'Save' });
    }

    async select_effective_date(){
        await this.effective_date.click();
        this.effective_date_selected = timeHelper.get_effective_date();
        // select the very next available date if current day is weekend or holiday
        while(true){
            if(await this.page.getByRole('gridcell', { name: this.effective_date_selected }).isDisabled()){
                this.effective_date_selected = String(parseInt(this.effective_date_selected) + 1).padStart(2, '0');
                this.is_current_date_is_effective_date = false;
            }
            else{
                break;
            }
        }
        await expect(this.page.getByRole('gridcell', { name: this.effective_date_selected })).toBeEnabled();
        await this.page.getByRole('gridcell', { name: this.effective_date_selected }).click();
    }

    async enter_return_RTT_details(name, issue, reason){
        await this.return_to_treasury_name.fill(name);
        await this.return_to_treasury_issue.click();
        await this.page.getByRole('option', { name: issue }).click();
        await this.return_to_treasury_reason.click();
        await this.page.getByRole('option', { name: reason }).click();
    }
    
    async upload_RTT_document(){
        await this.upload_RTT_doc_toggle.click();
        await this.upload_RTT_doc_btn.click();
        await this.upload_doc.setInputFiles('test_data/presigned_document.pdf');
        await this.page.waitForTimeout(5000); // waiting time to upload the document
        await expect(this.document_uploaded_msg).toBeVisible();
        await this.close_doc_upload_popup.click();
    }
    
    async create_return_to_treasury_order(name, issue, reason){
        await this.radio_RT.click();
        await this.page.waitForURL(`${process.env.HOST}issuers/treasury-orders/create?type=CANCELLATION`);
        await this.enter_return_RTT_details(name, issue, reason);
        await this.select_effective_date();
        await this.upload_RTT_document();  
    }

    async search_securities_by_email(email){
        await this.search_security_by.click();
        await this.search_by_email.click();
        await this.search_secuirity.fill(email);
        await this.page.getByText('automation').click();
    }

    async add_seacurites(email){
        await this.select_securities.click();
        await this.search_securities_by_email(email);
        await this.page.waitForTimeout(2000);
        await this.page.waitForSelector('table.MuiTable-root tbody');
        await this.holding_table.waitFor();
        await expect(this.holding_table).toBeVisible();
        await this.page.locator('.MuiTableCell-root > .MuiButtonBase-root > .PrivateSwitchBase-input').nth(0).check();
        await this.add_securities.click();
        await this.add_securities_done.click();
        await this.securities_table.waitFor();
        await expect(this.securities_table).toBeVisible();
    }

    async verify_securities_table(name, email, account_num, quantity){
        await expect(this.securities_table.locator('tr').nth(0).locator('td').nth(1)).toHaveText(name);
        await expect(this.securities_table.locator('tr').nth(0).locator('td').nth(2)).toHaveText(email);
        await expect(this.securities_table.locator('tr').nth(0).locator('td').nth(3)).toHaveText(account_num);
        await expect(this.securities_table.locator('tr').nth(0).locator('td').nth(6)).toHaveText(quantity);
    }

    async enter_quntity_to_cancel(quantity){
        await this.page.locator('td:nth-child(8)').dblclick();
        await this.page.getByPlaceholder('Quantity to Cancel').fill(quantity);
    }

    async submit_the_order(){
        await expect(this.submit_order).toBeVisible();
        await this.submit_order.click();
    }

    async validate_RTT_submission(){
        await expect(this.to_status_header).toContainText('Return to Treasury Order Status');
        await expect(this.rtt_details_completed).toBeVisible();
        await expect(this.rtt_presigned_doc_uploaded).toBeVisible();
        await expect(this.ro_doc_pending).toBeVisible();
        await expect(this.rtt_pending).toBeVisible();
    }

    async upload_ro_documents(url){
        await this.proceed_btn.click();
        await this.page.waitForURL(`${url}/document-uploader`);
        await this.upload_holder_auth_doc.setInputFiles('test_data/presigned_document.pdf');
        await this.upload_other_doc.setInputFiles('test_data/presigned_document.pdf');
        await this.page.waitForTimeout(1000); // wait for upload the document
        if(await this.save_document.isDisabled()){
            this.page.reload();
            await this.page.waitForURL(`${url}/document-uploader`);
            await this.upload_holder_auth_doc.waitFor();
            await this.upload_holder_auth_doc.setInputFiles('test_data/presigned_document.pdf');
            await this.upload_other_doc.setInputFiles('test_data/presigned_document.pdf');
        }
        await this.save_document.click();
        await this.page.waitForTimeout(5000); // waiting time to upload the document
    }

    async validate_ro_documents_uploaded(url){
        await expect(this.document_uploaded_msg).toBeVisible();
        await this.close_doc_upload_popup.click();
        await this.page.waitForURL(url);
        await expect(this.to_status_header).toContainText('Return to Treasury Order Status');
        await expect(this.ro_doc_uploaded).toBeVisible();
    }

    async validate_RTT_completion(url){
        await this.page.reload();
        await this.page.waitForURL(url);
        await this.to_status_header.waitFor();
        await expect(this.to_status_header).toContainText('Return to Treasury Order Status');
        await expect(this.rtt_completed).toBeVisible();
    }
}