import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent  {
  constructor(public dialog: MatDialog) {}

  signUp_dialog() {
    const dialogRef = this.dialog.open(SignUpComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  logIn_dialog() {
    const dialogRef = this.dialog.open(LogInComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
@Component({
  selector: 'app-log-in',
  templateUrl: '../w-space/log-in/log-in.component.html',
  styleUrls: ['../w-space/log-in//log-in.component.scss']
})
export class LogInComponent {}

@Component({
  selector: 'app-sign-up',
  templateUrl: '../w-space/sign-up/sign-up.component.html',
  styleUrls: ['../w-space/sign-up/sign-up.component.scss']
})
export class SignUpComponent {}

