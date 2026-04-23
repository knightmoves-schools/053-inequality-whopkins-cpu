const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the index.js file', () => {
  it('should create a function named guessNumber that takes a guess and returns the string not it if the number is not equivalent to 25', async function() {
      const result = await page.evaluate(() => {
        return guessNumber(24);
      });

      expect(result).toBe('not it');
  });

  it('should not return not it when the number 25 is passed in as an argument to guessNumber', async function() {
      const result = await page.evaluate(() => {
        return guessNumber(25);
      });

      expect(result).not.toBe('not it');
  });

  it('should not return not it when the string 25 is passed in as an argument to guessNumber', async function() {
      const result = await page.evaluate(() => {
        return guessNumber('25');
      });

      expect(result).not.toBe('not it');
  });

  it('should create a function named strictGuessNumber that takes a guess and returns not it only if the guess is a number that is strictly not equal to 25', async function() {
      const result = await page.evaluate(() => {
        return strictGuessNumber(24);
      });

      expect(result).toBe('not it');
  });

  it('should not return not it when the number 25 is passed in as an argument to guessNumber', async function() {
      const result = await page.evaluate(() => {
        return strictGuessNumber(25);
      });

      expect(result).not.toBe('not it');
  });

  it('should return not it when the string 25 is passed in as an argument to strictGuessNumber', async function() {
      const result = await page.evaluate(() => {
        return strictGuessNumber('25');
      });

      expect(result).toBe('not it');
  });
});

