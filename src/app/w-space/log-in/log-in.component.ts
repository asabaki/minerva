import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {NgForm} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {SuccessSnackComponent} from '../sign-up/sign-up.component';
import {Router} from '@angular/router';
import {SignUpComponent} from '../sign-up/sign-up.component';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})


export class LogInComponent implements OnInit {
hide = true;
  constructor(public dialog: MatDialog,
              private authService: AuthService,
              private dialogRef: MatDialogRef<LogInComponent>,
              private matSnack: MatSnackBar,
              private router: Router) { }

  ngOnInit() {
  }
  signUp_dialog() {
    const dialogRef = this.dialog.open(SignUpComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
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
        this.router.navigate(['/home']);
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

}

