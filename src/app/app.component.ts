import {Component, OnInit} from '@angular/core';
import {AuthService} from './w-space/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Minerva';
  constructor (private authService: AuthService,
               private router: Router) {}
  ngOnInit() {
    this.router.events.subscribe(e => {
      this.authService.autoAuthUser();
    });
  }
}
