

var appUrl = "http://localhost:3000/"
var testName = 'e2etest_' + (+new Date());
var username = `michail+${testName}@ourengineroom.com`
var password = "Password!123"
var HDViewport = {
  width: 1920,
  height: 1080
};
var iPhone8Viewport = {
  width: 375,
  height: 667
};
var iPhone12Viewport = {
  width: 390,
  height: 844
};
var viewport = HDViewport;
jest.setTimeout(60000)
describe("User Platform Registration flow", () => {
    it("User opens a website", async () => {
      await page.setViewport(viewport)
      await page.goto(appUrl);
      await page.waitForSelector("#root");
      await expect(page.title()).resolves.toMatch('CDAX Forex')
      await page.screenshot({
        path: './screenshots/index.png'
      });
    });
    it("User goes to registration page using Get Started button", async () => {
      const button = await page.$x('//button[.="Get started"]');
      await expect(button.length).toEqual(1);
      await button[0].click();
      await expect(page).toMatch("Register for your CDAX Forex Account");
      await page.screenshot({
        path: './screenshots/registration_0.png'
      });
    });
    it("User fills the form with valid details", async () => {
      
      await expect(page).toFillForm('form', {
        firstname: 'Michail',
        lastname: 'Strokin',
        email: username,
      })
      const checkbox = await page.$('input[type="checkbox"]');
      await checkbox.click();
      await page.screenshot({
        path: './screenshots/registration_1.png'
      });
    });
    it("User submits the form with valid details and goes to account type selection", async () => {
      const buttons = await page.$x('//button[.="Next"]');
      await buttons[0].click();
      /*await Promise.all(buttons.map(async (next_button) => {
        if (await next_button.isIntersectingViewport()) {
          console.error('visible, clicking..');
          return await next_button.click();
        } else {
          console.error('not visible');
        }
      }));*/
      //FIXME -- check if this text is in the viewport
      await expect(page).toMatch("What type of account would you like to open?");
      await page.screenshot({
        path: './screenshots/registration_2.png'
      });
    });
    it("User selected the Individual account type, goes to country selection screen, and selects the country", async () => {
      const buttons = await page.$x('//button[.="Next"]');
      await buttons[1].click();
      await expect(page).toSelect('select[name="country"]','TR');
      await page.screenshot({
        path: './screenshots/registration_3.png'
      });
    });
    it("User selected the country and enters his phone number", async () => {
      const buttons = await page.$x('//button[.="Next"]');
      await buttons[2].click();
      await expect(page).toFill('input[name="mobileNumber"]', '+905077536744')
      await page.screenshot({
        path: './screenshots/registration_4.png'
      });
    });
    it("User waits for the phone verification code", async () => {
      const buttons = await page.$x('//button[.="Get Code"]');
      await buttons[0].click();
      await page.waitForNetworkIdle();
      await page.screenshot({
        path: './screenshots/registration_5.png'
      });
    });
    it("User enters the phone verification code", async () => {
      await expect(page).toFill('input[name="code1"]', '1');
      await expect(page).toFill('input[name="code2"]', '2');
      await expect(page).toFill('input[name="code3"]', '3');
      await expect(page).toFill('input[name="code4"]', '4');
      await expect(page).toFill('input[name="code5"]', '5');
      await expect(page).toFill('input[name="code6"]', '6');
      const buttons = await page.$x('//button[.="Verify"]');
      await buttons[0].click();
      await page.waitForNetworkIdle();
      await page.screenshot({
        path: './screenshots/registration_6.png'
      });
    });
    it("User enters the password and submits the form", async () => {
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toFill('input[name="confirmPassword"]', password);
      const buttons = await page.$x('//button[.="Next"]');
      await buttons[3].click();
      await page.waitForNetworkIdle();
      await page.screenshot({
        path: './screenshots/registration_7.png'
      });
    });
    /*it("User opens a website and geoes to login page", async () => {
      await page.setViewport({
        width: 1920,
        height: 1080
      })
      await page.goto(appUrl);
      await page.waitForSelector("#root");
      await expect(page.title()).resolves.toMatch('CDAX Forex')
      await page.click(`a[href='/login']`);
      await expect(page.url()).toMatch(`${appUrl}login`)
    });
    it("User fills the details and gets to metadata page", async () => {
      await expect(page).toFillForm('form', {
        username,
        password,
      })
      await expect(page).toClick('button')
      await page.waitForNetworkIdle();
      await expect(page.url()).toMatch(`${appUrl}registration/metadata`)
      await page.screenshot({
        path: './screenshots/metadata_0.png'
      });
    });*/
    it("User fills the personal details and goes to next page", async () => {
      await page.screenshot({
        path: './screenshots/metadata_0.png'
      });
      await expect(page).toFill('input[name="birth"]', "21.10.1987");
      await expect(page).toFill('input[name="place"]', "LITHUANIA");
      const buttons = await page.$x('//button[.="Next"]');
      await buttons[0].click();
      await page.waitForNetworkIdle();
      await page.screenshot({
        path: './screenshots/metadata_1.png'
      });
    });
    it("User fills the address details and goes to next page", async () => {
      await expect(page).toFill('input[name="line11"]', "1937 Sokak 4A - 34");
      await expect(page).toFill('input[name="line12"]', "Ahmet Nuri Çimen sitesi");
      await expect(page).toFill('input[name="city1"]', "Antalya");
      await expect(page).toFill('input[name="codePost1"]', "07160");
      await expect(page).toSelect('select[name="country1"]','TR');
      await expect(page).toFill('input[name="state1"]','Muratpaša');
      const buttons = await page.$x('//button[.="Next"]');
      await buttons[1].click();
      await page.waitForNetworkIdle();
      await page.screenshot({
        path: './screenshots/metadata_2.png'
      });
    });
    it("User fills the employment and identification details and goes to next page", async () => {
      await expect(page).toFill('input[name="identifyNumber"]', "12345678");
      await expect(page).toFill('input[name="occupation"]', "Developer");
      await expect(page).toFill('input[name="employerName"]', "VIVID UNITY LTD");
      await expect(page).toSelect('select[name="nationality"]','LT');
      await expect(page).toFill('input[name="employerAddress1"]', "2 River Walk, Braddan, Douglas, IM4 4TJ, Isle of Man");
      const buttons = await page.$x('//button[.="Next"]');
      await buttons[2].click();
      await page.waitForNetworkIdle();
      await page.screenshot({
        path: './screenshots/metadata_3.png'
      });
    });
    it("User fills the bank details and goes to next page", async () => {
      await expect(page).toFill('input[name="bankName"]', "VAKIF");
      await expect(page).toFill('input[name="branch"]', "LARA SUBESI");
      await expect(page).toFill('input[name="accountHolderName"]', "MICHAIL STROKIN");
      await expect(page).toSelect('select[name="bankCountry"]','TR');
      await expect(page).toSelect('select[name="currency"]','EUR');
      await expect(page).toFill('input[name="IBAN"]', "TR410001500158048021223597");
      await expect(page).toFill('input[name="bicSwift"]', "TVBATR2A");
      const buttons = await page.$x('//button[.="Next"]');
      await buttons[3].click();
      await page.waitForNetworkIdle();
      await page.screenshot({
        path: './screenshots/metadata_4.png'
      });
    });
    it("User fills the expected details and goes to next page", async () => {
      const volume = await page.$('input[id="expectedVolumeOfTransactions26-50"]');
      await volume.click();
      const turnover = await await page.$('input[id="expectedValueOfTurnoverSelect£50k - £100k"]');
      await turnover.click();
      const buttons = await page.$x('//button[.="Next"]');
      await buttons[4].click();
      await page.waitForNetworkIdle();
      await page.screenshot({
        path: './screenshots/metadata_5.png'
      });
    });
});