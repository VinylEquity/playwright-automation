import { test, expect } from '@playwright/test';
import { vinylPages } from '../../PageObjects/vinylPages'

test.describe("Vinyl Holder Management Tests", {tag: ['@search']}, async () => {
  let VinylPages: vinylPages;

  test.beforeEach(async ({ page }) => {
    VinylPages = new vinylPages(page);
    await page.goto(`${process.env.HOST}`); // open the app
    await expect(page.getByText('Enter Your Email To Sign In')).toBeVisible() // make sure app is in login page 
  });
  
  test.afterEach(async ({page}) => {
    // await page.close();
  });

  test('Search for RO user via TA', async ({ page }) => {
    var search_details = [process.env.RO_USER1, process.env.RO2_USERNAME, process.env.RO2_TIN, process.env.RO2_ACCOUNT_NUM];
    await VinylPages.SignInPage.login(`${process.env.TA_USER1}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}dashboard`);
    await VinylPages.DashboardPage.go_to_holder_management();
    for(var i = 0; i < 4; i++){
      await expect(VinylPages.HolderManagementPage.holder_details).not.toBeVisible();
      await VinylPages.HolderManagementPage.search_for_holder(search_details[i]); 
      await VinylPages.HolderManagementPage.validate_holder_details(process.env.RO2_USERNAME, process.env.RO_USER1, process.env.RO2_TIN, 'Individual');
      await page.reload();
    }
    await VinylPages.DashboardPage.logout();
  });
  
  test('Search for RO user via IA', async ({ page }) => {
    var search_details = [process.env.RO_USER1, process.env.RO2_USERNAME, process.env.RO2_ACCOUNT_NUM];
    await VinylPages.SignInPage.login(`${process.env.IA_USER1}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}dashboard`);
    await VinylPages.DashboardPage.ia_holder.click();
    for(var i = 0; i < 3; i++){
      await expect(VinylPages.HolderManagementPage.holder_details).not.toBeVisible();
      await VinylPages.HolderManagementPage.search_for_holder(search_details[i]); 
      await VinylPages.HolderManagementPage.validate_holder_details_IA(process.env.RO2_USERNAME, process.env.RO_USER1, 'Individual');
      await page.reload();
    }
    await VinylPages.DashboardPage.logout();
  });

  test('Generate DRS statement via TA', async ({page}) => {
    await VinylPages.SignInPage.login(`${process.env.TA_USER1}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}dashboard`);
    await VinylPages.DashboardPage.go_to_holder_management();
    await expect(VinylPages.HolderManagementPage.holder_details).not.toBeVisible();
    await VinylPages.HolderManagementPage.search_for_holder(process.env.RO_USER1); 
    await VinylPages.HolderManagementPage.validate_holder_details(process.env.RO2_USERNAME, process.env.RO_USER1, process.env.RO2_TIN, 'Individual');
    await VinylPages.HolderManagementPage.generate_drs_statement_for_RO(process.env.RO2_USERNAME, `${process.env.ISSUER1} ${process.env.ISSUE1}`);
  });
});