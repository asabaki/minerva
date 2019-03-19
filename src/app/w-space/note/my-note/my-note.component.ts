import {Component, OnInit, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import {SuccessSnackComponent} from '../../shared-components/success-snack/success-snack.component';
import {ErrorSnackComponent} from '../../shared-components/error-snack/error-snack.component';
import {Router} from '@angular/router';
import {NoteService} from '../../services/note.service';
import {MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';


export interface PeriodicElement {
  _id: string;
  title: string;
  description: string;
  privacy: boolean;
  rating: number;
  dom: Date;
  views: number;
  delete: boolean;
}
const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-my-note',
  templateUrl: './my-note.component.html',
  styleUrls: ['./my-note.component.scss']
})
export class MyNoteComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  columnDef = [
    {def: 'privacy', show: true},
    {def: 'title', show: true},
    {def: 'description', show: true},
    {def: 'rating', show: true},
    {def: 'dom', show: true},
    {def: 'views', show: true},
    {def: 'delete', show: false}
  ];

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  editClicked = false;
  deleteClicked = false;
  number_notes: number;
  isLoaded = false;
  bootRate = 1;
  faRate = 1;
  cssRate = 1;
  faoRate = 2;
  faoRated = false;

  constructor(private location: Location,
              private router: Router,
              private noteService: NoteService,
              private matSnack: MatSnackBar) { }

  ngOnInit() {

    this.noteService.getMyNote().subscribe(res => {
      // console.log(res);
      ELEMENT_DATA.length = 0;
      this.number_notes = res.length;
      res.forEach((data) => {
          ELEMENT_DATA.push({
            _id: data._id,
            title: data.title,
            description: data.description,
            rating: data.rating,
            views: data.views,
            dom: data.updatedAt,
            privacy: data.privacy,
            delete: false
          });
        }
      );
      this.dataSource.sort = this.sort;
    });
    this.isLoaded = true;
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
      this.router.navigate(['note/item/' + id]);
    }
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
    // this.flash.delete_collection(id).subscribe((res) => {
    //   if (res.ok) {
    //     // this.flash.fetch_collection();
    //     // this.changeDet.detectChanges();
    //     this.matSnack.openFromComponent(SuccessSnackComponent,
    //       {
    //         data: 'Delete Collection Success!',
    //         duration: 1500
    //       });
    //   } else {
    //     this.matSnack.openFromComponent(ErrorSnackComponent, {
    //       data: 'Something Error! Please Contact Support\n' + 'Error: ' + res.statusText,
    //       duration: 1500
    //     });
    //   }
    // });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
