import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Form, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {MAT_SNACK_BAR_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {CustomValidator} from '../services/customValidator';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {

  form: FormGroup;
  hide = true;

  constructor(private authService: AuthService,
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
    console.log(this.form);
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
    if (this.form.get('firstName').touched && this.form.get('firstName').hasError('required')) {
      return 'Please Enter First Name';
    }
    if (this.form.get('lastName').touched && this.form.get('lastName').hasError('required')) {
      return 'Please Enter Last Name';
    }
    if (this.form.get('email').touched && this.form.get('email').hasError('required')) {
      return 'Please Enter Email';
    }
    if (this.form.get('email').touched && this.form.get('email').hasError('email')) {
      return 'Please Enter Valid Email';
    }
    if (this.form.get('password').touched && this.form.get('password').hasError('required')) {
      return 'Please Enter Password';
    }
    // if (this.form.get('cfPassword').touched && this.form.get('cfPassword').hasError('required')) {
    //   return 'Please Enter Password';
    // }
    if (this.form.get('cfPassword').touched && this.form.get('cfPassword').hasError('passwordNotEquivalent')) {
      return 'Please the Same Password';
    }


  }

  ngOnDestroy() {

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
export class ErrorSnackComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }
}

@Component({
  selector: 'success-snack',
  templateUrl: 'success-snack.html',
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
      color: lawngreen;
      font-weight: 700;
    }
  `],
})
export class SuccessSnackComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }
}
