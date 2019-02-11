import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {ResultDialogComponent} from '../quiz-collection/result-dialog/result-dialog.component';
@Component({
  selector: 'app-quiz-collection',
  templateUrl: './quiz-collection.component.html',
  styleUrls: ['./quiz-collection.component.scss']
})
export class QuizCollectionComponent implements OnInit {

  constructor( public dialog: MatDialog) { }

  ngOnInit() {
  }
  resultDialog() {
    const dialogRef = this.dialog.open(ResultDialogComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
