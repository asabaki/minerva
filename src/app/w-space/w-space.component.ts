import { Component, OnInit } from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-w-space',
  templateUrl: './w-space.component.html',
  styleUrls: ['./w-space.component.scss']
})
export class WSpaceComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
    const scrollLevels: { [navigationId: number]: number } = {};
    let lastId = 0;
    let restoredId: number;

    this.router.events.subscribe((event) => {
      window.scrollTo(0, 0);
      if (event instanceof NavigationStart) {
        scrollLevels[lastId] = window.scrollY;
        lastId = event.id;
        restoredId = event.restoredState ? event.restoredState.navigationId : undefined;
      }

      if (event instanceof NavigationEnd) {
        if (restoredId) {
          // Optional: Wrap a timeout around the next line to wait for
          // the component to finish loading
          window.scrollTo(0, 0);
        } else {
          window.scrollTo(0, 0);
        }
      }

    });
  }
}
