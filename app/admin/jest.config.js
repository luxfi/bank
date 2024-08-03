module.exports = {
    preset: "jest-puppeteer",
    testRegex: "./*\\e2e\\.test\\.js$",
    setupFilesAfterEnv: ["expect-puppeteer"]
};