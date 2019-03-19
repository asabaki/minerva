import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

export interface PeriodicElement {
  position: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1},
  {position: 2},
  {position: 3},
  {position: 4},
  {position: 5},
  {position: 6},
  {position: 7},
  {position: 8},
  {position: 9},
  {position: 9},
  {position: 9},
  {position: 9},
  {position: 10},
];

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})


export class SearchUserComponent implements OnInit {
  displayedColumns: string[] = ['position'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
