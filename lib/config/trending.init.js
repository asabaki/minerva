// const Flash = require('../models/flash_card');
// const credential = require('./CREDENTIAL');
// const {google} = require('googleapis');
// const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
// const auth = new google.auth.JWT(credential.analytic.client_email, null, credential.analytic.private_key, scopes);
// const gaResult = async function (start, end, id, time = 2) {
//   try {
//
//     const response = await auth.authorize();
//     const view_id = '191379801';
//     const result = google.analytics('v3').data.ga.get({
//       'auth': auth,
//       'ids': 'ga:' + view_id,
//       'metrics': 'ga:uniquePageviews',
//       'dimensions': 'ga:pagePath',
//       'start-date': start,
//       'end-date': end,
//       'sort': '-ga:uniquePageviews',
//       'max-results': 1,
//       'filters': 'ga:pagePath=~/flash/item/' + id
//     });
//     console.log(result.status);
//     // if (result.status !== 200) {
//     //   throw 403;
//     // }
//     const _jsonResult = result.data.rows[0][1] || 0;
//     return _jsonResult;
//   } catch (e) {
//     console.log(`From gaResult \n${e}`);
//     backoff(time);
//     gaResult(start,end,id, time + 1);
//   }
//
// };
//
// function backoff(time) {
//   const randomMilli = Math.floor(Math.random() * (1000));
//   let milliseconds = (time * 1000) + randomMilli;
//   let start = (new Date()).getTime();
//   while (((new Date()).getTime() - start) < milliseconds) {
//     // do nothing
//   }
// }
//
// ////////////////// DATE INFO ////////////////////////////////////////////////
// const now = new Date(Date.now());
// const someday = new Date(2019, 2, 13);
// const timeDiff = Math.abs(now.getTime() - someday.getTime());
// const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
//
// ////////////////////////////// DATE FORMAT //////////////////////////////////////
// const formatDate = function (date) {
//   var d = new Date(date),
//     month = '' + (d.getMonth() + 1),
//     day = '' + d.getDate(),
//     year = d.getFullYear();
//
//   if (month.length < 2) month = '0' + month;
//   if (day.length < 2) day = '0' + day;
//
//   return [year, month, day].join('-');
// };
// // ---------------------------- Z-SCORE ------------------------------------------
// const stdDevia = async function (arr) {
//   const n = arr.length;
//   const mean = arr.reduce((a, b) => a + b) / n;
//   const s = Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
//   return s;
// };
//
// const zscore = async function (obs, arr) {
//   const sum = arr.reduce((a, b) => a + (b || 0), 0);
//   const std = stdDevia(arr);
//   console.log(sum, std);
//   const number = arr.length;
//   const avg = sum / number;
//   return (obs - avg) / std
// };
//
//
// const getFlashcards = async () => {
//   let flash_all = await Flash.find({privacy: false}).select('_id views');
//   // console.log(flash_all);
//   flash_all = flash_all.map(flash => {
//     return {
//       _id: flash._id,
//       views: flash.views
//     }
//   });
//   return flash_all;
// }
// // --------------------------------------------------------------------------------
// const flashcard_Interval = async (backoffTime = 2) => {
//   try {
//     const collections = await getFlashcards();
//     collections.forEach(async flash => {
//
//       // setInterval(() => {
//       //   console.log(flash);
//       // },5000);
//       const views_arr = [];
//       // #######  Generate array ############
//       let i = 7;
//       const iniDate = new Date(2019, 2, 12);
//       do {
//
//         const date1 = formatDate(iniDate.setDate(iniDate.getDate()));
//         const date2 = formatDate(iniDate.setDate(iniDate.getDate() + i));
//         console.log(date1, date2, flash._id);
//         const result = await (gaResult(date1, date2, flash._id));
//         if (!result) continue;
//         // console.log(result);
//         views_arr.push(Number(result));
//         // console.log(result);
//         i += 7;
//         // backoff(2);
//       } while (i <= diffDays);
//       // ########## Recently views in the period is the last element of arr
//       // ########## Calculate z-score by function zscore
//       // console.log(views_arr[views_arr.length - 1]);
//       // setTimeout(async () => {
//       //   const score = await zscore(views_arr[views_arr.length - 1], views_arr);
//       //   console.log(`${flash._id} Score = ${score}`);
//       // }, 10000);
//
//       console.log(views_arr);
//       // backoff(5);
//     })
//   } catch (e) {
//     // backoff(backoffTime);
//     // this(fileId, (backoffTime * 2))
//     console.log(e);
//   }
// };
//
// module.exports = {flashcard_Interval};
