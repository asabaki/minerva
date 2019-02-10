import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

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
  selector: 'app-my-quiz',
  templateUrl: './my-quiz.component.html',
  styleUrls: ['./my-quiz.component.scss']
})
export class MyQuizComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'description', 'numberOfCard' ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(public dialog: MatDialog,
              private router: Router,
              private location: Location) {}
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  onOpenCreate() {
    this.router.navigate(['quiz/my/create']);
  }

  onClickBack() {
    this.location.back();
  }

}
