import fs from 'node:fs';
import client from 'node:https';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fsExtra from 'fs-extra';

const url = 'https://memegen-link-examples-upleveled.netlify.app/';
const filePath = './memes';

// First, this will check if the directory exist, if it does exist, it will clean out
// the content. If it does not exist, it will mkdir
try {
  if (fs.existsSync(filePath)) {
    fsExtra.emptyDirSync(filePath);
    console.log('Directory successfully cleaned-up');
  } else {
    fs.mkdir(filePath, { recursive: true }, () => {
      console.log('Directory successfully created!');
    });
  }
} catch (e) {
  console.log('An error occurred!');
}

//  Async function which scrapes the data
async function scrapeData() {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);

    // Load HTML we fetched in the previous line
    const htmlContent = cheerio.load(data);
    console.log('Website Online, starting the scraping process now!');

    // Select all the img items
    const imgItems = htmlContent('img');

    // Stores data for all images
    const linkArray = [];

    // Use .each method to loop through the htmlContent we selected
    imgItems.each((idx, el) => {
      if (idx <= 9) {
        const link = htmlContent(el).attr('src');
        linkArray.push(link);
      }
      // Looping over the linkArray.length
      for (let i = 0; i < linkArray.length; i++) {
        client.get(linkArray[i], (res) => {
          const dir = `./memes/0${i + 1}.jpg`;
          res.pipe(fs.createWriteStream(dir));
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
}
// Invoke the above function
await scrapeData();
