import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SignUpComponent} from '../w-space/sign-up/sign-up.component';
import {LogInComponent} from '../w-space/log-in/log-in.component';
import {AuthService} from '../w-space/services/auth.service';
import {SearchUserComponent} from '../w-space/search-user/search-user.component';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  name: string;
  id: string;
  isAuth: boolean;
  follower = 0;
  following = 0;
  imgUrl: string;

  // TODO - ขยายรูปหน่อยเดะ

  constructor(public dialog: MatDialog,
              private router: Router,
              public authService: AuthService,
              private snack: MatSnackBar) {
  }

  ngOnInit() {

    this.authService.getAuthStatus().subscribe(status => {
      this.name = this.authService.getUserName();
      this.isAuth = status;
      this.authService.getFollower().subscribe(flw => {
        this.follower = flw.body.length;
      });
      this.authService.getFollowing().subscribe(fwn => {
        this.following = fwn.body.length;
      });
      this.authService.getProfileUrl().subscribe(url => {
        if (url.ok) {
          this.imgUrl = url.body;
        }
      });
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
  // TODO - Dialog open twice

  openHelpSnackBar() {
    this.snack.openFromComponent(helpSnackComponent, {
      duration: 4800,
    });
  }
}


@Component({
  selector: 'help-snack',
  templateUrl: 'help-snack.html',
  styles: [`
    .help {
      color: white;
      font-size: 2rem;
      text-align: center;
    }
  `],
})
export class helpSnackComponent {
}


