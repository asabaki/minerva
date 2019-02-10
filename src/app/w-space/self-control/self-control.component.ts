import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {WebsiteBlockingComponent} from '../self-control/website-blocking/website-blocking.component';
import {MatRadioModule} from '@angular/material/radio';

@Component({
  selector: 'app-self-control',
  templateUrl: './self-control.component.html',
  styleUrls: ['./self-control.component.scss']
})
export class SelfControlComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  openWebBlockingialog() {
    const dialogRef = this.dialog.open(WebsiteBlockingComponent, {panelClass: 'myapp-no-padding-dialog'});
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  ngOnInit() {
  }

}
