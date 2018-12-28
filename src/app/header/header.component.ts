import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SignUpComponent} from '../w-space/sign-up/sign-up.component';
import {LogInComponent} from '../w-space/log-in/log-in.component';
import {AuthService} from '../w-space/services/auth.service';
import {MatBadgeModule} from '@angular/material/badge';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  name: string;
  id: string;
  isAuth: boolean;

  constructor(public dialog: MatDialog,
              public authService: AuthService) {
  }
  ngOnInit() {
    this.isAuth = this.authService.getIsAuth();
    this.name = this.authService.getUserName();
    this.authService.getAuthStatus().subscribe((res) => {
      this.name = this.authService.getUserName();
      this.isAuth = res;
    });
  }

  signUp_dialog() {
    const dialogRef = this.dialog.open(SignUpComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  logIn_dialog() {
    const dialogRef = this.dialog.open(LogInComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  onClear() {
    this.authService.seed();
  }
  onGetSecret() {
    this.authService.getSecret();
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
}
