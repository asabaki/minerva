import {Component, OnInit} from '@angular/core';
import {QuizService} from '../../services/quiz.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {Location} from '@angular/common';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {ResultDialogComponent} from './result-dialog/result-dialog.component';
import {first, take} from 'rxjs/operators';
import {AuthService} from '../../services/auth.service';
import {ErrorSnackComponent} from '../../shared-components/error-snack/error-snack.component';
import {SuccessSnackComponent} from '../../shared-components/success-snack/success-snack.component';


export class QuizCollectionModel {
  _id: string;
  title: string;
  description: string;
  noq: number;
  questions = [];
  creator_id: string;
  creator_name: string;
  privacy: boolean;
  views: number;
  rating: number;
  isFollowing: boolean;
  isTaken: boolean;

}

@Component({
  selector: 'app-quiz-collection',
  templateUrl: './quiz-collection.component.html',
  styleUrls: ['./quiz-collection.component.scss']
})
export class QuizCollectionComponent implements OnInit {
  bootRate = 1;
  faRate = 1;
  cssRate = 1;
  faoRate = 2;
  faoRated = false;
  quiz = new QuizCollectionModel();
  isTaken: boolean = false;
  point = [];
  mark = 0;
  startQuiz = false;
  dialogRef: MatDialogRef<ConfirmDialogComponent> = null;
  isFollowing: boolean;
  creator: string;
  editable = false;
  saveBtn = true;
  slide = true;

  // arr: Array<number>;


  constructor(private qs: QuizService,
              private route: ActivatedRoute,
              private location: Location,
              public dialog: MatDialog,
              private authService: AuthService,
              private matSnack: MatSnackBar) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.qs.get_quiz(params.get('id')).subscribe(res => {
        this.qs.get_taken(res.quiz._id).subscribe(taken => {
          // console.log(taken > 0);
          this.mark = taken.score;
          this.isTaken = !!taken;
          // console.log(taken);
        });
        this.quiz = {
          _id: res.quiz._id,
          title: res.quiz.title,
          description: res.quiz.description,
          noq: res.quiz.questions.length,
          questions: res.quiz.questions,
          creator_id: res.creator._id,
          creator_name: res.creator.name,
          privacy: res.quiz.privacy,
          views: res.quiz.views,
          rating: res.quiz.rating,
          isFollowing: false,
          isTaken: false

        };
        this.faoRate = this.quiz.rating;
        this.qs.getRated(this.quiz._id).subscribe(rated => {
          this.faoRated = !!rated.body;
        });
        this.authService.isFollowing(localStorage.getItem('userId'), this.quiz.creator_id)
          .subscribe(fol => {
            this.isFollowing = fol;
          });
        this.quiz.questions.forEach((question, index) => {
          question.choice = this.shuffle(question.choice);
          this.point[index] = 0;
        });

      });
    });
  }

  toggleSlide() {
    this.editable = !this.editable;
    this.saveBtn = !this.saveBtn;
    this.slide =!this.slide;
  }

  onClickBack() {
    this.location.back();
  }

  onSubmit(f: any) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {mssg: 'Are you sure that you want to submit ?', type: 'caution'},
      panelClass: 'myapp-no-padding-dialog'
    });
    confirmDialog.afterClosed().pipe(first()).subscribe(yon => {
      if (yon) {
        this.mark = 0;
        this.quiz.questions.forEach((question, index) => {
          this.point[index] = 0;
          for (let i = 0; i < question.choice.length; i++) {
            if (question.choice[i].answer && i === f.value[index]) {
              this.point[index] = 1;
              this.mark++;
            }
          }
        });
        // this.dialog.open(ResultDialogComponent);
        this.quiz.isTaken = true;
        this.qs.taken_quiz(this.quiz._id, this.mark);
      } else {
      }
    });
  }

  onRetest() {
    const retest = this.dialog.open(ConfirmDialogComponent, {
      data: {mssg: 'Are you sure that you want to re-test ?', type: 'caution'},
      panelClass: 'myapp-no-padding-dialog'
    });
    retest.afterClosed().pipe(first()).subscribe(res => {
      this.dialogRef = null;
      if (res) {
        this.quiz.isTaken = false;
        this.isTaken = false;
      }
    });
  }

  onStartQuiz() {
    this.startQuiz = !this.startQuiz;
  }

  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  onFaoRate(e) {
    this.qs.rate_collection(this.quiz._id, e).subscribe(r => {
      if (r.ok) {
        this.faoRated = true;
        this.qs.getRated(this.quiz._id).subscribe(rated => this.faoRated = rated.body);
        this.faoRate = r.body.cards.rating;
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'Submitted\n Thank you for your feedback!',
          duration: 1500
        });
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'Something went wrong!\n' + r.statusText,
          duration: 1500
        });
      }
    });
  }

  faoReset() {
    this.qs.unrate_collection(this.quiz._id);
  }

  isCreator() {
    return localStorage.getItem('userId') === this.quiz.creator_id;
  }

  onFollow(id: string) {
    this.authService.followUser(id).subscribe(res => {
      if (res !== -1 ) {
        this.isFollowing = true;
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'You successfully follow ' + this.quiz.creator_name,
          duration: 1500
        });
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'You have already follow this user!',
          duration: 1500
        });
      }
    });
  }

  onUnfollow(id: string) {
    this.authService.unfollowUser(id).subscribe(res => {
      if (res !== -1 ) {
        this.isFollowing = false;
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'You successfully unfollow ' + this.quiz.creator_name,
          duration: 1500
        });
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'You have already unfollow this user!',
          duration: 1500
        });
      }
    });
  }

}
