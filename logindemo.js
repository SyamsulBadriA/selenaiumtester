const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

async function readUserFixture() {
  const filePath = path.resolve(__dirname, 'user.json');
  const data = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function performSignUp(driver, username, password) {
  try {
    await driver.get('https://www.demoblaze.com/');
    await driver.findElement(By.id('signin2')).click();
    await driver.findElement(By.id('sign-username')).clear();
    await driver.findElement(By.id('sign-password')).clear();
    await driver.findElement(By.id('sign-username')).sendKeys(username);
    await driver.findElement(By.id('sign-password')).sendKeys(password);
    await driver.findElement(By.xpath("//button[contains(text(),'Sign up')]")).click();
    
    await driver.wait(until.stalenessOf(driver.findElement(By.id('sign-username'))), 10000);
    
    const loginButton = await driver.findElement(By.id('login2'));
    await driver.wait(until.elementIsVisible(loginButton), 10000);
    return 'success';
  } catch (error) {
    console.error('Error during sign-up attempt:', error);
    return 'failed';
  }
}

async function performLogin(driver, username, password) {
  try {
    await driver.get('https://www.demoblaze.com/');
    await driver.findElement(By.id('login2')).click();
    await driver.findElement(By.id('loginusername')).clear();
    await driver.findElement(By.id('loginpassword')).clear();
    await driver.findElement(By.id('loginusername')).sendKeys(username);
    await driver.findElement(By.id('loginpassword')).sendKeys(password);
    await driver.findElement(By.xpath("//button[contains(text(),'Log in')]")).click();
    
    try {
      await driver.wait(until.elementLocated(By.css('a.list-group-item')), 10000);
      return 'success'; 
    } catch (error) {
      return 'failed'; 
    }
  } catch (error) {
    console.error('Error during login attempt:', error);
    return 'failed';
  }
}

function printResult(username, password, status, expected) {
  const resultColor = status === 'success' ? '\x1b[32m' : '\x1b[31m'; 
  const resetColor = '\x1b[0m';
  console.log(`Login with username "${username}" and password "${password}" resulted in: ${resultColor}${status}${resetColor} (Expected: ${expected})`);
}

(async function demoBlazeTests() {
  let driver;
  
  try {
    driver = await new Builder().forBrowser('chrome').build();
    const user = await readUserFixture();
    const validUsername = user.username;
    const validPassword = user.password;

    const signUpStatus = await performSignUp(driver, validUsername, validPassword);
    printResult(validUsername, validPassword, signUpStatus, 'success');

    const testCases = [
      { username: validUsername, password: validPassword, expected: 'success' },
      { username: 'invalidUsername', password: validPassword, expected: 'failed' },
      { username: validUsername, password: 'invalidPassword', expected: 'failed' },
      { username: '', password: validPassword, expected: 'failed' },
      { username: validUsername, password: '', expected: 'failed' }
    ];

    for (const testCase of testCases) {
      const { username, password, expected } = testCase;
      const status = await performLogin(driver, username, password);
      printResult(username, password, status, expected);
    }

  } finally {
    if (driver) {
      await driver.quit();
    }
  }
})();
