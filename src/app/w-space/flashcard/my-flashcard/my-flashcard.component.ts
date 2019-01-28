import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import {AuthService} from '../../services/auth.service';
import {FlashCardService} from '../../services/flash-card.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {ErrorSnackComponent, SuccessSnackComponent} from '../../sign-up/sign-up.component';
import {CreateFlashcardComponent} from './create-flashcard/create-flashcard.component';

export interface PeriodicElement {
  _id: string;
  title: string;
  description: string;
  numberOfCard: number;
  privacy: boolean;
  rating: number;
  dom: Date;
  views: number;
  delete: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-my-flashcard',
  templateUrl: './my-flashcard.component.html',
  styleUrls: ['./my-flashcard.component.scss']
})
export class MyFlashcardComponent implements OnInit {
  columnDef = [
    {def: 'privacy', show: true},
    {def: 'title', show: true},
    {def: 'description', show: true},
    {def: 'numberOfCard', show: true},
    {def: 'rating', show: true},
    {def: 'dom', show: true},
    {def: 'views', show: true},
    {def: 'delete', show: false}
    ];
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
              private location: Location,
              private flash: FlashCardService,
              private router: Router,
              private changeDet: ChangeDetectorRef) {
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    let i = 0;
    this.flash.fetch_collection().subscribe(
      (res) => {
        ELEMENT_DATA.length = 0;
        this.number_collection = res.length;
        res.forEach((data) => {
            ELEMENT_DATA.push({
              _id: data._id,
              title: data.title,
              description: data.description,
              numberOfCard: data.numberOfCard,
              rating: i += 0.5,
              views: 0,
              dom: data.updatedAt,
              privacy: data.privacy,
              delete: false
            });
          }
        );
        this.dataSource.sort = this.sort;
      }
    );

  }

  onClickBack() {
    // this.router.navigate(back)
    this.location.back();
  }

  openCreateFlashcardDialog() {
    const dialogRef = this.dialog.open(CreateFlashcardComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
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

  onClickEdit() {
    this.editClicked = !this.editClicked;
    this.columnDef
      .filter( (def) => def.def === 'delete')
      .map(def => def.show = this.editClicked);

  }

  onClickDelete(r: any) {
    this.deleteClicked = true;
    const id = r._id;
    this.flash.delete_collection(id).subscribe((res) => {
      console.log(res);
      if (res.ok) {
        this.flash.fetch_collection();
        this.changeDet.detectChanges();
        this.matSnack.openFromComponent(SuccessSnackComponent,
          {
            data: 'Delete Collection Success!',
            duration: 1500
          });
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'Something Error! Please Contact Support\n' + 'Error: ' + res.statusText,
          duration: 1500
        });
      }
    });
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
}
