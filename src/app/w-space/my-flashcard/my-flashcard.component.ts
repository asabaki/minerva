import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import {CreateFlashcardComponent} from '../flashcard/create-flashcard/create-flashcard.component';
import {AuthService} from '../services/auth.service';
import {FlashCardService} from '../services/flash-card.service';
import {Router} from '@angular/router';
import {Observable, Observer, Subscription} from 'rxjs';
import {detectChanges} from '@angular/core/src/render3';
import {ErrorSnackComponent, SuccessSnackComponent} from '../sign-up/sign-up.component';
import { BarRatingModule } from 'ngx-bar-rating';

export interface PeriodicElement {
  _id: string;
  title: string;
  description: string;
  numberOfCard: number;
  delete: boolean;

}

const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-my-flashcard2',
  templateUrl: './my-flashcard.component.html',
  styleUrls: ['./my-flashcard.component.scss']
})
export class MyFlashcardComponent implements OnInit {
  columnDef = [{def: 'name', show: true},
  {def: 'description', show: true},
  {def: 'numberOfCard', show: true},
  {def: 'delete', show: false}];
  // [ 'name', 'description', 'numberOfCard', 'delete'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  editClicked = false;
  deleteClicked = false;


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
    this.flash.fetch_collection().subscribe(
      (res) => {
        ELEMENT_DATA.length = 0;
        res.forEach((data) => {
            ELEMENT_DATA.push({
              _id: data._id,
              title: data.title,
              description: data.description,
              numberOfCard: data.numberOfCard,
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
      this.router.navigate(['flash/' + id]);
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
    this.columnDef[3].show = this.editClicked;

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

  onFaoRate(e) {
    this.faoRated = true;
    this.faoRate = e;
  }

  faoReset() {
    this.faoRated = false;
    this.faoRate = 3.6;
  }
}
