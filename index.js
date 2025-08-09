const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

(async function bookingAutomation() {
    const resultDir = path.join(__dirname, 'result');
    if (!fs.existsSync(resultDir)) {
        fs.mkdirSync(resultDir);
    }

    let outputLog = '';

    function log(msg) {
        console.log(msg);
        outputLog += msg + '\n';
    }

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments('--start-maximized')).build();

    async function dismissCookiesIfPresent() {
        try {
            let cookieBtn = await driver.findElements(By.id('onetrust-accept-btn-handler'));
            if (cookieBtn.length > 0) {
                await driver.wait(until.elementIsVisible(cookieBtn[0]), 2000);
                await cookieBtn[0].click();
                log('Cookie banner dismissed.');
                await driver.sleep(500);
            }
        } catch {}
    }

    async function selectDate(date) {
        let dateElements = await driver.findElements(By.css(`span[data-date="${date}"]`));
        if (dateElements.length === 0) {
            throw new Error(`Date ${date} not found in visible calendars.`);
        }
        await driver.wait(until.elementIsVisible(dateElements[0]), 5000);
        await dateElements[0].click();
        log(`Selected date: ${date}`);
    }

    try {
        log('step 1 - Opening Booking.com...');
        await driver.get('https://www.booking.com/');
        await dismissCookiesIfPresent();

        const searchInput = await driver.wait(until.elementLocated(By.name('ss')), 10000);
        await driver.wait(until.elementIsVisible(searchInput), 5000);
        await searchInput.clear();
        await searchInput.sendKeys('Porto', Key.TAB);
        log('step 2 - Entered destination: Porto');
        await dismissCookiesIfPresent();

        const datePickerToggle = await driver.wait(
            until.elementLocated(By.css('button[data-testid="searchbox-dates-container"]')),
            10000
        );
        await driver.wait(until.elementIsVisible(datePickerToggle), 5000);
        await datePickerToggle.click();
        log('step 3 - select the check-in and check-out date.');

        await selectDate('2025-09-01');
        await selectDate('2025-09-07');

         //click search after date selection
        const searchButton = await driver.wait(
             until.elementLocated(By.css('button[type="submit"]')),
             5000
         );
        await searchButton.click();
        console.log('step 4 - Search initiated.');


        const totalPropertiesElement = await driver.wait(
            until.elementLocated(By.css('h1.b87c397a13.cacb5ff522')),
            15000
        );
        const totalPropertiesText = await totalPropertiesElement.getText();
        const match = totalPropertiesText.match(/([\d,]+) properties found/);
        const totalProperties = match ? match[1] : 'N/A';
        log(`step 5 - Total properties found: ${totalProperties}`);
        
        
        const checkInElement = await driver.wait(
        until.elementLocated(By.css('[data-testid="date-display-field-start"]')),
        10000);

        const checkInText = await checkInElement.getText();

      if (checkInText !== 'Mon, Sep 1') {
      throw new Error(`Check-in date mismatch! Expected "Mon, Sep 1" but got "${checkInText}"`);
      } else {
      console.log('step 6 - Check-in date verified:', checkInText);
      }

      const checkOutElement = await driver.wait(
      until.elementLocated(By.css('[data-testid="date-display-field-end"]')),
      10000);
      const checkOutText = await checkOutElement.getText();

      if (checkOutText !== 'Sun, Sep 7') {
      throw new Error(`Check-out date mismatch! Expected "Sun, Sep 7" but got "${checkOutText}"`);
      } else {
      console.log('step 7 - Check-out date verified:', checkOutText);
      }
    // Wait for property to be loaded
    await driver.wait(until.elementsLocated(By.css('div[data-testid="property-card"]')), 10000);

    // Get all properties
    const properties = await driver.findElements(By.css('div[data-testid="property-card"]'));

    console.log(`step 8 - Found ${properties.length} properties on the first page:`);

    for (let i = 0; i < properties.length; i++) {
    try {
    const nameElement = await properties[i].findElement(By.css('div[data-testid="title"]'));
    const propertyName = await nameElement.getText();
    console.log(`${i + 1}. ${propertyName}`);
    } catch (error) {
    console.log(`${i + 1}. Property name not found`);
  }
}

    } catch (err) {
        log(`Test failed: ${err}`);
        let image = await driver.takeScreenshot();
        fs.writeFileSync(path.join(resultDir, 'error_screenshot.png'), image, 'base64');
        log(`Screenshot saved to ${path.join('result', 'error_screenshot.png')}`);
    } finally {
        fs.writeFileSync(path.join(resultDir, 'output.txt'), outputLog);
        await driver.quit();
    }
})();
