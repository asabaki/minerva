import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {McqComponent} from '../create-quiz/mcq/mcq.component';
import {TrueFalseComponent} from '../create-quiz/true-false/true-false.component';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  openAddMcqDialog() {
    const dialogRef = this.dialog.open(McqComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openAddTrueFalseDialog() {
    const dialogRef = this.dialog.open(TrueFalseComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }


  ngOnInit() {
  }

}
