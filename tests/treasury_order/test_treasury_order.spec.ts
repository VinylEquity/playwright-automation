import { test, expect } from '@playwright/test';
import { vinylPages } from '../../PageObjects/vinylPages'
import { randomInt } from 'crypto';
import { timeHelper } from '../../support/time.helper';
import { mailerMethods } from '../../support/mailer.methods';

<<<<<<< HEAD
test.describe("Vinyl Treasury Order", async () => {
  let VinylPages: vinylPages;
  let quantity: number;

  test.beforeEach(async ({ page }) => {
    VinylPages = new vinylPages(page);
    await page.goto(`${process.env.HOST}`); // open the app
    await expect(page.getByText('Enter Your Email To Sign In')).toBeVisible(); // make sure app is in login page 
    await VinylPages.SignInPage.login(`${process.env.RO_USER}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}portfolio`);
    quantity = await VinylPages.PortfolioPage.get_issuer_quantity(process.env.ISSUE, process.env.ISSUER);
    await VinylPages.PortfolioPage.logout();
=======
test.describe("Vinyl Treasury Order", {tag: '@dev_sanity'}, async () => {
  let VinylPages: vinylPages;

  test.beforeEach(async ({ page }) => {
    VinylPages = new vinylPages(page);
    await page.goto(process.env.HOST as string); // open the app
    await expect(page.getByText('Enter Your Email To Sign In')).toBeVisible(); // make sure app is in login page 
    await VinylPages.SignInPage.login(process.env.TA_USER as string);
    const message = await page.getByText('We have sent an email with').textContent();
    await page.goto(await mailerMethods.login_mail(message.substring(40,71), process.env.TA_USER as string));
    await page.waitForURL(process.env.HOST as string + "verify/phone-number")
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(process.env.HOST as string + "dashboard");
>>>>>>> dc9b00b (2628 added validation after creation of TO)
  });
  
  test.afterEach(async ({page}) => {
    await page.close();
  });

<<<<<<< HEAD
  test('Create New Treasury Order and release of Treasury Order via API',{tag: '@dev_sanity'}, async ({ page, request }) => {
    const name = 'Test ' + randomInt(0,999);
    const description = 'Description Test ' + randomInt(0,999);
    var automatic_release, url, subject, to_id;
    await VinylPages.SignInPage.login(`${process.env.TA_USER}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await VinylPages.DashboardPage.go_to_treasury_order_page();
    await page.waitForURL(`${process.env.HOST}issuers/treasury-orders`);
    await VinylPages.TreasuryOrderPage.select_issuer(process.env.ISSUER);
    await VinylPages.TreasuryOrderPage.create_treasury_order.click();
    await page.waitForURL(`${process.env.HOST}issuers/treasury-orders/create?type=ISSUANCE`);
    automatic_release = await VinylPages.TreasuryOrderPage.enter_TO_details(name, process.env.ISSUE, 'IPO', description, 'Email');
    await VinylPages.TreasuryOrderPage.add_existing_automation_ro_recipient(process.env.RO_USER);
    await VinylPages.TreasuryOrderPage.validate_recipent_added('automation', process.env.RO_USER, process.env.RO_TIN);
    await VinylPages.TreasuryOrderPage.enter_quantity_and_price(1, 1);
    await VinylPages.TreasuryOrderPage.submit_TO();
    await VinylPages.TreasuryOrderPage.is_TO_submitted();
    await VinylPages.TreasuryOrderPage.validate_TO_document(name);
    await VinylPages.TreasuryOrderPage.validate_TO_details(name, description, 'IPO', process.env.ISSUER, process.env.ISSUE, 1, 'Email');
    url = await page.url();
    to_id = url.replace(`${process.env.HOST}issuers/treasury-orders/`, '').replace('#', '');
    const response = await request.post(`${process.env.LEDGER_SERVICE_API_BASE_URL}/treasury-orders/${to_id}/release`,{
      headers:{
        'X-API-KEY': `${process.env.API_TOKEN}`,
      }
    });
    expect(response.ok()).toBeTruthy();
    subject = process.env.ISSUER + " has issued " + process.env.ISSUE + " to AUTOMATION";
    await page.reload();
    await page.waitForURL(url);
    await mailerMethods.get_TO_mail(subject, `${process.env.RO_USER}`);
    await VinylPages.TreasuryOrderPage.is_TO_release_completed();
    await VinylPages.DashboardPage.logout();

    await VinylPages.SignInPage.login(`${process.env.RO_USER}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}portfolio`);
    await expect(await VinylPages.PortfolioPage.get_issuer_quantity(process.env.ISSUE, process.env.ISSUER)).toBe(quantity + 1);
    await VinylPages.PortfolioPage.logout();
  });

  test('Create New Treasury Order and automatic release of Treasury Order',{tag: '@regression'}, async ({ page, request }) => {
    const name = 'Test ' + randomInt(0,999);
    const description = 'Description Test ' + randomInt(0,999);
    var automatic_release, url, automatic_release_time, subject, wait_time, to_id;
    await VinylPages.SignInPage.login(`${process.env.TA_USER}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await VinylPages.DashboardPage.go_to_treasury_order_page();
    await page.waitForURL(`${process.env.HOST}issuers/treasury-orders`);
    await VinylPages.TreasuryOrderPage.select_issuer(process.env.ISSUER);
    await VinylPages.TreasuryOrderPage.create_treasury_order.click();
    await page.waitForURL(`${process.env.HOST}issuers/treasury-orders/create?type=ISSUANCE`);
    automatic_release = await VinylPages.TreasuryOrderPage.enter_TO_details(name, process.env.ISSUE, 'IPO', description, 'Email');
    await VinylPages.TreasuryOrderPage.add_existing_automation_ro_recipient(process.env.RO_USER);
    await VinylPages.TreasuryOrderPage.validate_recipent_added('automation', process.env.RO_USER, process.env.RO_TIN);
    await VinylPages.TreasuryOrderPage.enter_quantity_and_price(1, 1);
    await VinylPages.TreasuryOrderPage.submit_TO();
    await VinylPages.TreasuryOrderPage.is_TO_submitted();
    await VinylPages.TreasuryOrderPage.validate_TO_document(name);
    await VinylPages.TreasuryOrderPage.validate_TO_details(name, description, 'IPO', process.env.ISSUER, process.env.ISSUE, 1, 'Email');
    url = await page.url();
    to_id = url.replace(`${process.env.HOST}issuers/treasury-orders/`, '').replace('#', '');
    if(automatic_release){
      automatic_release_time = await VinylPages.TreasuryOrderPage.get_release_date_and_time();
      wait_time = timeHelper.get_wait_time(automatic_release_time);
      await page.waitForTimeout(wait_time); // wait for the automatic release of TO
    }
    else{//call release TO API on when the effective date is not current date
      const response = await request.post(`${process.env.LEDGER_SERVICE_API_BASE_URL}/treasury-orders/${to_id}/release`,{
        headers:{
          'X-API-KEY': `${process.env.API_TOKEN}`,
        }
      });
      expect(response.ok()).toBeTruthy();
    }
    subject = `${process.env.ISSUER}  has issued ${process.env.ISSUE} to AUTOMATION`;
    await page.reload();
    await page.waitForURL(url);
    await mailerMethods.get_TO_mail(subject, `${process.env.RO_USER}`);
    await VinylPages.TreasuryOrderPage.is_TO_release_completed();
    await VinylPages.DashboardPage.logout();

    await VinylPages.SignInPage.login(`${process.env.RO_USER}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}portfolio`);
    await expect(await VinylPages.PortfolioPage.get_issuer_quantity(process.env.ISSUE, process.env.ISSUER)).toBe(quantity + 1);
    await VinylPages.PortfolioPage.logout();
=======
  test('Create New Treasury Order and automatic release of Treasury Order', async ({ page }) => {
    const name = 'Test ' + randomInt(0,999);
    const description = 'Description Test ' + randomInt(0,999);
    await VinylPages.DashboardPage.go_to_treasury_order_page();
    await page.waitForURL(process.env.HOST as string + "issuers/treasury-orders");
    await VinylPages.TreasuryOrderPage.select_issuer(process.env.ISSUER);
    await VinylPages.TreasuryOrderPage.create_treasury_order.click();
    await page.waitForURL(process.env.HOST as string + "issuers/treasury-orders/create?type=ISSUANCE");
    await VinylPages.TreasuryOrderPage.enter_TO_details(name, process.env.ISSUE, 'IPO', description, 'Email');
    await VinylPages.TreasuryOrderPage.add_existing_automation_ro_recipient();
    await VinylPages.TreasuryOrderPage.validate_recipent_added('automation', process.env.RO_USER, process.env.RO_TIN);
    await VinylPages.TreasuryOrderPage.enter_quantity_and_price(10, 10);
    await VinylPages.TreasuryOrderPage.submit_TO();
    await VinylPages.TreasuryOrderPage.is_TO_submitted();
    await VinylPages.TreasuryOrderPage.validate_TO_details(name, description, 'IPO', process.env.ISSUER, process.env.ISSUE, 10, 'Email');
    await VinylPages.TreasuryOrderPage.validate_TO_document(name);
>>>>>>> dc9b00b (2628 added validation after creation of TO)
  });
});