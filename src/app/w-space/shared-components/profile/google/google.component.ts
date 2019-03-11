import { Component, OnInit } from '@angular/core';
import {SuccessSnackComponent} from '../../success-snack/success-snack.component';
import {ErrorSnackComponent} from '../../error-snack/error-snack.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.scss']
})
export class GoogleComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private matSnack: MatSnackBar,
              private router: Router) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if (params.token) {
          this.authService.login_social(params.token, params.expiresIn, params.name, params.id).subscribe(res => {
            if (res) {
              console.log('Success');
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
