import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { CreateFlashcardComponent } from './create-flashcard/create-flashcard.component';


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
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss']
})

export class FlashcardComponent implements OnInit {
  displayedColumns: string[] = [ 'name', 'description', 'numberOfCard' ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(public dialog: MatDialog) {}
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }
  openCreateFlashcardDialog() {
    const dialogRef = this.dialog.open(CreateFlashcardComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
