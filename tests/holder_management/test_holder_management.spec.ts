import { test, expect } from '@playwright/test';
import { vinylPages } from '../../PageObjects/vinylPages'
import { fileMethods } from '../../support/fileMethods';

test.describe("Vinyl Holder Management Tests", {tag: ['@dev_sanity', '@regression']}, async () => {
  let VinylPages: vinylPages;
  let FileMethods: fileMethods;

  test.beforeEach(async ({ page }) => {
    VinylPages = new vinylPages(page);
    FileMethods = new fileMethods(page);
    await page.goto(`${process.env.HOST}`); // open the app
    await expect(page.getByText('Enter Your Email To Sign In')).toBeVisible() // make sure app is in login page 
  });
  
  test.afterEach(async ({page}) => {
    await page.close();
  });

  test('Search for RO user via TA', { tag: '@search' }, async ({ page }) => {
    var search_details = [process.env.RO_USER1, process.env.RO2_USERNAME, process.env.RO2_TIN, process.env.RO2_ACCOUNT_NUM];
    await VinylPages.SignInPage.login(`${process.env.TA_USER1}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}dashboard`);
    await VinylPages.DashboardPage.go_to_holder_management();
    for(var i = 0; i < 4; i++){
      await expect(VinylPages.HolderManagementPage.holder_details).not.toBeVisible();
      await VinylPages.HolderManagementPage.search_for_holder(search_details[i]); 
      await VinylPages.HolderManagementPage.validate_holder_details_TA(process.env.RO2_USERNAME, process.env.RO_USER1, process.env.RO2_TIN, 'Individual', process.env.RO2_ADDRESS);
      await page.reload();
    }
    await VinylPages.DashboardPage.logout();
  });
  
  test('Search for RO user via IA', { tag: '@search' }, async ({ page }) => {
    var search_details = [process.env.RO_USER1, process.env.RO2_USERNAME, process.env.RO2_ACCOUNT_NUM];
    await VinylPages.SignInPage.login(`${process.env.IA_USER1}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}dashboard`);
    await VinylPages.DashboardPage.ia_holder.click();
    for(var i = 0; i < 3; i++){
      await expect(VinylPages.HolderManagementPage.holder_details).not.toBeVisible();
      await VinylPages.HolderManagementPage.search_for_holder(search_details[i]); 
      await VinylPages.HolderManagementPage.validate_holder_details_IA(process.env.RO2_USERNAME, process.env.RO_USER1, 'Individual', process.env.RO2_ADDRESS);
      await page.reload();
    }
    await VinylPages.DashboardPage.logout();
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
    // await VinylPages.DashboardPage.logout();
  });

  test('Generate DRS statement via TA', async ({page}) => {
    await VinylPages.SignInPage.login(`${process.env.TA_USER1}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}dashboard`);
    await VinylPages.DashboardPage.go_to_holder_management();
    await expect(VinylPages.HolderManagementPage.holder_details).not.toBeVisible();
    await VinylPages.HolderManagementPage.search_for_holder(process.env.DRS_RO_USER); 
    await VinylPages.HolderManagementPage.validate_holder_details_TA(process.env.DRS_RO_USER_NAME, process.env.DRS_RO_USER, process.env.DRS_RO_TIN, 'Individual', process.env.DRS_RO_ADDRESS);
    var url = await VinylPages.HolderManagementPage.generate_drs_statement_for_RO(process.env.DRS_RO_USER_NAME, `${process.env.ISSUER1} ${process.env.ISSUE1}`, process.env.DRS_FROM_DATE, process.env.DRS_TO_DATE);
    await FileMethods.download_pdf_file(url);
    var response_text = await FileMethods.parse_pdf();
    var expected_text  = await FileMethods.generate_expected_drs_statement_text();
    await expect(response_text).toEqual(expected_text);
    await FileMethods.delete_downloaded_file();
    await page.keyboard.press('Escape');
    await VinylPages.HolderManagementPage.cancel_drs_statement.click();
    await VinylPages.DashboardPage.logout();
  });

  test('Generate DRS statement via IA', async ({page}) => {
    await VinylPages.SignInPage.login(`${process.env.IA_USER1}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}dashboard`);
    await VinylPages.DashboardPage.ia_holder.click();
    await expect(VinylPages.HolderManagementPage.holder_details).not.toBeVisible();
    await VinylPages.HolderManagementPage.search_for_holder(process.env.DRS_RO_USER); 
    await VinylPages.HolderManagementPage.validate_holder_details_IA(process.env.DRS_RO_USER_NAME, process.env.DRS_RO_USER, 'Individual', process.env.DRS_RO_ADDRESS);
    var url = await VinylPages.HolderManagementPage.generate_drs_statement_for_RO(process.env.DRS_RO_USER_NAME, `${process.env.ISSUER1} ${process.env.ISSUE1}`, process.env.DRS_FROM_DATE, process.env.DRS_TO_DATE);
    await FileMethods.download_pdf_file(url);
    var response_text = await FileMethods.parse_pdf();
    var expected_text  = await FileMethods.generate_expected_drs_statement_text();
    await expect(response_text).toEqual(expected_text);
    await FileMethods.delete_downloaded_file();
    await page.keyboard.press('Escape');
    await VinylPages.HolderManagementPage.cancel_drs_statement.click();
    await VinylPages.DashboardPage.logout();
  });
});