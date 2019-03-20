import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {AuthService} from '../services/auth.service';
import {FlashCardService} from '../services/flash-card.service';
import {Router} from '@angular/router';
import {NoteService} from '../services/note.service';

export interface PeriodicElement {
  _id: string;
  position: number;
  author: string;
  title: string;
  description: string;
  rating: number;
  dom: Date;
  views: number;
  daysUpdated: string;

}

const ELEMENT_DATA: PeriodicElement[] = [];


@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
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
  number_notes: number;

  bootRate = 1;
  faRate = 1;
  cssRate = 1;
  faoRate = 2;
  faoRated = false;
  trending = [];
  isLoaded = false;
  constructor(public dialog: MatDialog,
              private matSnack: MatSnackBar,
              private auth: AuthService,
              private noteService: NoteService,
              private router: Router,
              private changeDet: ChangeDetectorRef) {
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    let i = 0;
    this.noteService.allNotes().subscribe(
      (res) => {
        ELEMENT_DATA.length = 0;
        this.number_notes = res.length;
        res.forEach((data) => {
            const lastUpdated = Math.floor(Math.abs(new Date(data.updatedAt).getTime() - new Date(Date.now()).getTime()) / (1000 * 60));
            ELEMENT_DATA.push({
              position: ++i,
              _id: data._id,
              author: data.author,
              title: data.title,
              description: data.description,
              rating: data.rating,
              views: data.views,
              dom: data.updatedAt,
              daysUpdated: lastUpdated > 60 ? (lastUpdated > 1440 ? (lastUpdated > 43800 ? (lastUpdated > 525600 ? Math.round(lastUpdated / 525600) + ' years ago' : Math.round(lastUpdated / 43800) + ' months ago') : Math.round(lastUpdated / 1440) + ' days ago') : Math.round(lastUpdated / 60) + ' hours ago') : lastUpdated + ' minutes ago',
            });
            this.trending.push({
              _id: data._id,
              creator: data.author,
              title: data.title,
              description: data.description,
              rating: data.rating,
              views: data.views
            });
          }
        );
        this.sortByKey(this.trending, 'views');
        this.trending.splice(4);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.isLoaded = true;
      }
    );
    console.log(ELEMENT_DATA);
  }

  sortByKey(array, key) {
    return array.sort(function(a, b) {
      const x = a[key], y = b[key];
      return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
  }

  onRowClick(r: any) {
    if (this.deleteClicked) {
      this.deleteClicked = false;
    } else {
      const id = r._id;
      // console.log(r);
      this.router.navigate(['note/item/' + id]);
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

  onMyNote() {
    this.router.navigate(['flash/my/']);
  }

  onOpenCreate() {
    this.router.navigate(['note/my/create']);
  }
}

