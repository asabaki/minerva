import { Injectable } from '@angular/core';
import { writeFileSync, readFileSync, readFile, writeFile, appendFile } from 'fs';
@Injectable({
  providedIn: 'root'
})
export class BlockerService {

  constructor() { }
  // fs = require('fs');
  filePath =  '/etc/hosts';
  redirectPath = '127.0.0.1';
  websites = ['www.facebook.com', 'facebook.com', 'twitter.com', 'www.twitter.com'];
  delay = 10000; // 10 seconds
  blockWeb() {
    const date = new Date ();
    const hours = date.getHours();
    if (hours >= 14 && hours < 18) {
      console.log('Time to block websites');
      readFile(this.filePath, (err, data) => {
        if (err) {
          return console.log(err);
        }
        const fileContents = data.toString();
        for (let i = 0; i < this.websites.length; i++) {
          const addWebsite = '\n' + this.redirectPath + ' ' + this.websites[i];
          if (fileContents.indexOf(addWebsite) < 0) {
            console.log('Website: ' + addWebsite + ' is not present');
            appendFile(this.filePath, addWebsite, (err) => {
              if (err) {
                return console.log('Error: ', err);
              }
              console.log('File Updated Successfully');
            });
          } else {
            console.log('Website: ' + addWebsite + ' is present');
          }
        }

      });
    } else {
      console.log('Time to unblock websites');
      let completeContent = '';
      readFileSync(this.filePath)
        .toString()
        .split('\n')
        .forEach((line) => {
          let flag = 1;
          for (let i = 0; i < this.websites.length; i++) {
            if (line.indexOf(this.websites[i]) >= 0) {
              flag = 0;
              break;
            }
          }

          if (flag === 1) {
            if (line === '') {
              completeContent += line;
            } else {
              completeContent += line + '\n';
            }
          }

        });

      // Replace the contents of file by completeContent
      writeFile(this.filePath, completeContent, (err) => {
        if (err) {
          return console.log('Error!', err);
        }
      });
    }
  }
}
