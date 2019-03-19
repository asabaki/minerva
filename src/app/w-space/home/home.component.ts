import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SearchUserComponent} from '../search-user/search-user.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AuthService} from '../services/auth.service';
import {ErrorSnackComponent} from '../shared-components/error-snack/error-snack.component';
import {SuccessSnackComponent} from '../shared-components/success-snack/success-snack.component';
import {FlashcardComponent} from '../flashcard/flashcard.component';
import {FlashCardService} from '../services/flash-card.service';
import {QuizService} from '../services/quiz.service';
import {NoteService} from '../services/note.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  id: string;
  following = [];
  isLoaded = false;
  top_users = [];

  constructor(private authService: AuthService,
              private flash: FlashCardService,
              private quiz: QuizService,
              private note: NoteService,
              private auth: AuthService,
              private dialog: MatDialog,
              private matSnack: MatSnackBar) {
  }

  trending = [];

  ngOnInit() {
    this.isLoaded = false;
    this.id = localStorage.getItem('userId');
    this.auth.getTrendUsers(localStorage.getItem('userId')).subscribe(res => {
      this.top_users = [...res];
      this.authService.getProfileUrl2(this.top_users[0].id).subscribe(url => {
        this.top_users[0].url = url.body ? url.body : 'assets/img/user/' + this.top_users[0].name.toLowerCase().charAt(0) + '.png';
      });
      this.authService.getProfileUrl3(this.top_users[1].id).subscribe(url => {
        this.top_users[1].url = url.body ? url.body : 'assets/img/user/' + this.top_users[1].name.toLowerCase().charAt(0) + '.png';
      });
      this.authService.getProfileUrl4(this.top_users[2].id).subscribe(url => {
        this.top_users[2].url = url.body ? url.body : 'assets/img/user/' + this.top_users[2].name.toLowerCase().charAt(0) + '.png';
      });
    });
    // this.authService.getToFollow(localStorage.getItem('userId')).subscribe((res) => {
    //   res.forEach(user => {
    //     this.following.push({
    //       _id: user._id,
    //       name: user.name,
    //       followed: user.follower.indexOf(this.id) >= 0
    //     });
    //   });
    this.quiz.get_allQuizzes().subscribe(quizzes => {
      this.sortByKey(quizzes, 'views');
      this.trending.push(quizzes[0]);
    });
    this.flash.fetch_collection_all().subscribe(collections => {
      this.sortByKey(collections, 'views');
      this.trending.push(collections[0]);
    });
    this.note.allNotes().subscribe(notes => {
      this.sortByKey(notes, 'views');
      this.trending.push(notes[0]);
    });
    console.log(this.trending);

    // });
  }

  ngAfterViewInit(): void {
    this.isLoaded = true;
  }

  sortByKey(array, key) {
    return array.sort(function (a, b) {
      const x = a[key], y = b[key];
      return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
  }

  onFollow(id: string) {
    this.authService.followUser(id).subscribe(res => {
      if (res !== -1) {
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
