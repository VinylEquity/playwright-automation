import { expect, type Locator, type Page } from '@playwright/test';


export class holderManagementPage{
    readonly page: Page
    readonly search_holder: Locator;
    readonly holder_details: Locator;
    readonly generate_drs_statement: Locator;
    readonly generate_drs_statement_popup: Locator;
    readonly select_issue: Locator;
    readonly gen_drs_stmt: Locator;
    readonly date_from: Locator;
    readonly date_to: Locator;
    readonly holder_stop_btn: Locator;
    readonly position_stop_btn: Locator;
    readonly holder_stop_popup: Locator;
    readonly position_stop_popup: Locator;
    readonly holder_stop_reason: Locator;
    readonly holder_stop_additional_info: Locator;
    readonly holder_stop_document: Locator;
    readonly holder_stop_doc_uploaded: Locator;
    readonly holder_stop_save: Locator;
    readonly alert: Locator;
    readonly manage_holder_stop_btn: Locator;
    readonly manage_position_stop_btn: Locator;
    readonly holder_stop_reason_info: Locator;
    readonly manage_holder_stop_popup: Locator;
    readonly manage_holder_stops_table: Locator;
    readonly manage_position_stop_popup: Locator;
    readonly manage_position_stops_table: Locator;
    readonly holders_table: Locator;
    readonly cancel_drs_statement: Locator;

    constructor(page: Page){
        this.page = page;
        this.search_holder = page.getByPlaceholder('Type ahead search by');
        this.holder_details = page.locator('.MuiGrid-root > .MuiPaper-root > .MuiCardContent-root');
        this.generate_drs_statement =  page.getByRole('button', { name: 'Generate DRS Statement' });
        this.generate_drs_statement_popup = page.getByLabel('Generate DRS Statement');
        this.select_issue = page.getByLabel('', { exact: true });
        this.gen_drs_stmt = page.getByLabel('Generate DRS Statement').locator('div').filter({ hasText: /^Generate DRS Statement$/ });
        this.date_from = page.getByLabel('Date From');
        this.date_to = page.getByLabel('Date To');
        this.holder_stop_btn = page.getByRole('button', { name: 'Add Stop' }).first();
        this.position_stop_btn = page.getByRole('button', { name: 'Add Stop' }).nth(1);
        this.holder_stop_popup =  page.getByLabel('Add Holder Stop');
        this.position_stop_popup =  page.getByLabel('Add Position Stop');
        this.holder_stop_reason = page.getByLabel('Reason for Stop');
        this.holder_stop_additional_info = page.locator('input[name="additionalInfo"]');
        this.holder_stop_document = page.getByRole('button', { name: 'Upload supporting document' });
        this.holder_stop_save = page.getByRole('button', { name: 'Save' });
        this.holder_stop_doc_uploaded = page.getByText('Selected 1 file');
        this.alert = page.locator('[id="__next"]').getByRole('alert');
        this.manage_holder_stop_btn = page.getByRole('button', { name: 'Manage Stops' });
        this.manage_position_stop_btn = page.getByRole('button', { name: 'Manage Stop' }).nth(1)
        this.holder_stop_reason_info = page.locator('div').filter({ hasText: /^Other$/ })
        this.manage_holder_stop_popup = page.getByLabel('Manage Holder Stop');
        this.manage_position_stop_popup = page.getByLabel('Manage Positions Stop');
        this.manage_holder_stops_table = page.getByLabel('Manage Holder Stop').locator('table.MuiTable-root tbody');
        this.manage_position_stops_table = page.getByLabel('Manage Positions Stop').locator('table.MuiTable-root tbody');
        this.holders_table = page.locator('table.MuiTable-root tbody').nth(0);
        this.cancel_drs_statement = page.getByRole('button', { name: 'Cancel' });
    }

    async search_for_holder(holder){
        await this.search_holder.waitFor();
        await this.search_holder.fill(holder);
        await this.page.getByRole('option', { name: holder }).click();
    }
   
    async validate_holder_details_TA(name, email, tin, type, address){
        await expect(this.holder_details).toBeVisible();
        await expect(this.page.getByText(`Legal Name: ${name}`)).toBeVisible();
        await expect(this.page.getByText(`Email Address: ${email}`)).toBeVisible();
        await expect(this.page.getByText(`Holder Type: ${type}`)).toBeVisible();
        await expect(this.page.getByText(`TIN: ${tin}`)).toBeVisible();
        await expect(this.page.getByText(`Mailing Address: ${address}`)).toBeVisible();
    }

    async validate_holder_details_IA(name, email, type, address){
        await expect(this.holder_details).toBeVisible();
        await expect(this.page.getByText(`Legal Name: ${name}`)).toBeVisible();
        await expect(this.page.getByText(`Email Address: ${email}`)).toBeVisible();
        await expect(this.page.getByText(`Holder Type: ${type}`)).toBeVisible();
        await expect(this.page.getByText(`Mailing Address: ${address}`)).toBeVisible();
    }

