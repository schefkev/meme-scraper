import Axios from 'axios';
import fs from 'fs';
// import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

const url = 'https://memegen-link-examples-upleveled.netlify.app/';

const response = await fetch(url);
const body = await response.text();
let htmlContent = '';
/*
1.This code is using a regular expression, to match URLs within a string.
  The expression is passed to the `match()` method of the `body` string, which returns
  an array of matches, if any.
2.We are using the `gi` flag, which stands for 'global' and 'case-sensitive', this means
  that the `match()` method will return all matches of the expression in the string, regardless
  of case and without stop after first match.
  */

const expression =
  /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
let matches = body.match(expression);
for (let match in matches) {
  // We can use the spread operator and assign the result of the array
  htmlContent = [...matches];
}

function apiUrl(urlA) {
  return urlA.includes('jpg?width');
}
const filteredHtml = htmlContent.filter(apiUrl);

const firstTenItems = filteredHtml.slice(0, 10);
console.log(firstTenItems);

// async function downloadImage(url, filepath) {
//   const response = await Axios({
//     url,
//     method: 'GET',
//     responseType: 'stream',
//   });
//   return new Promise((resolve, reject) => {
//     response.data
//       .pipe(fs.createWriteStream(filepath))
//       .on('error', reject)
//       .once('close', () => resolve(filepath));
//   });
// }

// downloadImage(
//   'https://upload.wikimedia.org/wikipedia/en/thumb/7/7d/Lenna_%28test_image%29.png/440px-Lenna_%28test_image%29.png',
//   'lena.png',
// )
//   .then(console.log)
//   .catch(console.error);

// downloadImage(filteredHtml, '01.png').then(console.log).catch(console.error);
