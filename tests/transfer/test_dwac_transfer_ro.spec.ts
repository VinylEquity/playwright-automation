import { test, expect } from '@playwright/test';
import { vinylPages } from '../../PageObjects/vinylPages';
import { randomInt } from 'crypto';

test.describe("Vinyl Transfer DWAC Deposit via RO", {tag: ['@smokes']}, async () => {
  let VinylPages: vinylPages;
  let current_quantity: number;

  test.beforeEach(async ({ page, request }) => {
    VinylPages = new vinylPages(page);

    await page.goto(`${process.env.HOST}`);
    await expect(page.getByText('Enter Your Email To Sign In')).toBeVisible(); // make sure app is in login page 

    //Code to create TOs with and without 1933 act 
    await VinylPages.SignInPage.login(`${process.env.TA_USER1}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}dashboard`);
    await VinylPages.DashboardPage.validate_username(`${process.env.TA_USER1_NAME}`);
    await VinylPages.DashboardPage.go_to_treasury_order_page();
    await page.waitForURL(`${process.env.HOST}issuers/treasury-orders`);
    await VinylPages.TreasuryOrderPage.create_and_release_TO(`Test ${randomInt(0,999)}`, process.env.ISSUE1, process.env.ISSUER1, 'IPO', `Description Test ${randomInt(0,999)}`, 'Email', process.env.RO_TRANS_NAF_USER_NAME, process.env.RO_TRANS_NAF_USER, process.env.RO_TRANS_NAF_USER_TIN, 1, request, false);
    await VinylPages.DashboardPage.go_to_treasury_order_page();
    await page.waitForURL(`${process.env.HOST}issuers/treasury-orders`);
    await VinylPages.TreasuryOrderPage.create_and_release_TO(`Test ${randomInt(0,999)}`, process.env.ISSUE1, process.env.ISSUER1, 'IPO', `Description Test ${randomInt(0,999)}`, 'Email', process.env.RO_TRANS_NAF_USER_NAME, process.env.RO_TRANS_NAF_USER, process.env.RO_TRANS_NAF_USER_TIN, 1, request, true);
    await VinylPages.DashboardPage.logout();
  });
  
  test.afterEach(async ({page}) => {
    await page.close();
  });

  test('Transfer DWAC Deposit - non affiliated RO',{tag: ['@dev_sanity', '@regression']}, async ({page}) => {
    await VinylPages.SignInPage.login(`${process.env.RO_TRANS_NAF_USER}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}portfolio`);
    await VinylPages.DashboardPage.validate_username(`${process.env.RO_TRANS_NAF_USER_NAME}`);
    current_quantity = await VinylPages.PortfolioPage.get_issuer_quantity(process.env.ISSUE1, process.env.ISSUER1);
    await VinylPages.PortfolioPage.go_to_transfers_page();
    // validation before creating transfer for enable/disable of taxlots based on date
    await VinylPages.TransfersPageRO.validate_taxlots_based_on_date(`${process.env.RO_TRANS_NAF_USER_NAME}`, 'Move to Broker (Deposit)', `${process.env.ISSUE1} (${process.env.ISSUER1})`);
    await VinylPages.DashboardPage.logout();
    
    
    

    // transfer with legend
    // validate quantity after transfer
    // transfer without legend
    // validate quantity after transfer validate there is no data 
  });

  
});