import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {SearchUserComponent} from '../search-user/search-user.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {mimeType} from './mime-type.validator';
import {SuccessSnackComponent} from '../shared-components/success-snack/success-snack.component';
import {ErrorSnackComponent} from '../shared-components/error-snack/error-snack.component';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss']
})
export class AccountSettingComponent implements OnInit {
  hide = false;

  name: string[];
  id: string;
  isAuth: boolean;
  follower = 0;
  following = 0;
  form: FormGroup;
  imagePreview: string;
  imgUrl: string;
  testimg: string;

  onClick() {
    this.hide = !this.hide;
  }

  constructor(public dialog: MatDialog,
              public authService: AuthService,
              private matSnack: MatSnackBar) {
  }

  ngOnInit() {
    this.authService.getProfileUrl().subscribe(res => {
      this.imgUrl = res.body ? res.body : 'assets/img/user/' + this.getUser().toLowerCase().charAt(0) + '.png';
    });
    this.form = new FormGroup({
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.isAuth = this.authService.getIsAuth();
    this.name = this.authService.getUserName().split(' ');
    this.authService.getFollower().subscribe(flw => {
      this.follower = flw.body.length;
    });
    this.authService.getFollowing().subscribe(fwn => {
      this.following = fwn.body.length;
    });
    this.authService.getAuthStatus().subscribe((res) => {
      this.name = this.authService.getUserName().split(' ');
      this.isAuth = res;
      this.authService.getFollower().subscribe(flw => {
        this.follower = flw.body.length;
      });
      this.authService.getFollowing().subscribe(fwn => {
        this.following = fwn.body.length;
      });
    });
  }

  onImagePick(eventTarget: EventTarget) {
    const file = (eventTarget as HTMLInputElement).files[0];
    this.form.patchValue({
      'image': file
    });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      // @ts-ignore
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSaveImage() {
    if (this.form.valid) {
      this.authService.profileUpload(this.form.value.image).subscribe(url => {
        if (url.ok) {
          this.matSnack.openFromComponent(SuccessSnackComponent, {
            data: 'Profile Picture Updated',
            duration: 1500
          });
          this.imgUrl = url.body;
        } else {
          this.matSnack.openFromComponent(ErrorSnackComponent, {
            data: 'Something went Wrong! \n' + url.statusText,
            duration: 1500
          });
        }
      });
    }
  }

  getUser() {
    return this.authService.getUserName();
  }
}

