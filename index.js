import fs from 'node:fs';
import client from 'node:https';
// import path from 'node:path';
import axios from 'axios';
import * as cheerio from 'cheerio';

const url = 'https://memegen-link-examples-upleveled.netlify.app/';
const filePath = './memes';

// Making directory which is empty
try {
  if (fs.existsSync(filePath)) {
    console.log('Directory already exists.');
  } else {
    fs.mkdir(filePath, { recursive: true }, (err) => {
      if (err) throw err;
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
    // Select all the list items in plainlist class
    const imgItems = htmlContent('div a img');
    // Stores data for all countries
    const linkArray = [];
    // Use .each method to loop through the li we selected
    imgItems.each((idx, el) => {
      if (idx <= 9) {
        const link = htmlContent(el).attr('src');
        linkArray.push(link);
      }

      for (let i = 0; i < linkArray.length; i++) {
        client.get(linkArray[i], (res) => {
          const dir = `./memes/0${i + 1}.jpg`;
          res.pipe(fs.createWriteStream(dir));
        });
      }
    });
    // Logs linkArray to the console
    console.dir(linkArray);
  } catch (err) {
    console.error(err);
  }
}
// Invoke the above function
await scrapeData();

// Removing directory which is not empty!
// setTimeout(() => {
//   fs.rmSync(filePath, { recursive: true, force: true }, (err) => {
//     if (err) {
//       console.log('error occurred in deleting directory', err);
//     }
//     console.log('Directory deleted successfully');
//   });
// }, '10000');
