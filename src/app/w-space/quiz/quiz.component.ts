import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { CreateQuizComponent } from './my-quiz/create-quiz/create-quiz.component';
import {Router} from '@angular/router';
import {QuizService} from '../services/quiz.service';

export interface PeriodicElement {
  _id: string;
  title: string;
  description: string;
  noOfQuestions: number;
  rating: number;
  dom: Date;
  views: number;
  delete: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  displayedColumns: string[] = [ 'name', 'description', 'numberOfCard' ];
  columnDef = [
    {def: 'title', show: true},
    {def: 'description', show: true},
    {def: 'noOfQuestions', show: true},
    {def: 'rating', show: true},
    {def: 'dom', show: true},
    {def: 'views', show: true},
    {def: 'delete', show: false}
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  number_quiz: number;
  isLoaded = false;
  constructor(public dialog: MatDialog,
              private router: Router,
              private qservice: QuizService,
              private location: Location) {}

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.qservice.get_allQuizzes().subscribe(res => {
      ELEMENT_DATA.length = 0;
      res.forEach(data => {
        ELEMENT_DATA.push({
          _id: data._id,
          title: data.title,
          description: data.description,
          noOfQuestions: data.questions.length,
          rating: data.rating,
          views: data.views,
          dom: data.lastUpdated,
          delete: false
        });
      });
      this.dataSource.sort = this.sort;
      console.log(ELEMENT_DATA);
      this.isLoaded = true;
    });
    // this.dataSource.sort = this.sort;
  }


  onMyQuiz() {
    this.router.navigate(['quiz/my/']);
  }

  onClickBack() {
    this.location.back();
  }

  getDisplayedColumn() {
    return this.columnDef
      .filter((def) => def.show)
      .map((def) => def.def);
  }

  onRowClick(r: any) {
    console.log(r);
    this.router.navigate(['quiz/item/' + r._id]);
  }


}
