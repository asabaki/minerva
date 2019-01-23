import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import {AuthService} from '../services/auth.service';
import {FlashCardService} from '../services/flash-card.service';
import {Router} from '@angular/router';

export interface PeriodicElement {
  _id: string;
  title: string;
  description: string;
  numberOfCard: number;
  rating: number;
  dom: Date;
  views: number;
  delete: boolean;

}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-my-flashcard2',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss']
})
export class FlashcardComponent implements OnInit {
  columnDef = [{def: 'title', show: true},
    {def: 'description', show: true},
    {def: 'rating', show: true},
    {def: 'dom', show: true},
    {def: 'views', show: true}];
  // [ 'name', 'description', 'numberOfCard', 'delete'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  editClicked = false;
  deleteClicked = false;
  number_collection: number

  bootRate = 1;
  faRate = 1;
  cssRate = 1;
  faoRate = 2;
  faoRated = false;


  constructor(public dialog: MatDialog,
              private matSnack: MatSnackBar,
              private auth: AuthService,
              private flash: FlashCardService,
              private router: Router,
              private changeDet: ChangeDetectorRef) {
  }

  @ViewChild(MatSort) sort: MatSort;

  // TODO- Edit data on this page to be observable
  ngOnInit() {
    let i = 0;
    this.flash.fetch_collection_all().subscribe(
      (res) => {
        ELEMENT_DATA.length = 0;
        this.number_collection = res.length;
        res.forEach((data) => {
            ELEMENT_DATA.push({
              _id: data._id,
              title: data.title,
              description: data.description,
              numberOfCard: data.numberOfCard,
              rating: i += 0.1,
              views: 0,
              dom: data.updatedAt,
              delete: false
            });
          }
        );
        this.dataSource.sort = this.sort;
      }
    );

  }

  onRowClick(r: any) {
    if (this.deleteClicked) {
      this.deleteClicked = false;
    } else {
      const id = r._id;
      this.router.navigate(['flash/item/' + id]);
    }

    // console.log(r);
  }

  getDisplayedColumn() {
    return this.columnDef
      .filter((def) => def.show)
      .map((def) => def.def);
  }

  onFaoRate(e) {
    this.faoRated = true;
    this.faoRate = e;
  }

  faoReset() {
    this.faoRated = false;
    this.faoRate = 3.6;
  }

  onMyFlashcard() {
    this.router.navigate(['flash/my/']);
  }
}
