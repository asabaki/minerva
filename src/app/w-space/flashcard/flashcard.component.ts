import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource, MatDialog} from '@angular/material';
import {CreateFlashcardComponent} from './create-flashcard/create-flashcard.component';
import {AuthService} from '../services/auth.service';
import {FlashCardService} from '../services/flash-card.service';

export interface PeriodicElement {
  title: string;
  description: string;
  numberOfCard: number;

}

const ELEMENT_DATA: PeriodicElement[] = [];


@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss']
})

export class FlashcardComponent implements OnInit {
  displayedColumns: string[] = [ 'name', 'description', 'numberOfCard'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  // dataSource = new TableDataSource(this.flash);

  constructor(public dialog: MatDialog,
              private auth: AuthService,
              private flash: FlashCardService) {
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.flash.fetchCol().subscribe(
      (res) => {
        ELEMENT_DATA.length = 0;
        res.forEach((data) => {
            ELEMENT_DATA.push({
              title: data.title,
              description: data.description,
              numberOfCard: data.numberOfCard
            });
          }
        );
        this.dataSource.sort = this.sort;
      }
    );

  }


  openCreateFlashcardDialog() {
    const dialogRef = this.dialog.open(CreateFlashcardComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
