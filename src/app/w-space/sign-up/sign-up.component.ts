import {Component, OnInit} from '@angular/core';
import {Form, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  eMessage: string;
  form: FormGroup;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
        'firstName': new FormControl(null, Validators.required),
        'lastName': new FormControl(null, Validators.required),
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, Validators.required),
        'confirm': new FormControl(null, Validators.required)
      },
      Validators.required
    );
  }

  onSignup() {
    if (this.getErrorMsg() === '') {
      console.log(this.form.get('email').hasError('email'));
      console.log(this.form);
    }
  }

  getErrorMsg() {
    if (!this.form.invalid) {
      return;
    }
    return this.form.get('firstName').hasError('required') ? 'You must enter a value' :
      this.form.get('email').hasError('email') ? 'Not a valid email' :
        '';
  }

}
