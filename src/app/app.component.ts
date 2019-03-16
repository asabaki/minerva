import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthService} from './w-space/services/auth.service';
import {NavigationEnd, Router} from '@angular/router';
import {Angulartics2GoogleAnalytics} from 'angulartics2/ga';

declare const ga: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
// TODO Check matToolTip again after add table
  title = 'Minerva';
  constructor (private authService: AuthService,
               private router: Router,
               private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    this.angulartics2GoogleAnalytics.startTracking();
  }
  ngOnInit() {
    this.authService.autoAuthUser();
  }
  ngAfterViewInit() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.authService.autoAuthUser();
      }
    });
  }
}
