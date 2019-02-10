import { Component, OnInit } from '@angular/core';
import {AuthService} from '../w-space/services/auth.service';
import { HighlightDelayBarrier } from 'blocking-proxy/built/lib/highlight_delay_barrier';
import {MatSelectModule} from '@angular/material/select';
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  status: boolean;
  hide = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.status = this.authService.getIsAuth();
    this.authService.getAuthStatus().subscribe((res) => {
      this.status = res;
    });
  }

  onClick() {
    this.hide = !this.hide;
  }
  onClear() {
    this.authService.seed();
  }

}
