import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {NgForm} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {SuccessSnackComponent} from '../sign-up/sign-up.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
<<<<<<< HEAD
<<<<<<< HEAD
export class LogInComponent {
  hide = true;
=======
export class LogInComponent implements OnInit {
=======
>>>>>>> e87d9478fe12b874d403ee49be0a049af2c16a1f

export class LogInComponent implements OnInit {
hide = true;
  constructor(private authService: AuthService,
              private dialogRef: MatDialogRef<LogInComponent>,
              private matSnack: MatSnackBar,
              private router: Router) { }

  ngOnInit() {
  }
  onLogin(f: NgForm) {
    // console.log(f.value.email);
    this.authService.login(f.value.email, f.value.password).subscribe((res) => {
      // console.log(res);
      if (res.error) {
        this.matSnack.openFromComponent(ErrorLoginSnackComponent, {
          data: res.error.message,
          duration: 1500,
          panelClass: 'my-snack'
        });
      } else {
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'Login Success!',
          duration: 1500,
          panelClass: 'my-snack'
        });
        this.router.navigate(['/']);
        this.dialogRef.close();
      }
    });
  }

}

@Component({
  selector: 'error-snack',
  templateUrl: 'error-snack.html',
  styles: [`
    .error-snack {
      color: white;
      font-size: 15px;
      justify-content: center;
      display: flex;
      align-items: center;
      padding: auto;
    }

    .icon {
      color: red;
      font-weight: 700;
    }
  `],
})
export class ErrorLoginSnackComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }
<<<<<<< HEAD
>>>>>>> f67a6103b5d4267d0b5f0248c547f66f5fc5d183
=======
>>>>>>> e87d9478fe12b874d403ee49be0a049af2c16a1f
}
