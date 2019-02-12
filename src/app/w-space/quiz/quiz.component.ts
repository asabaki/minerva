import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { CreateQuizComponent } from './my-quiz/create-quiz/create-quiz.component';
import {Router} from '@angular/router';

export interface PeriodicElement {
  name: string;
  description: string;
  numberOfCard: number;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Hydrogen', description: 'aaaaaaa', numberOfCard: 2},
  {name: 'Helium', description: 'aaaaaaa', numberOfCard: 20},
  {name: 'Lithium', description: 'aaaaaaa', numberOfCard: 22},
  {name: 'Beryllium', description: 'aaaaaaa', numberOfCard: 13},
  {name: 'Boron', description: 'aaaaaaa', numberOfCard: 30},
  {name: 'Carbon', description: 'aaaaaaa', numberOfCard: 23},
  {name: 'Nitrogen', description: 'aaaaaaa', numberOfCard: 14},
  {name: 'Oxygen', description: 'aaaaaaa', numberOfCard: 99},
  {name: 'Fluorine', description: 'aaaaaaa', numberOfCard: 18},
  {name: 'Neon', description: 'aaaaaaa', numberOfCard: 27},
];
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  displayedColumns: string[] = [ 'name', 'description', 'numberOfCard' ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(public dialog: MatDialog,
              private router: Router) {}
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }


  onMyQuiz() {
    this.router.navigate(['quiz/my/']);
  }
}
