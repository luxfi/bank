module.exports = {
  launch: {
    dumpio: true,
    headless: true, //process.env.HEADLESS !== 'false',
    product: 'chrome',
  },
  browserContext: 'default',
  setupFilesAfterEnv: ["expect-puppeteer"],
}