import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {NgForm} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {SignUpComponent} from '../sign-up/sign-up.component';
import {SuccessSnackComponent} from '../shared-components/success-snack/success-snack.component';
import {ErrorSnackComponent} from '../shared-components/error-snack/error-snack.component';


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
      if (res.error) {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
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

