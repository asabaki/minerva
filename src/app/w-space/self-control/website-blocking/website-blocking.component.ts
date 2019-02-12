import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-website-blocking',
  templateUrl: './website-blocking.component.html',
  styleUrls: ['./website-blocking.component.scss']
})
export class WebsiteBlockingComponent implements OnInit {
  hide = false;
  onClick() {
    this.hide = !this.hide;
  }
  constructor( ) { }
  ngOnInit() {
  }


}
