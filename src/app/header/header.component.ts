import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SignUpComponent} from '../w-space/sign-up/sign-up.component';
import {LogInComponent} from '../w-space/log-in/log-in.component';
import {AuthService} from '../w-space/services/auth.service';
import {SearchUserComponent} from '../w-space/search-user/search-user.component';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {Socket} from 'ngx-socket-io';
import {HttpClient} from '@angular/common/http';

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
  messageText: string;
  notification = [];

  constructor(public dialog: MatDialog,
              private router: Router,
              public authService: AuthService,
              private snack: MatSnackBar,
              private socket: Socket,
              private http: HttpClient) {
  }

  ngOnInit() {
    // this.socket.on('user_connected', (data) => {
    //   console.log(data.hello);
    //   this.socket.emit('reply_back_after_connect', {
    //     message: 'So far so good'
    //   });
    // })
    this.authService.getAuthStatus().subscribe(status => {
      this.name = this.authService.getUserName();
      this.isAuth = status;
      this.authService.getFollower().subscribe(flw => {
        this.follower = flw.body.length;
      });
      this.authService.getFollowing().subscribe(fwn => {
        this.following = fwn.body.length;
      });
      if (status) {
        this.id = localStorage.getItem('userId');
        this.authService.getNotification().subscribe(res => {
          this.notification = [];
          if (res) {
            res.forEach(noti => {
              const detail = noti.detail.split('/');
              const name = detail[0];
              const lastUpdated = Math.floor(Math.abs(new Date(noti.updatedTime).getTime() - new Date(Date.now()).getTime()) / (1000 * 60));
              // console.log(detail);
              this.notification.push({
                user: detail[0],
                action: ' just ' + (noti.action === 'follow' ? 'followed ' : noti.action === 'create' ? 'created ' : 'updated '),
                to: (noti.action === 'follow' ? 'you' : detail[1] === 'flashcard' ? 'Flashcard' : detail[1] === 'quiz' ? 'Quiz' : 'Note'),
                link: (noti.action === 'follow' ? '' : detail[1] === 'flashcard' ? 'flash/item/' : detail[1] === 'quiz' ? 'quiz/item/' : 'note/item/') + detail[2],
                days: lastUpdated > 60 ? (lastUpdated > 1440 ? (lastUpdated > 43800 ? (lastUpdated > 525600 ? Math.round(lastUpdated / 525600) + ' years ago' : Math.round(lastUpdated / 43800) + ' months ago') : Math.round(lastUpdated / 1440) + ' days ago') : Math.round(lastUpdated / 60) + ' hours ago') : lastUpdated + ' minutes ago'
              });
            });
          }
        });
        this.socket.on('client_connect', (con) => {
          this.socket.on('notify', (notify) => {
            if (notify.user_id === localStorage.getItem('userId')) {
              this.authService.getNotification().subscribe(res => {
                this.notification = [];
                res.forEach(noti => {
                  const detail = noti.detail.split('/');
                  const lastUpdated = Math.floor(Math.abs(new Date(noti.updatedTime).getTime() - new Date(Date.now()).getTime()) / (1000 * 60));
                  this.notification.push({
                    user: detail[0],
                    action: ' just ' + (noti.action === 'follow' ? 'followed ' : noti.action === 'create' ? 'created ' : 'updated '),
                    to: (noti.action === 'follow' ? 'you' : detail[1] === 'flash' ? 'Flashcard' : detail[1] === 'quiz' ? 'Quiz' : 'Note'),
                    link: (noti.action === 'follow' ? '' : detail[1] === 'flash' ? 'flash/item/' : detail[1] === 'quiz' ? 'quiz/item/' : 'note/item') + detail[2],
                    days: lastUpdated > 60 ? (lastUpdated > 1440 ? (lastUpdated > 43800 ? (lastUpdated > 525600 ? Math.round(lastUpdated / 525600) + ' years ago' : Math.round(lastUpdated / 43800) + ' months ago') : Math.round(lastUpdated / 1440) + ' days ago') : Math.round(lastUpdated / 60) + ' hours ago') : lastUpdated + ' minutes ago'
                  });
                });
              });
            }
          });
        });
        this.authService.getProfileUrl(this.id).subscribe(res => {
          this.imgUrl = res.body ? res.body : 'assets/img/user/' + this.getUser().toLowerCase().charAt(0) + '.png';
        }, err => {
          this.imgUrl = 'assets/img/user/' + this.getUser().toLowerCase().charAt(0) + '.png';
        });
      }
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

  onRead() {
    // console.log('read');
    this.authService.readNotification();
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
  onHelp() {
    const myArray = [
      'Stopping the mind is the key to success 🙏🏻',
      'There is no greater happiness than a still mind 🙏🏻',
      'Obstacles are to be overcome 🙏🏻',
      'God helps those who help themselves 🙏🏻'
    ];
    const randomItemHelp = myArray[Math.floor(Math.random() * myArray.length)];
    return randomItemHelp;
  }
}


