const puppeteer = require('puppeteer')

let browser
let page

beforeAll(async () => {
  browser = await puppeteer.launch({headless: false})
  page = await browser.newPage()
  await page.goto('http://localhost:3001/')
  page.setViewport({ width: 900, height: 900 })
})

test('test page title', async () => {
  const title = await page.$eval('[data-testid="title"]', el => el.innerHTML)

  expect(title).toBe('this is Home Page!')
})

test('test not Found', async () => {
  const navigationPromise = page.waitForNavigation()
  await page.click('[data-testid="not"]')
  await navigationPromise

  const title = await page.$eval('[data-testid="notfound"]', el => el.innerHTML)

  expect(title).toBe('Not Found')
})

afterAll(() => {
  browser.close()
})
