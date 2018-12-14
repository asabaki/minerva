import { Component, OnInit } from '@angular/core';
import {AuthService} from '../w-space/services/auth.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  status: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.status = this.authService.getIsAuth();
    this.authService.getAuthStatus().subscribe((res) => {
      this.status = res;
    });
  }

  onClear() {
    this.authService.seed();
  }

}
