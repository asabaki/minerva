import {HttpClient, HttpClientModule, HttpHeaders, HttpParams} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {MatDialog, MatSnackBar} from '@angular/material';
import {environment} from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private userId: string;
  private userName: string;
  followed = new Subject<any>();
  follower = new Subject<any>();
  following = new Subject<any>();
  toFollow = new Subject<any>();
  onFollowing = new Subject<any>();
  onUnFollowing = new Subject<any>();
  profileUrl = new Subject<any>();

  constructor(private http: HttpClient,
              private router: Router,
              private dialog: MatDialog,
              private matSnack: MatSnackBar) {
  }

  signUp(name: string, email: string, password: string): Observable<any> {
    const user = {name, email, password};
    const v = new Subject<any>();
    this.http.post<any>(BACKEND_URL + 'signup', user)
      .pipe(map((res) => {
        return {
          user: res.user,
          emessage: res.emessage
        };
      }))
      .subscribe(
        (result) => {
          v.next(result);
          this.login(user.email, user.password);
        },
        (err) => {
          // console.log(err);
          v.next(err.error);
          return 'Error!';
        });
    return v.asObservable();
  }

  login(username: string, password: string) {
    const getUser = {username, password};
    const v = new Subject<any>();
    this.http.post<any>(BACKEND_URL + 'login', getUser, {observe: 'response'})
      .subscribe(
        (result) => {
          const token = result.body.token;
          this.token = token;
          if (token) {
            const expireDuration = result.body.expiresIn;
            this.setAuthTimer(expireDuration);
            const now = new Date();
            const expireDate = new Date(now.getTime() + expireDuration * 1000);
            this.userName = result.body.user;
            this.userId = result.body.id;
            this.saveAuthData(token, expireDate, this.userId, this.userName);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            v.next(result);
          }
        },
        (err) => {
          console.log(err);
          v.next(err);
        });
    return v.asObservable();
  }

  login_social(token: string, expiresIn: number, name: string, id: string) {
    const v = new Subject<any>();
    if (token) {
      const expireDuration = expiresIn;
      this.setAuthTimer(expireDuration);
      const now = new Date();
      const expireDate = new Date(now.getTime() + expireDuration * 1000);
      this.userName = name;
      this.userId = id;
      this.saveAuthData(token, expireDate, this.userId, this.userName);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      v.next(true);
    }
    return v.asObservable();
  }


  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getFollower() {
    if (this.userId) {
      this.http.get(BACKEND_URL + 'get/follower', {
        params: new HttpParams().set('id', this.userId),
        observe: 'response'
      }).subscribe(res => {
        this.follower.next(res);
      });
    } else {
      this.follower.next([]);
    }
    return this.follower.asObservable();
  }

  getFollowing() {
    if (this.userId) {
      this.http.get(BACKEND_URL + 'get/following', {
        params: new HttpParams().set('id', this.userId),
        observe: 'response'
      }).subscribe(res => {
        this.following.next(res);
      });
    } else {
      this.following.next([]);
    }
    return this.following.asObservable();
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expire = localStorage.getItem('expiration');
    const name = localStorage.getItem('name');
    if (!token || !expire) {
      return;
    }
    return {
      token,
      userId,
      expirationDate: new Date(expire),
      name
    };
  }

  getUserName() {
    return this.userName;
  }

  getToFollow(id: string) {
    this.http.get(BACKEND_URL + 'get/tofollow', {
      params: new HttpParams().set('id', id),
      observe: 'response'
    }).subscribe(res => {
      this.toFollow.next(res.body);
    });
    return this.toFollow.asObservable();
  }

  getProfileUrl() {
    this.http.get(BACKEND_URL + 'profile_pic', {observe: 'response'}).subscribe(res => {
      this.profileUrl.next(res);
    });
    return this.profileUrl.asObservable();
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expireIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expireIn) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.userName = authInfo.name;
      this.setAuthTimer(expireIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiration');
    localStorage.removeItem('name');
  }

  saveAuthData(token: string, expirationDate: Date, id: string, name: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
    localStorage.setItem('userId', id);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  seed() {
    const user = this.getAuthData();
    this.http.delete(BACKEND_URL + 'seed/' + user.userId, {params: {userId: user.userId}}).subscribe((res) => {
    });
  }

  followUser(id: string) {
    const followerId = localStorage.getItem('userId');
    if (followerId) {
      this.http.post(BACKEND_URL + 'follow', {
        follower: followerId,
        following: id
      }, {observe: 'response'}).subscribe(res => {
        if (res.status === 202) {
          this.onFollowing.next(-1);
        } else {
          this.following.next(res);
          this.onFollowing.next(1);
        }
      });
    }
    return this.onFollowing.asObservable();
  }

  unfollowUser(id: string) {
    const followerId = localStorage.getItem('userId');
    if (followerId) {
      this.http.patch(BACKEND_URL + 'unfollow', {
        follower: followerId,
        following: id
      }, {observe: 'response'}).subscribe(res => {
        if (res.status === 200) {
          this.following.next(res);
          this.onUnFollowing.next(1);
        } else {
          this.onUnFollowing.next(-1);
        }
      });
    }
    return this.onUnFollowing.asObservable();
  }


  isFollowing(follower: string, following: string) {
    this.http.get(BACKEND_URL + 'following/' + follower + '/' + following, {
      observe: 'response'
    }).subscribe(res => {
      // console.log(res);
      this.followed.next(res.body);
    });
    return this.followed.asObservable();
  }

  profileUpload(image: File | string) {
    const imgData = new FormData();
    imgData.append('image', image);
    this.http.post(BACKEND_URL + 'profile', imgData, {observe: 'response'}).subscribe(res => {
      this.profileUrl.next(res);
    });
    return this.profileUrl.asObservable();
  }

  setHttpHeader() {
    const headers = new HttpHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json');
    // const options = { headers: headers, observe: 'response'};
    // return options;
  }
}
