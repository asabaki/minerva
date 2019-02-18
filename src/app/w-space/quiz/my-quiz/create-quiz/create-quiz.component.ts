import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {McqComponent} from './mcq/mcq.component';
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
  privacyText = 'Only Me';
  constructor(public dialog: MatDialog,
              private location: Location,
              private quizService: QuizService) {
    this.quiz = new QuizModel();
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
  sliding(f: any) {
    this.privacyText = f ? 'Only Me' : 'Publish' ;
  }



}
