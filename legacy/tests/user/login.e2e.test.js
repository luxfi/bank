
var username = "phillip@wevive.com"
var password = "Engineroom@1234"


var appUrl = "http://localhost:3000/"
jest.setTimeout(15000)
describe("App.js", () => {
    it("user opens an app and logs in as an user", async () => {
      await page.goto(appUrl);
      await page.waitForSelector("#root");
      await expect(page.title()).resolves.toMatch('CDAX Forex')
      
      //Navigate to log in screen
      await page.click(`a[href='/login']`);
      await expect(page.url()).toMatch(`${appUrl}login`)
      await expect(page).toFillForm('form', {
        username: 'username',
        password: 'password',
      })
      await expect(page).toMatch('Please enter the email address.')
      await expect(page).toFillForm('form', {
        username: 'michail@ourengineroom.com',
        password: 'password',
      })
      await expect(page).toClick('button')
      await page.waitForNetworkIdle()
      await expect(page).toMatch('Login failed, please check your email and password.')

      await expect(page).toFillForm('form', {
        username,
        password,
      })
      await expect(page).toClick('button')
      await page.waitForNetworkIdle()
      await expect(page.url()).toMatch(`${appUrl}dashboard/balances`)

      await page.click(`a[href='/dashboard/profile']`);
      //await page.waitForTimeout(200)
      await page.waitForNetworkIdle()
      await expect(page).toMatch('Phillip Snelling')
    });
});