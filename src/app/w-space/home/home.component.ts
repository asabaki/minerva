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
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {PlannerService} from '../services/planner.service';

const BACKEND_URL = environment.apiUrl + '/user/';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  id: string;
  following = [];
  isLoaded = false;
  top_users = [];

  constructor(private authService: AuthService,
              private flash: FlashCardService,
              private planner: PlannerService,
              private quiz: QuizService,
              private note: NoteService,
              private auth: AuthService,
              private dialog: MatDialog,
              private matSnack: MatSnackBar,
              private http: HttpClient) {
  }

  trending: any;
  news_feed = [];
  latest_event: any;

  ngOnInit() {
    this.http.get<any>(BACKEND_URL + 'feeds', {observe: 'response'}).subscribe(res => {
      this.news_feed = [...res.body];
      this.news_feed.forEach(feed => {
        const details = feed.activity.details.split('/');
        feed['message'] = feed.activity.activity === 'create' ? 'Create a new' +
          (feed.activity.collection_name === 'flash' ? ' Flashcard Collection ' : feed.activity.collection_name === 'quiz' ? ' Quiz ' : ' Note ')
          + '<em>' + details[0] + '</em>' : feed.activity.activity === 'update' ? 'Update a ' +
          (feed.activity.collection_name === 'flash' ? ' Flashcard Collection ' : feed.activity.collection_name === 'quiz' ? ' Quiz ' : ' Note ')
          + details[0] : 'Error';
        const lastUpdated = Math.floor(Math.abs(new Date(feed.activity.updatedTime).getTime() - new Date(Date.now()).getTime()) / (1000 * 60));
        feed['ago'] = lastUpdated > 60 ? (lastUpdated > 1440 ? (lastUpdated > 43800 ? (lastUpdated > 525600 ? Math.round(lastUpdated / 525600) + ' years ago' : Math.round(lastUpdated / 43800) + ' months ago') : Math.round(lastUpdated / 1440) + ' days ago') : Math.round(lastUpdated / 60) + ' hours ago') : lastUpdated + ' minutes ago';
      });
      this.sortByKeyV2(this.news_feed, 'activity', 'updatedTime');
    });
    this.isLoaded = false;
    this.id = localStorage.getItem('userId');
    this.auth.getTrendUsers(localStorage.getItem('userId')).subscribe(res => {
      this.top_users = [...res];
      this.http.get(BACKEND_URL + 'profile_pic', {
        observe: 'response',
        params: new HttpParams().set('id', this.top_users[0].id)
      }).subscribe(url => {
        this.top_users[0].url = url.body ? url.body : 'assets/img/user/' + this.top_users[0].name.toLowerCase().charAt(0) + '.png';
        this.http.get(BACKEND_URL + 'profile_pic', {
          observe: 'response',
          params: new HttpParams().set('id', this.top_users[1].id)
        }).subscribe(url2 => {
          this.top_users[1].url = url2.body ? url2.body : 'assets/img/user/' + this.top_users[1].name.toLowerCase().charAt(0) + '.png';
          this.http.get(BACKEND_URL + 'profile_pic', {
            observe: 'response',
            params: new HttpParams().set('id', this.top_users[2].id)
          }).subscribe(url3 => {
            this.top_users[2].url = url3.body ? url3.body : 'assets/img/user/' + this.top_users[2].name.toLowerCase().charAt(0) + '.png';
            this.authService.getTrendWorks().subscribe(works => {
              this.trending = works;
              this.planner.get_latest().subscribe(event => {
                if (event) {
                  const startTime = Math.floor(Math.abs(new Date(event.start).getTime() - new Date(Date.now()).getTime()) / (1000 * 60));
                  const days = Math.floor(startTime / 1440);
                  const time_start = new Date(event.start).toLocaleTimeString();
                  if (event.end) {
                    const time_end = new Date(event.end).toLocaleTimeString();
                    event['endTime'] = time_end;
                  }
                  event['days'] = days;
                  event['startTime'] = time_start;
                  this.latest_event = event;
                } else {
                }
                this.isLoaded = true;
              });
            });
          });
        });
      });
    });
  }

  sortByKey(array, key) {
    return array.sort(function (a, b) {
      const x = a[key], y = b[key];
      return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
  }

  sortByKeyV2(array, key1, key2) {
    return array.sort(function (a, b) {
      const x = a[key1][key2], y = b[key1][key2];
      return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
  }

  onFollow(id: string) {
    console.log(id);
    this.authService.followUser(id).subscribe(res => {
      console.log(res);
      if (res !== -1 ) {
        // this.isFollowing = true;
        // this.authService.isFollowing(localStorage.getItem('userId'), this.creator);
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'You successfully follow ' + id,
          duration: 1500
        });
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

  isYourself(id: string) {
    this.authService.getAuthStatus().subscribe(res => {
      if (res) {
        return localStorage.getItem('userId') === id;
      }
    });
  }

}
