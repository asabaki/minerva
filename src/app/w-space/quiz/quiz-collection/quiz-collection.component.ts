import { Component, OnInit } from '@angular/core';
import {QuizService} from '../../services/quiz.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {Location} from '@angular/common';
import {MatDialog} from '@angular/material';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';


export class QuizCollectionModel {
  _id: string;
  title: string;
  description: string;
  noq: number;
  questions = [];
  creator_id: string;
  creator_name: string;
  privacy: boolean;
  views: number;
  rating: number;
  isFollowing: boolean;
  isTaken: boolean;

}

@Component({
  selector: 'app-quiz-collection',
  templateUrl: './quiz-collection.component.html',
  styleUrls: ['./quiz-collection.component.scss']
})
export class QuizCollectionComponent implements OnInit {

  constructor(private qs: QuizService,
              private route: ActivatedRoute,
              private location: Location,
              public dialog: MatDialog) { }

  ngOnInit() {
    // TODO - Add Creator name, rating, views
    this.route.paramMap.subscribe(params => {
      this.qs.get_quiz(params.get('id')).subscribe(res => {

      });
      // this.qs.get_taken(params.get('id'));
    });
    // this.qs.get_taken()
  }
  onClickBack() {
    this.location.back();
  }
  openConfirmdialog() {
    const dialogRef = this.dialog.open( ConfirmDialogComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
