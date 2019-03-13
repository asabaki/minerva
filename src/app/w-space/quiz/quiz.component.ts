import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource, MatDialog, MatPaginator} from '@angular/material';
import {Location} from '@angular/common';
import {CreateQuizComponent} from './my-quiz/create-quiz/create-quiz.component';
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

  displayedColumns: string[] = ['name', 'description', 'numberOfCard'];
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
  trending = [];
  constructor(public dialog: MatDialog,
              private router: Router,
              private qservice: QuizService,
              private location: Location) {
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.qservice.get_allQuizzes().subscribe(res => {
      // console.log(res);

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
        this.trending.push({
          _id: data._id,
          title: data.title,
          description: data.description,
          rating: data.rating,
          views: data.views
          // TODO - Add Creator Name instead of rating
        });
      });
      this.sortByKey(this.trending, 'views');
      this.trending.splice(4);
      console.log(this.trending);
      this.number_quiz = ELEMENT_DATA.length;
      this.isLoaded = true;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    // this.qservice.get_allQuizzes().subscribe(res => {
    // });
    // this.dataSource.sort = this.sort;
  }

  sortByKey(array, key) {
    return array.sort(function(a, b) {
      const x = a[key], y = b[key];
      return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    this.router.navigate(['quiz/item/' + r._id]);
  }


}
