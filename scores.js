const puppeteer = require('puppeteer');
const url = "https://sports.bwin.com/en/sports#categoryIds=25,192&leagueIds=43&page=0&sportId=4&templateIds=0.6167564863754189";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  const result = await page.evaluate(() => {
    const object = {};
    const titleDivs = Array.from(document.querySelectorAll("div.marketboard-event-with-header div.marketboard-event-with-header__header-title"));
    titleDivs.forEach(div => {
      let bestOdds = 100.00;
      let scoreline = "10-10";
      let title = div.innerText;
      let parent = div.closest("div.marketboard-event-with-header");
      let table = parent.querySelector("table");
      let buttons = table.querySelectorAll("button");
      buttons.forEach(button => {
        let odds = parseFloat(button.children[1].innerText);
        if (odds < bestOdds) {
          bestOdds = odds;
          scoreline = button.children[0].innerText;
        }
      })
      object[title] = scoreline;
    })
    return object;
  })

  const keys = Object.keys(result)

  keys.forEach(key => {
    console.log(key);
    console.log(result[key]);
    console.log("----------");
  })

  await browser.close();
})()