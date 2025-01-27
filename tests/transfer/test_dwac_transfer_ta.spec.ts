import { test, expect } from '@playwright/test';
import { vinylPages } from '../../PageObjects/vinylPages';
import { mailerMethods } from '../../support/mailer.methods';

test.describe("Vinyl Transfer DWAC Deposit", async () => {
  let VinylPages: vinylPages;
  let quantity: number;

  test.beforeEach(async ({ page }) => {
    VinylPages = new vinylPages(page);
    await page.goto(`${process.env.HOST}`); // open the app
    await expect(page.getByText('Enter Your Email To Sign In')).toBeVisible(); // make sure app is in login page 
    await VinylPages.SignInPage.login(`${process.env.RO_USER1}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}portfolio`);
    quantity = await VinylPages.PortfolioPage.get_issuer_quantity(process.env.ISSUE1, process.env.ISSUER1);
    await VinylPages.PortfolioPage.logout();
  });
  
  test.afterEach(async ({page}) => {
    await page.close();
  });

  test('Transfer DWAC Deposit - TA',{tag: ['@dev_sanity', '@regression']}, async ({ page }) => {
    await VinylPages.SignInPage.login(`${process.env.TA_USER1}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}dashboard`);
    await VinylPages.DashboardPage.go_to_transfers_page();
    await page.waitForURL(`${process.env.HOST}holders/transfers`);
    await VinylPages.TransfersPage.create_new_transfer(`${process.env.ISSUER1}`, `${process.env.ISSUE1}`, 'DWAC Deposit', 1);
    await VinylPages.TransfersPage.is_transfer_created();
    var url = await page.url()
    await VinylPages.TransfersPage.add_transferer(url, `${process.env.RO2_USERNAME}`, `${process.env.RO2_ACCOUNT_NUM}`, 1);
    await VinylPages.TransfersPage.validate_added_transferor(`${process.env.RO2_USERNAME}`, `${process.env.RO2_ACCOUNT_NUM}`, 1);
    await VinylPages.TransfersPage.submit_transferors.click();
    await page.waitForURL(`${url}?tab=details`);
    await VinylPages.TransfersPage.upload_documents_and_enter_medallion_details(url);
    await page.waitForURL(`${url}?tab=status`);
    await VinylPages.TransfersPage.approve_the_transfer(url);
    await expect(VinylPages.TransfersPage.transfer_status_complete).toBeVisible();
    await VinylPages.DashboardPage.logout();

    await mailerMethods.get_TO_mail(`Transfer of ${process.env.ISSUE1} from ${process.env.RO2_USERNAME} Completed`, `${process.env.RO_USER1}`);

    await VinylPages.SignInPage.login(`${process.env.RO_USER1}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}portfolio`);
    await expect(await VinylPages.PortfolioPage.get_issuer_quantity(process.env.ISSUE1, process.env.ISSUER1)).toBe(quantity - 1);
    await VinylPages.PortfolioPage.logout();
  });

});