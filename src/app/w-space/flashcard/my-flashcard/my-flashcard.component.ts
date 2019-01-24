import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import {CreateFlashcardComponent} from './create-flashcard/create-flashcard.component';
import {AuthService} from '../../services/auth.service';
import {FlashCardService} from '../../services/flash-card.service';
import {Router} from '@angular/router';
import {Observable, Observer, Subscription} from 'rxjs';
import {detectChanges} from '@angular/core/src/render3';
import {ErrorSnackComponent, SuccessSnackComponent} from '../../sign-up/sign-up.component';
import {BarRatingModule} from 'ngx-bar-rating';
import {Location} from '@angular/common';

export interface PeriodicElement {
  _id: string;
  privacy: number;
  title: string;
  description: string;
  numberOfCard: number;
  rating: number;
  dom: Date;
  views: number;
  delete: boolean;
  privacy: boolean;

}

const ELEMENT_DATA: PeriodicElement[] = [];


@Component({

  selector: 'app-flashcard',

  templateUrl: './my-flashcard.component.html',
  styleUrls: ['./my-flashcard.component.scss']
})

export class MyFlashcardComponent implements OnInit {
  // TODO - Figure out sorting ( not working )
  columnDef = [
    {def: 'privacy', show: true},
    {def: 'title', show: true},
    {def: 'description', show: true},
    {def: 'numberOfCard', show: true},
    {def: 'rating', show: true},
    {def: 'dom', show: true},
    {def: 'views', show: true},
    {def: 'delete', show: false}];
  // [ 'name', 'description', 'numberOfCard', 'delete'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  editClicked = false;
  deleteClicked = false;
  data: Observable<Object>;
  isLoading = true;
  number_collection: number;

  constructor(public dialog: MatDialog,
              private matSnack: MatSnackBar,
              private location: Location,
              private auth: AuthService,
              private flash: FlashCardService,
              private router: Router,
              private changeDet: ChangeDetectorRef) {
  }

  @ViewChild(MatSort) sort: MatSort;

  // TODO- Edit data on this page to be observable
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
              rating: i += 0.1,
              views: 0,
              privacy: data.privacy ? 1 : 0,
              dom: data.updatedAt,
              delete: false
            });
          }
        );
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      }
    );

  }

  onClickBack() {
    // this.router.navigate(back)
    this.location.back();
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

  openCreateFlashcardDialog() {
    const dialogRef = this.dialog.open(CreateFlashcardComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onClickEdit() {
    this.editClicked = !this.editClicked;
    this.columnDef[6].show = this.editClicked;

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

  getDisplayedColumn() {
    return this.columnDef
      .filter((def) => def.show)
      .map((def) => def.def);
  }

}
