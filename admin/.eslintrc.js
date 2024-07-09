module.exports = {
  env: {
    jest: true,
  },
  plugins: ["react", "react-hooks",],
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true,
  },
}