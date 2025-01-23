# playwright-automation
This repository is used to run the automated test cases of Vinyl Equity, written in TypeScript using PlayWright framework

## Steps to run tests in local machine
1. Install Node.js in your machine
2. Install VS code in your machine
3. Install the VS Code extension ```Playwright Test for VSCode``` which is verified by Microsoft
4. Clone this repository 
5. Open the Repository in your VSCode
6. In the terminal run the following commands to install Playwright and browsers
```
npm install
npx playwright install
```
6. Open the terminal and run the following command to make sure if the tests are running in your machine
```
npx playwright test
```
7. Once test run is completed it should automatically open the html report in default browser

## Commands to run the tests using tags
1. To run the dev sanity tests
```
npx playwright test --headed --grep @dev_sanity
```
2. To run the regression tests
```
npx playwright test --headed --grep @regression
```
Note: For more information checkout the PlayWright's officical website [https://playwright.dev/docs/getting-started-vscode]