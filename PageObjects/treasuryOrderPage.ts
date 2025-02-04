import { expect, type Locator, type Page } from '@playwright/test';
import { timeHelper } from '../support/time.helper';
import { apiMethods } from '../support/apiMethods';
import { randomInt } from 'crypto';

export class treasuryOrderPage {
    is_current_date_is_effective_date: Boolean;
    effective_date_selected: string;
    APIMethods: apiMethods
    readonly page: Page;
    readonly select_issuer_profile: Locator;
    readonly create_treasury_order: Locator;
    readonly order_name: Locator;
    readonly issue: Locator;
    readonly issue_option_1: Locator;
    readonly reason: Locator;
    readonly reason_option_1: Locator;
    readonly description: Locator;
    readonly effective_date: Locator;
    readonly release_date: Locator;
    readonly release_date_time_ok: Locator;
    readonly delivery_method: Locator;
    readonly act_1993: Locator;
    readonly board_approval: Locator;
    readonly upload_document_btn: Locator;
    readonly upload_doc: Locator;
    readonly document_uploaded_msg: Locator;
    readonly close_doc_upload_popup: Locator;
    readonly add_recipient_btn: Locator;
    readonly search_ro_user: Locator;
    readonly save_ro: Locator;
    readonly recipient_row1: Locator;
    readonly quantity: Locator;
    readonly price: Locator;
    readonly submit_order: Locator;
    readonly release_date_error: Locator;
    readonly to_status_header: Locator;
    readonly to_pending_release_pending: Locator;
    readonly to_compeleted_pending: Locator;
    readonly status_tab: Locator;
    readonly document_tab: Locator;
    readonly details_tab: Locator;
    readonly presigned_document: Locator;
    readonly document_uploaded_icon: Locator;
    readonly submission_done: Locator;
    readonly signature_done: Locator;
    readonly pending_release_done: Locator;
    readonly completed_done: Locator;
    readonly disable_1933_act_popup: Locator;
    readonly legal_opinion_name: Locator;
    readonly legal_opinion_desc: Locator;
    readonly legal_opinion_doc: Locator
    readonly legal_opinion_create: Locator;
    readonly select_legal_opinion: Locator;
    readonly save_legal_opinion: Locator;

    constructor(page: Page){
        this.page = page;
        this.select_issuer_profile = page.getByRole('button', { name: 'Select an Issuer Profile' });
        this.create_treasury_order = page.getByRole('button', { name: 'Create New Order' });
        this.order_name = page.locator('div').filter({ hasText: /^Treasury Order Name$/ }).getByRole('textbox');
        this.issue = page.getByLabel('Issue').first();
        this.reason = page.getByLabel('Issue').nth(1);
        this.description = page.locator('div').filter({ hasText: /^Description$/ }).getByRole('textbox');
        this.effective_date = page.locator('div').filter({ hasText: /^Effective Date$/ }).getByLabel('Choose date');
        this.release_date = page.locator('div').filter({ hasText: /^Automatic Release Date\/Time$/ }).getByLabel('Choose date');
        this.release_date_time_ok = page.getByRole('button', { name: 'OK' });
        this.delivery_method = page.getByText('Email', { exact: true });
        this.act_1993 = page.getByText('<>').first();
        this.board_approval = page.getByText('<>');
        this.upload_document_btn = page.getByRole('button', { name: 'Upload Signed Document' });
        this.upload_doc = page.getByRole('button', { name: 'Upload' });
        this.document_uploaded_msg = page.locator('div').filter({ hasText: 'Document Uploaded' }).nth(2);
        this.close_doc_upload_popup = page.getByRole('button').first();
        this.add_recipient_btn = page.getByLabel('Add Recipient');
        this.search_ro_user = page.getByPlaceholder('Search by Legal Name, Email');
        this.save_ro = page.getByRole('button', { name: 'Save' });
        this.recipient_row1 = page.getByRole('cell', { name: 'Collapse' });
        this.quantity = page.getByRole('cell', { name: '0', exact: true }).getByRole('textbox');
        this.price = page.getByRole('row', { name: 'Collapse Toggle select row' }).getByRole('textbox').first();
        this.submit_order = page.getByRole('button', { name: 'Submit Order' });
        this.release_date_error =  page.getByText('Date/Time must be in the future', { exact: true });
        this.to_status_header = page.getByText('Treasury Order Status', { exact: true });
        this.to_pending_release_pending = page.locator('svg').filter({ hasText: '3' }).locator('circle');
        this.to_compeleted_pending = page.locator('svg').filter({ hasText: '4' }).locator('circle');
        this.status_tab = page.getByText('Status', { exact: true }).first();
        this.document_tab = page.getByText('Documents', { exact: true });
        this.details_tab = page.getByText('Details', { exact: true });
        this.presigned_document = page.getByRole('button', { name: 'Treasury Order - Test 465 -' });
        this.document_uploaded_icon = page.getByLabel('Uploaded');
        this.submission_done = page.locator('div').filter({ hasText: /^Submitted$/ }).locator('path');
        this.signature_done = page.locator('div').filter({ hasText: /^Awaiting Signatures$/ }).locator('path');
        this.pending_release_done = page.locator('div').filter({ hasText: /^Pending Release$/ }).locator('path')
        this.completed_done = page.locator('div').filter({ hasText: /^Completed$/ }).locator('path');
        this.is_current_date_is_effective_date = true;
        this.disable_1933_act_popup = page.getByLabel('Upload Supporting Legal');
        this.legal_opinion_name = page.locator('input[name="name"]');
        this.legal_opinion_desc = page.locator('input[name="description"]');
        this.legal_opinion_doc = page.getByRole('button', { name: 'Upload' }).first();
        this.legal_opinion_create = page.getByRole('button', { name: 'Create' });
        this.select_legal_opinion = page.locator('div').filter({ hasText: /^Legal Opinion Name$/ });
        this.save_legal_opinion = page.getByRole('button', { name: 'Save' });
    }

