import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private userId: string;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  getHello() {
    this.http.get('http://localhost:3000/api/user').subscribe((result) => {
      console.log(result);
    });
  }

  signUp(username: string, password: string) {
    const user = {username, password};
    this.http.post('http://localhost:3000/api/user/signup', user).subscribe((result) => {
      console.log(result);
    });
  }

  login(username: string, password: string) {
    const getUser = {username, password};
    this.http.post<{ user, token }>('http://localhost:3000/api/user/login', getUser).subscribe((result) => {
      console.log(result);
      const token = result.token;
      this.token = token;
      if (token) {
        this.userId = result.user._id;
        this.saveAuthData(token, this.userId);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }
    });
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
    if (!token) {
      return;
    }
    return {
      token,
      userId
    };
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    this.token = authInfo.token;
    this.isAuthenticated = true;
    this.userId = authInfo.userId;
    this.authStatusListener.next(true);
  }


  saveAuthData(token: string, id: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', id);
  }
}
