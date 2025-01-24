import { test, expect } from '@playwright/test';
import { vinylPages } from '../../PageObjects/vinylPages'

test.describe("Vinyl Login Page", {tag: '@smoke'}, async () => {
  let VinylPages: vinylPages;

  test.beforeEach(async ({ page }) => {
    VinylPages = new vinylPages(page);
    await page.goto(`${process.env.HOST}`); // open the app
    await expect(page.getByText('Enter Your Email To Sign In')).toBeVisible() // make sure app is in login page 
  });
  
  test.afterEach(async ({page}) => {
    await page.close();
  });

  test('Get error on sign in without email', async ({ page }) => {
    await VinylPages.SignInPage.click_signin()
    await VinylPages.SignInPage.validate_error('Email is required');
  });
  
  test('Get error on sign in with invalid email', async ({ page }) => {
    await VinylPages.SignInPage.sign_in('invalid@test.com');
    await VinylPages.SignInPage.validate_alert('ACCESS DENIED');
  });
  
  test('Get error on sign in with incorrect email format', async ({ page }) => {
    await VinylPages.SignInPage.enter_email('abc');
    await VinylPages.SignInPage.validate_signin_disabled();
  });
  
  test('Successful Transfer Agent login', async ({page}) =>{
    await VinylPages.SignInPage.login(`${process.env.TA_USER1}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}dashboard`);
    await VinylPages.DashboardPage.validate_username("Automation TA");
    await VinylPages.DashboardPage.logout();
  });
  
  test('Successful Issuer Admin login', async ({page}) =>{
    await VinylPages.SignInPage.login(`${process.env.IA_USER}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}dashboard`);
    await VinylPages.DashboardPage.validate_username("AUTOMATION QA");
    await VinylPages.DashboardPage.logout();
  });
  
  test('Successful Registered Owner Login', async ({page}) =>{
    await VinylPages.SignInPage.login(`${process.env.RO_USER}`);
    await VinylPages.PhoneVerificationPage.enter_valid_otp();
    await page.waitForURL(`${process.env.HOST}portfolio`);
    await VinylPages.PortfolioPage.validate_username("AUTOMATION");
    await VinylPages.PortfolioPage.logout();
  });
  
  test('Get error on entering invalid OTP', async ({page}) =>{
    await VinylPages.SignInPage.login(`${process.env.RO_USER}`);
    await VinylPages.PhoneVerificationPage.enter_invalid_otp();
    await VinylPages.PhoneVerificationPage.validate_otp_alert('Invalid verification code. Please enter a valid code.');
  });
});