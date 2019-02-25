import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {McqComponent} from './mcq/mcq.component';
import {TrueFalseComponent} from './true-false/true-false.component';
import {MatRadioModule} from '@angular/material/radio';
import {Location} from '@angular/common';
import {QuizService} from '../../../services/quiz.service';
import {Router} from '@angular/router';
import {SuccessSnackComponent} from '../../../shared-components/success-snack/success-snack.component';
import {ErrorSnackComponent} from '../../../shared-components/error-snack/error-snack.component';

export interface QuizModel {
  title: string;
  description: string;
  questions?: [{
    question_text: string,
    choice: [{
      choice_text: string,
      answer: boolean
    }]
  }];
}
// TODO - Add Tips about how choice sequence will be random
// TODO - Add Tips about how to create TRUE/FALSE question
// TODO - Add Publish Button
@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {

  quiz: QuizModel;

  constructor(public dialog: MatDialog,
              private matSnack: MatSnackBar,
              private location: Location,
              private router: Router,
              private quizService: QuizService) {
  }

  ngOnInit() {
    this.quiz = {
      title: '',
      description: '',
      questions: [
        {
          question_text: null,
          choice: [{
            choice_text: null,
            answer: null
          }]
        }
      ]
    };
    this.quiz.questions.pop();
  }

  onCreate(title: string, description: string) {
    this.quiz.title = title;
    this.quiz.description = description;
    this.quizService.add_quiz(this.quiz).subscribe(res => {
      if (res.ok) {
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'Successfully Create Quiz!',
          duration: 1500
        });
        this.router.navigate(['quiz/item/' + res.body._id]);
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'Error: Something Went Wrong!\n' + res.statusText,
          duration: 1500
        });
      }
    });
  }

  onClickBack() {
    this.location.back();
  }

  openAddMcqDialog() {
    const dialogRef = this.dialog.open(McqComponent, {
      panelClass: 'myapp-no-padding-dialog',
      data: {questions: []}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.quiz.questions.push(result[0]);
      console.log(this.quiz);
    });
  }

  openAddTrueFalseDialog() {
    const dialogRef = this.dialog.open(TrueFalseComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }


}
