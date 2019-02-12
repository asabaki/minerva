import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {McqComponent} from './mcq/mcq.component';
import {TrueFalseComponent} from './true-false/true-false.component';
import {MatRadioModule} from '@angular/material/radio';
import {Location} from '@angular/common';
import {QuizService} from '../../../services/quiz.service';

export class QuizModel {
  title: string;
  description: string;
  questions: [{
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
              private location: Location,
              private quizService: QuizService) {
    this.quiz = new QuizModel();
    // this.quiz.questions = [];
  }

  ngOnInit() {

  }

  onCreate(title: string, description: string) {
    this.quiz.title = title;
    this.quiz.description = description;
    this.quizService.add_quiz(this.quiz);
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
