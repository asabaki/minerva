import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {QuizService} from '../../services/quiz.service';
import {SuccessSnackComponent} from '../../shared-components/success-snack/success-snack.component';
import {ErrorSnackComponent} from '../../shared-components/error-snack/error-snack.component';

export interface PeriodicElement {
  _id: string;
  title: string;
  description: string;
  noOfQuestions: number;
  privacy: boolean;
  rating: number;
  dom: Date;
  views: number;
  delete: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-my-quiz',
  templateUrl: './my-quiz.component.html',
  styleUrls: ['./my-quiz.component.scss']
})
export class MyQuizComponent implements OnInit {

  columnDef = [
    {def: 'privacy', show: true},
    {def: 'title', show: true},
    {def: 'description', show: true},
    {def: 'noOfQuestions', show: true},
    {def: 'rating', show: true},
    {def: 'dom', show: true},
    {def: 'views', show: true},
    {def: 'delete', show: false}
  ];
  deleteClicked: boolean;
  editClicked: boolean;
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  number_quiz: number;
  constructor(public dialog: MatDialog,
              private router: Router,
              private location: Location,
              private quizService: QuizService,
              private changeDet: ChangeDetectorRef,
              private matSnack: MatSnackBar) {}
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.quizService.get_myquizzes().subscribe(res => {
      ELEMENT_DATA.length = 0;
      this.number_quiz = res.length;
      res.forEach((data) => {
        // console.log(data);
        ELEMENT_DATA.push({
          _id: data._id,
          title: data.title,
          description: data.description,
          noOfQuestions: data.questions.length,
          rating: data.rating,
          views: 0,
          dom: data.updatedAt,
          privacy: data.privacy,
          delete: false
        });
      });
      this.dataSource.sort = this.sort;
      // console.log(ELEMENT_DATA);
    });
  }

  onOpenCreate() {
    this.router.navigate(['quiz/my/create']);
  }

  onClickBack() {
    this.location.back();
  }

  onRowClick(r: any) {
    if (this.deleteClicked) {
      this.deleteClicked = false;
    } else {
      const id = r._id;
      this.router.navigate(['quiz/item/' + id]);
    }
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
    this.quizService.delete_quiz(id).subscribe((res) => {
      console.log(res);
      if (res.ok) {
        this.quizService.get_myquizzes();
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
