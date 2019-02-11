import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {LogInComponent} from '../log-in/log-in.component';
import {MatDialog} from '@angular/material';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor (private authService: AuthService,
               private router: Router,
               private dialog: MatDialog) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isAuth = this.authService.getIsAuth();
    if (!isAuth) {
      this.router.navigate(['/']);
      this.dialog.open(LogInComponent, {panelClass: 'myapp-no-padding-dialog'});
    }
    return isAuth;
  }

}