    async select_issuer(issuer){
        await this.select_issuer_profile.click();
        await this.page.getByRole('heading', { name: issuer, exact: true }).click();
    }

    async select_effective_date(){
        await this.effective_date.click();
        this.effective_date_selected = timeHelper.get_effective_date();
        // select the very next available date if current day is weekend or holiday
        while(true){
            if(await this.page.getByRole('gridcell', { name: this.effective_date_selected, exact: true }).isDisabled()){
                this.effective_date_selected = String(parseInt(this.effective_date_selected) + 1).padStart(2, '0');
                this.is_current_date_is_effective_date = false;
            }
            else{
                break;
            }
        }
        await expect(this.page.getByRole('gridcell', { name: this.effective_date_selected, exact: true })).toBeEnabled();
        await this.page.getByRole('gridcell', { name: this.effective_date_selected, exact: true }).click();
    }

    // selects the current date and nearby time as release date and time 
    async select_release_date_and_time(effective_date: string){
        var date_time = timeHelper.get_automatic_release_date_time();
        await this.release_date.click();
        await this.page.getByRole('gridcell', { name: effective_date }).nth(1).click();
        if(await this.page.getByLabel(date_time[1] + ' hours', { exact: true }).isVisible()){
            await this.page.getByLabel(date_time[1] + ' hours', { exact: true }).click();
        }
        else{
            await this.release_date.click();
            await this.page.getByLabel(date_time[1] + ' hours', { exact: true }).click();
        }
        await this.page.getByLabel(date_time[2] + ' minutes',  { exact: true }).click();
        await this.release_date_time_ok.click();
    }

    async disable_board_approval(){
        await this.board_approval.click();
        await this.page.getByText('YES').nth(1).click();
        await this.page.getByText('NO').nth(1).click();
    }

    async upload_presigned_document(){
        await this.upload_document_btn.click();
        await this.upload_doc.setInputFiles('test_data/presigned_document.pdf');
        await this.page.waitForTimeout(5000); // waiting time to upload the document
        await expect(this.document_uploaded_msg).toBeVisible();
        await this.close_doc_upload_popup.click();
    }
    
    async disable_1933_act_for_TO(){
        var name = `TestLegalOpinion ${randomInt(0,999)}`
        await this.page.locator('div').filter({ hasText: /^YES$/ }).nth(1).click();
        await this.disable_1933_act_popup.waitFor();
        await this.legal_opinion_name.fill(name);
        await this.legal_opinion_desc.fill(name);
        await this.legal_opinion_doc.setInputFiles('test_data/presigned_document.pdf');
        await this.page.waitForTimeout(5000); 
        await expect(this.legal_opinion_create).toBeEnabled();
        await this.legal_opinion_create.click();
        await expect(this.page.locator('div').filter({ hasText: 'Successfully stored the Supporting Legal Opinion, please select the document from the list' }).nth(2)).toBeVisible();
        await this.select_legal_opinion.click();
        await this.page.getByRole('option', { name: name }).click();
        await this.save_legal_opinion.click();
    }

    async enter_TO_details(name, issue, reason, description, d_method, disable_1993_act){
        await this.order_name.fill(name);
        await this.issue.click();
        await this.page.getByRole('option', { name: issue }).click();
        await this.reason.click();
        await this.page.getByRole('option', { name: reason }).click();
        await this.description.fill(description);
        await this.select_effective_date();
        await this.select_release_date_and_time(this.effective_date_selected);
        await this.delivery_method.click();
        await this.page.getByRole('option', { name: d_method }).click();
        await this.act_1993.click();
        await this.disable_board_approval();
        await this.upload_presigned_document();
        if(disable_1993_act){
           await this.disable_1933_act_for_TO();
        }
        return this.is_current_date_is_effective_date;
    } 

