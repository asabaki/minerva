
import { Component, OnInit } from '@angular/core';
import { SearchUserComponent } from '../search-user/search-user.component';
import {MatDialog} from '@angular/material';
import {AuthService} from '../services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  id: string;
  following = [];

  constructor(private authService: AuthService,
              private dialog: MatDialog) {
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
    console.log(this.following);
  }

  onFollow(id: string) {
    if (this.authService.followUser(id) !== -1) {
      this.following
        .filter(user => user._id === id)
        .map(user => user.followed = true);
    }
  }

  onUnfollow(id: string) {
    if (this.authService.unfollowUser(id) !== -1) {
      this.following
        .filter(user => user._id === id)
        .map(user => user.followed = false);
    }
  }
  search_dialog() {
    const dialogRef = this.dialog.open(SearchUserComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
