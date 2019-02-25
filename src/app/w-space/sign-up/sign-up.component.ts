import {Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Form, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {ErrorStateMatcher, MAT_SNACK_BAR_DATA, MatDialogRef, MatSnackBar, MatSnackBarRef} from '@angular/material';
import {CustomValidator} from '../services/customValidator';
import {Router} from '@angular/router';
import { LogInComponent} from '../log-in/log-in.component';
import {MatDialog} from '@angular/material';
import {ErrorSnackComponent} from '../shared-components/error-snack/error-snack.component';
import {SuccessSnackComponent} from '../shared-components/success-snack/success-snack.component';

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (isSubmitted));
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  @Output() loginPop = new EventEmitter();
  form: FormGroup;
  hide = true;
  onClicked = false;
  matcher = new CustomErrorStateMatcher();
  constructor(public dialog: MatDialog,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              private router: Router,
              private dialogRef: MatDialogRef<SignUpComponent>) {
  }

  // static matchingConfirmPasswords(passwordKey: any) {
  //   const passwordInput = passwordKey['value'];
  //   if (passwordInput.password === passwordInput.cfPassword) {
  //     return null;
  //   } else {
  //     return passwordKey.controls['cfPassword'].setErrors({passwordNotEquivalent: true});
  //   }
  // }
  logIn_dialog() {
    this.dialog.open(LogInComponent, {panelClass: 'myapp-no-padding-dialog'});
  }

  ngOnInit() {
    this.form = new FormGroup({
        'firstName': new FormControl(null, Validators.required),
        'lastName': new FormControl(null, Validators.required),
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, [Validators.required]),
        'cfPassword': new FormControl(null, Validators.required)
      },
      [CustomValidator.matchingConfirmPasswords]
    );
  }

  onSignup() {
    this.onClicked = true;
    this.form.get('email').markAsTouched();
    this.form.get('firstName').markAsTouched();
    this.form.get('lastName').markAsTouched();
    this.form.get('password').markAsTouched();
    this.form.get('cfPassword').markAsTouched();
    if (this.getErrorMsg() === '' && this.form.valid) {
      this.authService.signUp(this.form.value.firstName + ' ' + this.form.value.lastName, this.form.value.email, this.form.value.password).subscribe((res) => {
        console.log(res);
        if (res.user) {
          this.snackBar.openFromComponent(SuccessSnackComponent, {
            data: res.emessage,
            duration: 1500,
            panelClass: 'my-snack'
          });
          this.form.reset();
          this.router.navigate(['/']);
          this.dialogRef.close();

        } else {
          this.snackBar.openFromComponent(ErrorSnackComponent, {
            data: res.emessage,
            duration: 1500,
            panelClass: 'my-snack'
          });
        }

      });
    } else {
      this.snackBar.openFromComponent(ErrorSnackComponent, {
        data: 'Something went wrong, Please Contact Support!',
        duration: 2000,
        panelClass: 'my-snack'
      });
    }
  }

  getErrorMsg() {
    if (this.form.valid) {
      return '';
    }
    if (this.form.get('firstName').touched && this.form.get('firstName').hasError('required') && this.onClicked) {
      return 'Please Enter First Name';
    }
    if (this.form.get('lastName').touched && this.form.get('lastName').hasError('required') && this.onClicked) {
      return 'Please Enter Last Name';
    }
    if (this.form.get('email').touched && this.form.get('email').hasError('required') && this.onClicked) {
      return 'Please Enter Email';
    }
    if (this.form.get('email').touched && this.form.get('email').hasError('email') && this.onClicked) {
      return 'Please Enter Valid Email';
    }
    if (this.form.get('password').touched && this.form.get('password').hasError('required') && this.onClicked) {
      return 'Please Enter Password';
    }
    // if (this.form.get('cfPassword').touched && this.form.get('cfPassword').hasError('required')) {
    //   return 'Please Enter Password';
    // }
    if (this.form.get('cfPassword').touched && this.form.get('cfPassword').hasError('passwordNotEquivalent') && this.onClicked) {
      return 'Please the Same Password';
    }


  }

  ngOnDestroy() {

  }
}
