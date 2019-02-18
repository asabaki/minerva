import {Component, OnInit} from '@angular/core';
import {AuthService} from './w-space/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
// TODO Check matToolTip again after add table
  title = 'Minerva';
  constructor (private authService: AuthService) {}
  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
