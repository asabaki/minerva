import {HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {SignUpComponent} from '../sign-up/sign-up.component';
import {LogInComponent} from '../log-in/log-in.component';

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
  constructor(private http: HttpClient,
              private router: Router,
              private dialog: MatDialog) {
  }

  signUp(name: string, email: string, password: string): Observable<any> {
    const user = {name, email, password};
    const v = new Subject<any>();
    this.http.post<any>('http://localhost:3000/api/user/signup', user)
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
    this.http.post<{ user, token, eMessage, id, expiresIn }>('http://localhost:3000/api/user/login', getUser)
      .pipe(map(res => {
        return {
          user: res.user,
          id: res.id,
          token: res.token,
          emessage: res.eMessage,
          expiresIn: res.expiresIn
        };
      }))
      .subscribe(
        (result) => {
          // console.log(result);
          const token = result.token;
          this.token = token;
          if (token) {
            const expireDuration = result.expiresIn;
            this.setAuthTimer(expireDuration);
            const now = new Date();
            const expireDate = new Date(now.getTime() + expireDuration * 1000);
            this.userName = result.user;
            this.userId = result.id;
            this.saveAuthData(token, expireDate, this.userId, this.userName);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.router.navigate(['/home']);
            v.next(result);
          }
        },
        (err) => {
          v.next(err);
        });
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
    this.http.get('http://localhost:3000/api/user/get/follower', {
      params: new HttpParams().set('id', this.userId),
      observe: 'response'
    }).subscribe(res => {
      this.follower.next(res);
    });
    return this.follower.asObservable();
  }
  getFollowing() {
    this.http.get('http://localhost:3000/api/user/get/following', {
      params: new HttpParams().set('id', this.userId),
      observe: 'response'
    }).subscribe(res => {
      this.following.next(res);
    });
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
    this.http.get('http://localhost:3000/api/user/get/tofollow', {
      params: new HttpParams().set('id', id),
      observe: 'response'
    }).subscribe(res => {
      this.toFollow.next(res.body);
    });
    return this.toFollow.asObservable();
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
    this.http.delete('http://localhost:3000/api/user/seed/' + user.userId, {params: {userId: user.userId}}).subscribe((res) => {
      console.log(res);
    });
  }

  followUser(id: string) {
    const followerId = localStorage.getItem('userId');
    if (followerId) {
      this.http.post('http://localhost:3000/api/user/follow', {follower: followerId, following: id}, { observe: 'response'}).subscribe(res => {
        console.log(res);
        this.following.next(res);
      });
    } else {
      return -1;
    }
  }

  unfollowUser(id: string) {
    const followerId = localStorage.getItem('userId');
    if (followerId) {
      this.http.patch('http://localhost:3000/api/user/unfollow', {follower: followerId, following: id}, { observe: 'response'}).subscribe(res => {
        console.log(res);
        this.following.next(res);
      });
    } else {
      return -1;
    }
  }

  isFollowing(follower: string, following: string) {
    this.http.get('http://localhost:3000/api/user/following/' + follower + '/' + following, {
      observe: 'response'
    }).subscribe(res => {
      this.followed.next(res.body);
    });
    return this.followed.asObservable();
  }

}
