import { test, expect } from '@playwright/test';
import { vinylPages } from '../../PageObjects/vinylPages'
import { randomInt } from 'crypto';
import { timeHelper } from '../../support/time.helper';
import { mailerMethods } from '../../support/mailer.methods';

test.describe("Vinyl Treasury Order", {tag: '@dev_sanity'}, async () => {
  let VinylPages: vinylPages;
  let quantity: number;

  test.beforeEach(async ({ page }) => {
    VinylPages = new vinylPages(page);
    await page.goto(process.env.HOST as string); // open the app
    await expect(page.getByText('Enter Your Email To Sign In')).toBeVisible(); // make sure app is in login page 
    await VinylPages.SignInPage.login(process.env.RO_USER as string);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(process.env.HOST as string + "portfolio");
    quantity = await VinylPages.PortfolioPage.get_issuer_quantity();
    await VinylPages.PortfolioPage.logout();
  });
  
  test.afterEach(async ({page}) => {
    await page.close();
  });

  test('Create New Treasury Order and automatic release of Treasury Order', async ({ page }) => {
    const name = 'Test ' + randomInt(0,999);
    const description = 'Description Test ' + randomInt(0,999);
    await VinylPages.SignInPage.login(process.env.TA_USER as string);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await VinylPages.DashboardPage.go_to_treasury_order_page();
    await page.waitForURL(process.env.HOST as string + "issuers/treasury-orders");
    await VinylPages.TreasuryOrderPage.select_issuer(process.env.ISSUER);
    await VinylPages.TreasuryOrderPage.create_treasury_order.click();
    await page.waitForURL(process.env.HOST as string + "issuers/treasury-orders/create?type=ISSUANCE");
    await VinylPages.TreasuryOrderPage.enter_TO_details(name, process.env.ISSUE, 'IPO', description, 'Email');
    await VinylPages.TreasuryOrderPage.add_existing_automation_ro_recipient(process.env.RO_USER);
    await VinylPages.TreasuryOrderPage.validate_recipent_added('automation', process.env.RO_USER, process.env.RO_TIN);
    await VinylPages.TreasuryOrderPage.enter_quantity_and_price(1, 1);
    await VinylPages.TreasuryOrderPage.submit_TO();
    await VinylPages.TreasuryOrderPage.is_TO_submitted();
    await VinylPages.TreasuryOrderPage.validate_TO_details(name, description, 'IPO', process.env.ISSUER, process.env.ISSUE, 1, 'Email');
    var automatic_release_time = await VinylPages.TreasuryOrderPage.get_release_date_and_time();
    var wait_time = timeHelper.get_wait_time(automatic_release_time);
    await VinylPages.TreasuryOrderPage.validate_TO_document(name);
    var url = await page.url();
    await page.waitForTimeout(wait_time); // wait for the automatic release of TO
    var subject = process.env.ISSUER + " has issued " + process.env.ISSUE + " to automation";
    await page.reload();
    await page.waitForURL(url);
    await mailerMethods.get_TO_mail(subject, process.env.RO_USER as string);
    await VinylPages.TreasuryOrderPage.is_TO_release_completed();
    await VinylPages.DashboardPage.logout();

    await VinylPages.SignInPage.login(process.env.RO_USER as string);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(process.env.HOST as string + "portfolio");
    await expect(await VinylPages.PortfolioPage.get_issuer_quantity()).toBe(quantity + 1);
    await VinylPages.PortfolioPage.logout();
  });
});