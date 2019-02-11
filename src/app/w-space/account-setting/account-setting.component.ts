import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {SearchUserComponent} from '../search-user/search-user.component';
import {MatDialog} from '@angular/material';
@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss']
})
export class AccountSettingComponent implements OnInit {
  hide = false;

  name: string;
  id: string;
  isAuth: boolean;
  follower = 0;
  following = 0;

  onClick() {
    this.hide = !this.hide;
  }
  constructor(public dialog: MatDialog,
    public authService: AuthService) {
}
    ngOnInit() {
    this.isAuth = this.authService.getIsAuth();
    this.name = this.authService.getUserName();
    this.authService.getFollower().subscribe(flw => {
      this.follower = flw.body.length;
    });
    this.authService.getFollowing().subscribe(fwn => {
      this.following = fwn.body.length;
    });
    this.authService.getAuthStatus().subscribe((res) => {
      this.name = this.authService.getUserName();
      this.isAuth = res;
      this.authService.getFollower().subscribe(flw => {
        this.follower = flw.body.length;
      });
      this.authService.getFollowing().subscribe(fwn => {
        this.following = fwn.body.length;
      });
    });
  }

  onClear() {
    this.authService.seed();
  }

  getUser() {
    return this.authService.getUserName();
  }

  isLogin() {
    return this.isAuth;
  }

  onLogout() {
    this.authService.logout();
  }

  search_dialog() {
    const dialogRef = this.dialog.open(SearchUserComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

