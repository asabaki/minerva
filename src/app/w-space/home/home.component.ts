
import { Component, OnInit } from '@angular/core';
import { SearchUserComponent } from '../search-user/search-user.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AuthService} from '../services/auth.service';
import {ErrorSnackComponent} from '../shared-components/error-snack/error-snack.component';
import {SuccessSnackComponent} from '../shared-components/success-snack/success-snack.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  id: string;
  following = [];

  constructor(private authService: AuthService,
              private dialog: MatDialog,
              private matSnack: MatSnackBar) {
  }

  ngOnInit() {
    this.id = localStorage.getItem('userId');
    this.authService.getToFollow(localStorage.getItem('userId')).subscribe((res) => {
      res.forEach(user => {
        // console.log(user);
        // console.log(`You follow ${user.name} : ${user.follower.indexOf(this.id)}`);
        this.following.push({
          _id: user._id,
          name: user.name,
          followed: user.follower.indexOf(this.id) >= 0
        });
      });
    });
  }

  onFollow(id: string) {
    this.authService.followUser(id).subscribe(res => {
      if (res !== -1 ) {
        // this.isFollowing = true;
        this.following
          .filter(user => user._id === id)
          .map(user => user.followed = true);
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'You have already follow this user!',
          duration: 1500
        });
      }
    });
  }

  onUnfollow(id: string) {
    this.authService.unfollowUser(id).subscribe(res => {
      this.following
        .filter(user => user._id === id)
        .map(user => user.followed = false);
    });
  }
  search_dialog() {
    const dialogRef = this.dialog.open(SearchUserComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
