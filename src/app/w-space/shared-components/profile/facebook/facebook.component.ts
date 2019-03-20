import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {AuthService} from '../../../services/auth.service';
import {MatSnackBar} from '@angular/material';
import {SuccessSnackComponent} from '../../success-snack/success-snack.component';
import {ErrorSnackComponent} from '../../error-snack/error-snack.component';
@Component({
  selector: 'app-profile',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss']
})
export class FacebookComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private matSnack: MatSnackBar) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if (params.token) {
          this.authService.login_social(params.token, params.expiresIn, params.name, params.id).subscribe(res => {
            if (res) {
              this.matSnack.openFromComponent(SuccessSnackComponent, {
                data: 'Login Success!',
                duration: 1500,
                panelClass: 'my-snack'
              });
              this.router.navigate(['home']);
            } else {
              this.matSnack.openFromComponent(ErrorSnackComponent, {
                data: 'Something Went Wrong!!',
                duration: 1500,
                panelClass: 'my-snack'
              });
            }
          });
        } else {
          this.router.navigate(['login']);
        }
      });
  }

}