    async add_existing_automation_ro_recipient(email){
        await this.add_recipient_btn.click();
        await this.search_ro_user.fill(email);
        await this.page.getByRole('option', { name: email }).click();
        await this.save_ro.click();
    }

    async validate_recipent_added(name, email, tin){
        await expect(this.recipient_row1).toBeVisible();
        await this.recipient_row1.scrollIntoViewIfNeeded();
        await expect(this.page.getByRole('cell', { name: name.toUpperCase(), exact: true })).toBeVisible();
        await expect(this.page.getByRole('cell', { name: email, exact: true })).toBeVisible();
        await expect(this.page.getByRole('cell', { name: tin , exact: true })).toBeVisible();
    }

    async enter_quantity_and_price(quantity, price){
        await this.quantity.fill(String(quantity));
        await this.price.fill(String(price));
    }

    async submit_TO(){
        // reselecting the release date/time again if automatic release time passed
        if(await this.release_date_error.count() != 0){
            this.select_release_date_and_time(this.effective_date_selected); 
        }
        await expect(this.submit_order).toBeVisible();
        await this.submit_order.click();
    }

    async is_TO_submitted(){
        await this.to_status_header.waitFor();
        await expect(this.to_status_header).toContainText('Treasury Order Status');
        await expect(this.submission_done).toHaveCSS("color", "rgb(33, 150, 243)");
        await expect(this.signature_done).toHaveCSS("color", "rgb(33, 150, 243)");
        await expect(this.to_pending_release_pending).toHaveCSS("color", "rgb(33, 150, 243)");
        await expect(this.to_compeleted_pending).toHaveCSS("color", "rgba(0, 0, 0, 0.38)");
    }

    async validate_TO_details(name, description, reason, issuer, issue, quantity, delivery_method){
        await this.details_tab.click();
        await expect(this.page.getByText(name)).toBeVisible();
        await expect(this.page.getByText(description)).toBeVisible();
        await expect(this.page.getByText(reason)).toBeVisible();
        await expect(this.page.getByLabel('Details').getByText(issuer)).toBeVisible();
        await expect(this.page.getByText(issue)).toBeVisible();
        await expect(this.page.getByText(quantity).first()).toBeVisible();
        await expect(this.page.getByText(delivery_method, { exact: true })).toBeVisible();
    }

    async validate_TO_document(name){
        await this.status_tab.click();
        await expect(this.document_uploaded_icon).toBeVisible();
        await this.document_tab.click();
        await expect(this.page.getByRole('button', { name: `Treasury Order - ${name} -` })).toBeVisible();
    }

    async get_release_date_and_time(){
        var date = new Date();
        var release_date = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
        var release_date_time = String(await this.page.getByText(`Automatic Release Date/Time :${release_date}`).textContent()).replace('Automatic Release Date/Time :','');
        return release_date_time;
    }

    async is_TO_release_completed(){
        await this.to_status_header.waitFor();
        await expect(this.to_status_header).toBeVisible();
        await expect(this.to_status_header).toContainText('Treasury Order Status');
        await expect(this.submission_done).toHaveCSS("color", "rgb(33, 150, 243)");
        await expect(this.signature_done).toHaveCSS("color", "rgb(33, 150, 243)");
        await expect(this.pending_release_done).toHaveCSS("color", "rgb(33, 150, 243)");
        await expect(this.completed_done).toHaveCSS("color", "rgb(33, 150, 243)");
    }

    async create_and_release_TO(name, issue, issuer, reason, description, type, ro_name, ro_user, ro_tin, quantity, request, disable_1993_act){
        this.APIMethods = new apiMethods(request);
        await this.select_issuer(issuer);
        await this.create_treasury_order.click();
        await this.page.waitForURL(`${process.env.HOST}issuers/treasury-orders/create?type=ISSUANCE`);
        var automatic_release = await this.enter_TO_details(name, issue, reason, description, type, disable_1993_act);
        await this.add_existing_automation_ro_recipient(ro_user);
        await this.validate_recipent_added(ro_name, ro_user, ro_tin);
        await this.enter_quantity_and_price(quantity, 1);
        await this.submit_TO();
        await this.is_TO_submitted();
        await this.validate_TO_document(name);
        await this.validate_TO_details(name, description, reason, issuer, issue, quantity, type);
        var url = await this.page.url();
        await this.APIMethods.api_release_TO(url.replace(`${process.env.HOST}issuers/treasury-orders/`, '').replace('#', ''));
        await this.page.reload();
        await this.page.waitForURL(url);
        await this.is_TO_release_completed();
    }
}