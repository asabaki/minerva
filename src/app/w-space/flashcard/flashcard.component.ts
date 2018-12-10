import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { CreateFlashcardComponent } from './create-flashcard/create-flashcard.component';


export interface PeriodicElement {
  name: string;
  description: string;
  numberOfCard: number;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Hydrogen', description: 'aaaaaaa', numberOfCard: 1.0079},
  {name: 'Helium', description: 'aaaaaaa', numberOfCard: 4.0026},
  {name: 'Lithium', description: 'aaaaaaa', numberOfCard: 6.941},
  {name: 'Beryllium', description: 'aaaaaaa', numberOfCard: 9.0122},
  {name: 'Boron', description: 'aaaaaaa', numberOfCard: 10.811},
  {name: 'Carbon', description: 'aaaaaaa', numberOfCard: 12.0107},
  {name: 'Nitrogen', description: 'aaaaaaa', numberOfCard: 14.0067},
  {name: 'Oxygen', description: 'aaaaaaa', numberOfCard: 15.9994},
  {name: 'Fluorine', description: 'aaaaaaa', numberOfCard: 18.9984},
  {name: 'Neon', description: 'aaaaaaa', numberOfCard: 20.1797},
];


@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss']
})

export class FlashcardComponent implements OnInit {
  displayedColumns: string[] = ['numberOfCard', 'name', 'description' ];
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
