const assert = require('assert');
const {Builder, By, until} = require('selenium-webdriver');

describe('Website Fit By Beat', function () {
    let driver;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    it('Landing page Fit by Beat', async function() {
        await driver.get('https://fitbybeat.com/');

        let h3Element = await driver.findElement(By.xpath("//h3[contains(text(),'Calculate Your BMI')]"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", h3Element);

        await driver.wait(until.elementIsVisible(h3Element), 5000);

        let h3Text = await h3Element.getText();
        assert.equal(h3Text.toLowerCase(), 'calculate your bmi');

        let heightInput = await driver.findElement(By.name('height'));
        await heightInput.sendKeys('165');

        let weightInput = await driver.findElement(By.name('weight'));
        await weightInput.sendKeys('63');

        let ageInput = await driver.findElement(By.name('age'));
        await ageInput.sendKeys('23');

        let sexDropdown = await driver.findElement(By.xpath("//span[@role='combobox']"));
        await sexDropdown.click(); 

        let maleOption = await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Male')]")), 5000);
        await maleOption.click();

        let activityDropdown = await driver.findElement(By.xpath("//span[contains(text(), 'Select an activity factor:')]"));
        await activityDropdown.click(); 

        let littleExerciseOption = await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Little or no Exercise/ desk job')]")), 5000);
        await littleExerciseOption.click();

        let calculateButton = await driver.findElement(By.xpath("//span[@class='qodef-btn-text-inner' and text()='Calculate']"));
        await calculateButton.click();
    });

    after(() => driver && driver.quit());
});
