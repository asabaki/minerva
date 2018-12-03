import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';

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

  constructor(private http: HttpClient,
              private router: Router) {
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
            this.router.navigate(['/']);
            console.log('Login Complete');
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

  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expire = localStorage.getItem('expiration');
    const name = localStorage.getItem('name');
    console.log(`Getting Called: ${userId} ${expire}`);
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

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expireIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expireIn) {
      console.log(`expiresIn = ${expireIn} \n token = ${authInfo.token}`);
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.userName = authInfo.name;
      this.setAuthTimer(expireIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    console.log('Setting Timer' + duration);
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
}
