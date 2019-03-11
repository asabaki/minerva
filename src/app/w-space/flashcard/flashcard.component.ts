import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource, MatDialog, MatSnackBar, MatPaginator} from '@angular/material';
import {AuthService} from '../services/auth.service';
import {FlashCardService} from '../services/flash-card.service';
import {Router} from '@angular/router';
import {TutorialVideoComponent} from '../shared-dialog/tutorial-video/tutorial-video.component';

export interface PeriodicElement {
  position;
  _id: string;
  author: string;
  title: string;
  description: string;
  numberOfCard: number;
  rating: number;
  dom: Date;
  views: number;
  daysUpdated: string;

}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-my-flashcard2',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss']
})
export class FlashcardComponent implements OnInit {

  columnDef = [
    {def: 'title', show: true},
    {def: 'author', show: true},
    {def: 'description', show: true},
    {def: 'rating', show: true},
    {def: 'dom', show: true},
    {def: 'views', show: true}];
  // [ 'name', 'description', 'numberOfCard', 'delete'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  editClicked = false;
  deleteClicked = false;
  number_collection: number;
  isLoaded = false;
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
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    let i = 0;
    this.flash.fetch_collection_all().subscribe(
      (res) => {
        ELEMENT_DATA.length = 0;
        this.number_collection = res.length;
        res.forEach((data) => {
            const lastUpdated = Math.floor(Math.abs(new Date(data.updatedAt).getTime() - new Date(Date.now()).getTime()) / (1000 * 60));
            ELEMENT_DATA.push({
              position: ++i,
              _id: data._id,
              author: data.author,
              title: data.title,
              description: data.description,
              numberOfCard: data.numberOfCard,
              rating: data.rating,
              views: 0,
              dom: data.updatedAt,
              daysUpdated: lastUpdated > 60 ? (lastUpdated > 1440 ? (lastUpdated > 43800 ? (lastUpdated > 525600 ? Math.round(lastUpdated / 525600) + ' years ago' : Math.round(lastUpdated / 43800) + ' months ago') : Math.round(lastUpdated / 1440) + ' days ago') : Math.round(lastUpdated / 60) + ' hours ago') : lastUpdated + ' minutes ago',
            });
          }
        );
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.isLoaded = true;
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  onOpenVideo() {
    this.dialog.open(TutorialVideoComponent, {
      panelClass: 'myapp-no-padding-dialog'
    });
  }
}