    async add_holder_stop(){
        await expect(this.holder_stop_btn).toBeVisible();
        await expect(this.holder_stop_btn).toBeEnabled();
        await this.holder_stop_btn.click();
        await expect(this.holder_stop_popup).toBeVisible();
        await this.holder_stop_reason.click();
        await this.page.getByRole('option', { name: 'Other' }).click();
        await this.holder_stop_additional_info.fill('Test');
        await this.holder_stop_document.setInputFiles('test_data/presigned_document.pdf');
        await this.page.waitForTimeout(5000); // waiting time to upload the document
        await this.holder_stop_doc_uploaded.waitFor();
        await this.holder_stop_save.click()
    }
    
    async add_position_stop(){
        await this.holders_table.scrollIntoViewIfNeeded();
        await expect(this.position_stop_btn).toBeDisabled();
        await this.holders_table.locator('tr').nth(0).locator('td').nth(0).click();
        await this.holders_table.locator('tr').nth(1).locator('td').nth(1).click();
        await expect(this.position_stop_btn).toBeEnabled();
        await this.position_stop_btn.click();
        await expect(this.position_stop_popup).toBeVisible();
        await this.holder_stop_reason.click();
        await this.page.getByRole('option', { name: 'Other' }).click();
        await this.holder_stop_additional_info.fill('Test');
        await this.holder_stop_save.click()
    }

    async validate_holder_stop_added(){
        await this.alert.waitFor();
        await expect(this.alert).toHaveText("Added holder stop successfully");
        await expect(this.manage_holder_stop_btn).toBeVisible();
        await expect(this.manage_holder_stop_btn).toBeEnabled();
        await expect(this.holder_stop_reason_info).toBeVisible();
        await this.manage_holder_stop_btn.click();
        await expect(this.manage_holder_stop_popup).toBeVisible();
        await expect(this.manage_holder_stops_table.locator('tr').nth(0).locator('td').nth(2)).toHaveText('Other');
        await expect(this.manage_holder_stops_table.locator('tr').nth(0).locator('td').nth(3)).toHaveText(new Date().toLocaleDateString("fr-CA", {year:"numeric", month: "2-digit", day:"2-digit"}));
        await expect(this.manage_holder_stops_table.locator('tr').nth(0).locator('td').nth(4)).toHaveText('');
        await expect(this.manage_holder_stops_table.locator('tr').nth(0).locator('td').nth(5)).toHaveText('Test');
    }

    async validate_position_stop_added(){
        await this.alert.waitFor();
        await expect(this.alert).toHaveText("Added position stop successfully");
        await this.holders_table.scrollIntoViewIfNeeded();
        await expect(this.position_stop_btn).toBeDisabled();
        await expect(this.manage_position_stop_btn).toBeDisabled();
        await this.holders_table.locator('tr').nth(1).locator('td').nth(1).click();
        await expect(this.manage_position_stop_btn).toBeEnabled();
        await this.manage_position_stop_btn.click();
        await expect(this.manage_position_stop_popup).toBeVisible();
        await expect(this.manage_position_stops_table.locator('tr').nth(0).locator('td').nth(2)).toHaveText('Other');
        await expect(this.manage_position_stops_table.locator('tr').nth(0).locator('td').nth(3)).toHaveText(new Date().toLocaleDateString("fr-CA", {year:"numeric", month: "2-digit", day:"2-digit"}));
        await expect(this.manage_position_stops_table.locator('tr').nth(0).locator('td').nth(4)).toHaveText('');
        await expect(this.manage_position_stops_table.locator('tr').nth(0).locator('td').nth(5)).toHaveText('Test');
    }

    async remove_stop(){
        this.page.getByRole('row', { name: 'Expand Other' }).getByRole('button').nth(1).click();
    }

    async validate_holder_stop_removed(){
        await this.alert.waitFor();
        await expect(this.alert).toHaveText("Removed holder stop successfully");
        await expect(this.manage_holder_stop_btn).toBeVisible();
        await expect(this.manage_holder_stop_btn).toBeDisabled();
    }

    async validate_position_stop_removed(){
        await this.alert.waitFor();
        await expect(this.alert).toHaveText("Removed position stop successfully");
        await this.holders_table.locator('tr').nth(1).locator('td').nth(1).click();
        await expect(this.manage_position_stop_btn).toBeDisabled();
    }

    async generate_drs_statement_for_RO(name, issue, from_date, to_date){
        await this.generate_drs_statement.click();
        await expect(this.generate_drs_statement_popup).toBeVisible();
        await expect(this.page.getByLabel('Generate DRS Statement').getByText(name)).toBeVisible();
        await this.select_issue.click();
        await this.page.getByRole('option', { name: issue }).click();
        await this.date_from.fill(from_date);
        await this.date_to.fill(to_date);
        await this.gen_drs_stmt.click();
        await this.page.getByRole('button', { name: 'Print' }).click();
        return await this.page.locator('iframe').getAttribute("src");
    }
}