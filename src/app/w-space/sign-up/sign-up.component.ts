import {Component, Inject, OnInit} from '@angular/core';
import {Form, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {MAT_SNACK_BAR_DATA, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  form: FormGroup;

  constructor(private authService: AuthService,
              private snackBar: MatSnackBar) {
  }

  static matchingConfirmPasswords(passwordKey: any) {
    const passwordInput = passwordKey['value'];
    if (passwordInput.password === passwordInput.cfPassword) {
      return null;
    } else {
      return passwordKey.controls['cfPassword'].setErrors({passwordNotEquivalent: true});
    }
  }

  ngOnInit() {
    this.form = new FormGroup({
        'firstName': new FormControl(null, Validators.required),
        'lastName': new FormControl(null, Validators.required),
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, [Validators.required]),
        'cfPassword': new FormControl(null, Validators.required)
      },
      SignUpComponent.matchingConfirmPasswords
    );
  }

  onSignup() {
    // this.form.value.password !== this.form.value.cfPassword ? console.log('Not match') : console.log('Match');
    if (this.getErrorMsg() === '') {
      console.log('Pass');
      this.authService.signUp(this.form.value.firstName + this.form.value.lastName, this.form.value.email, this.form.value.password).subscribe((res) => {
        console.log(res);
        if (res.user) {
          this.snackBar.openFromComponent(SuccessSnackComponent, {
            data: res.emessage,
            duration: 1500,
            panelClass: 'my-snack'
          });
          this.form.reset();
        } else {
          this.snackBar.openFromComponent(ErrorSnackComponent, {
            data: res.emessage,
            duration: 1500,
            panelClass: 'my-snack'
          });
        }

      });
      // console.log(this.authService.signUp(this.form.value.firstName + this.form.value.lastName, this.form.value.email, this.form.value.password));
      // console.log(this.form);
    } else {
      console.log(this.form);
      console.log('Not Pass!');
    }
  }

  getErrorMsg() {
    if (!this.form.invalid) {
      return '';
    }
    if (this.form.invalid && this.form.untouched) {
      return ' ';
    }
    if (this.form.get('firstName').hasError('required') || this.form.get('lastName').hasError('required') || this.form.get('email').hasError('required') || this.form.get('password').hasError('required') || this.form.get('cfPassword').hasError('required')) {
      return 'Please Enter All Fields!';
    } else if (this.form.get('email').hasError('email')) {
      return 'Please Enter Valid Email Address!';
    } else if (this.form.get('cfPassword').hasError('passwordNotEquivalent')) {
      return 'Please Enter the same password';
    } else {
      return '';
    }
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
