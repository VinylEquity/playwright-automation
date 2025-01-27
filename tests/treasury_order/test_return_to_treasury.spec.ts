import { test, expect } from '@playwright/test';
import { vinylPages } from '../../PageObjects/vinylPages'
import { randomInt } from 'crypto';
import { timeHelper } from '../../support/time.helper';
import { mailerMethods } from '../../support/mailer.methods';

test.describe("Vinyl Return to Treasury", async () => {
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
  });

  test.afterEach(async ({page}) => {
    await page.close();
  });

  test('Return to Treasury release RTT via API', {tag: '@dev_sanity'}, async ({ page, request }) => {
    const name = 'Test ' + randomInt(0,999);
    var url, rtt_id;
    await VinylPages.SignInPage.login(`${process.env.TA_USER}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await VinylPages.DashboardPage.go_to_treasury_order_page();
    await page.waitForURL(`${process.env.HOST}issuers/treasury-orders`);
    await VinylPages.TreasuryOrderPage.select_issuer(process.env.ISSUER);
    await VinylPages.TreasuryOrderPage.create_treasury_order.click();
    await page.waitForURL(`${process.env.HOST}issuers/treasury-orders/create?type=ISSUANCE`);
    await VinylPages.ReturnToTreasuryPage.create_return_to_treasury_order(name, process.env.ISSUE, 'Correction to Registration');
    await VinylPages.ReturnToTreasuryPage.add_seacurites(`${process.env.RO_USER}`);
    await VinylPages.ReturnToTreasuryPage.verify_securities_table('AUTOMATION',`${process.env.RO_USER}` , `${process.env.RO_ACCOUNT_NUM}`, '1');
    await VinylPages.ReturnToTreasuryPage.enter_quntity_to_cancel('1');
    await VinylPages.ReturnToTreasuryPage.submit_the_order();
    await VinylPages.ReturnToTreasuryPage.validate_RTT_submission();
    url = await page.url();
    rtt_id = url.replace(`${process.env.HOST}issuers/treasury-orders/`, '');
    await VinylPages.ReturnToTreasuryPage.upload_ro_documents(url);
    await VinylPages.ReturnToTreasuryPage.validate_ro_documents_uploaded(url);
    const response = await request.post(`${process.env.LEDGER_SERVICE_API_BASE_URL}/treasury-orders/cancelation/${rtt_id}/complete`,{
      headers:{
        'X-API-KEY': `${process.env.API_TOKEN}`,
      }
    });
    expect(response.ok()).toBeTruthy();
    await VinylPages.ReturnToTreasuryPage.validate_RTT_completion(url);
    await VinylPages.DashboardPage.logout();
    await mailerMethods.get_TO_mail(`${process.env.ISSUER} has canceled COMMON held by AUTOMATION`, `${process.env.RO_USER}`);

    await VinylPages.SignInPage.login(`${process.env.RO_USER}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}portfolio`);
    await expect(await VinylPages.PortfolioPage.get_issuer_quantity(process.env.ISSUE, process.env.ISSUER)).toBe(quantity - 1);
    await VinylPages.PortfolioPage.logout();
  });

  test('Return to Treasury automatic release of RTT', {tag: '@regression'}, async ({ page, request }) => {
    const name = 'Test ' + randomInt(0,999);
    var url, rtt_id;
    await VinylPages.SignInPage.login(`${process.env.TA_USER}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await VinylPages.DashboardPage.go_to_treasury_order_page();
    await page.waitForURL(`${process.env.HOST}issuers/treasury-orders`);
    await VinylPages.TreasuryOrderPage.select_issuer(process.env.ISSUER);
    await VinylPages.TreasuryOrderPage.create_treasury_order.click();
    await page.waitForURL(`${process.env.HOST}issuers/treasury-orders/create?type=ISSUANCE`);
    await VinylPages.ReturnToTreasuryPage.create_return_to_treasury_order(name, process.env.ISSUE, 'Correction to Registration');
    await VinylPages.ReturnToTreasuryPage.add_seacurites(`${process.env.RO_USER}`);
    await VinylPages.ReturnToTreasuryPage.verify_securities_table('AUTOMATION',`${process.env.RO_USER}` , `${process.env.RO_ACCOUNT_NUM}`, '1');
    await VinylPages.ReturnToTreasuryPage.enter_quntity_to_cancel('1');
    await VinylPages.ReturnToTreasuryPage.submit_the_order();
    await VinylPages.ReturnToTreasuryPage.validate_RTT_submission();
    url = await page.url();
    rtt_id = url.replace(`${process.env.HOST}issuers/treasury-orders/`, '');
    await VinylPages.ReturnToTreasuryPage.upload_ro_documents(url);
    await VinylPages.ReturnToTreasuryPage.validate_ro_documents_uploaded(url);
    await page.waitForTimeout(300000) // wait for 5 mins for auto release of RTT
    await VinylPages.ReturnToTreasuryPage.validate_RTT_completion(url);
    await VinylPages.DashboardPage.logout();
    await mailerMethods.get_TO_mail(`${process.env.ISSUER} has canceled COMMON held by AUTOMATION`, `${process.env.RO_USER}`);

    await VinylPages.SignInPage.login(`${process.env.RO_USER}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}portfolio`);
    await expect(await VinylPages.PortfolioPage.get_issuer_quantity(process.env.ISSUE, process.env.ISSUER)).toBe(quantity - 1);
    await VinylPages.PortfolioPage.logout();
  });
});
