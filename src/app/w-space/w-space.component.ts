import { Component, OnInit } from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-w-space',
  templateUrl: './w-space.component.html',
  styleUrls: ['./w-space.component.scss']
})
export class WSpaceComponent implements OnInit {

  isLoggedIn = false;
  constructor(private router: Router,
              private auth: AuthService) {
  }

  ngOnInit() {
    const scrollLevels: { [navigationId: number]: number } = {};
    let lastId = 0;
    let restoredId: number;

    this.auth.getAuthStatus().subscribe(res => {
      if (res) {
        this.isLoggedIn = true;
      }
    })
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
