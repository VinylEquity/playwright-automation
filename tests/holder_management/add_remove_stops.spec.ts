import { test, expect } from '@playwright/test';
import { vinylPages } from '../../PageObjects/vinylPages'

test.describe("Vinyl Holder Management, Add and remove holder and position stop to a RO tests", {tag: ['@dev_sanity', '@regression']}, async () => {
  let VinylPages: vinylPages;

  test.beforeEach(async ({ page }) => {
    VinylPages = new vinylPages(page);
    await page.goto(`${process.env.HOST}`); // open the app
    await expect(page.getByText('Enter Your Email To Sign In')).toBeVisible() // make sure app is in login page 
  });
  
  test.afterEach(async ({page}) => {
    await page.close();
  });

  test('Add and remove holder and position stop to a RO via TA', async ({ page }) => {
    await VinylPages.SignInPage.login(`${process.env.TA_USER1}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}dashboard`);
    await VinylPages.DashboardPage.go_to_holder_management();
    await expect(VinylPages.HolderManagementPage.holder_details).not.toBeVisible();
    await VinylPages.HolderManagementPage.search_for_holder(process.env.RO_USER1); 
    await VinylPages.HolderManagementPage.validate_holder_details_TA(process.env.RO2_USERNAME, process.env.RO_USER1, process.env.RO2_TIN, 'Individual', process.env.RO2_ADDRESS);
    //  Test Holder Stop
    await VinylPages.HolderManagementPage.add_holder_stop();
    await VinylPages.HolderManagementPage.validate_holder_stop_added();
    await VinylPages.HolderManagementPage.remove_stop();
    await VinylPages.HolderManagementPage.validate_holder_stop_removed();
    // Test Position Stop
    await VinylPages.HolderManagementPage.add_position_stop();
    await VinylPages.HolderManagementPage.validate_position_stop_added();
    await VinylPages.HolderManagementPage.remove_stop();
    await VinylPages.HolderManagementPage.validate_position_stop_removed();
    await VinylPages.DashboardPage.logout();
  });
});