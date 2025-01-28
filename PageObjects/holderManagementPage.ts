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
    }

    async search_for_holder(holder){
        await this.search_holder.waitFor();
        await this.search_holder.fill(holder);
        await this.page.getByRole('option', { name: holder }).click();
    }
   
    async validate_holder_details(name, email, tin, type){
        await expect(this.holder_details).toBeVisible();
        await expect(this.page.getByText(`Legal Name: ${name}`)).toBeVisible();
        await expect(this.page.getByText(`Email Address: ${email}`)).toBeVisible();
        await expect(this.page.getByText(`Holder Type: ${type}`)).toBeVisible();
        await expect(this.page.getByText(`TIN: ${tin}`)).toBeVisible();
    }

    async validate_holder_details_IA(name, email, type){
        await expect(this.holder_details).toBeVisible();
        await expect(this.page.getByText(`Legal Name: ${name}`)).toBeVisible();
        await expect(this.page.getByText(`Email Address: ${email}`)).toBeVisible();
        await expect(this.page.getByText(`Holder Type: ${type}`)).toBeVisible();
    }

    async generate_drs_statement_for_RO(name, issue){
        await this.generate_drs_statement.click();
        await expect(this.generate_drs_statement_popup).toBeVisible();
        await expect(this.page.getByLabel('Generate DRS Statement').getByText(name)).toBeVisible();
        await this.select_issue.click();
        await this.page.getByRole('option', { name: issue }).click();
        await this.date_from.fill('2025-01-24');
        await this.date_to.fill('2025-01-28');
        await this.gen_drs_stmt.click();
        await this.page.getByRole('button', { name: 'Print' }).click();
        await this.page.pdf(path='test.pdf');
        // await this.page.locator('div:nth-child(4) > div > .MuiBox-root > div > div').first().waitFor();
        // await this.page.locator('div:nth-child(4) > div > .MuiBox-root > div > div').first().click();

    }
}