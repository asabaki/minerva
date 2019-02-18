import { Component, OnInit } from '@angular/core';
import {QuizService} from '../../services/quiz.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {Location} from '@angular/common';
import {MatDialog} from '@angular/material';
import {ResultDialogComponent} from '../quiz-collection/result-dialog/result-dialog.component';

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

  quiz = new QuizCollectionModel();
  isTaken: boolean = false;
  point = [];
  mark = 0;

  constructor(private qs: QuizService,
              private route: ActivatedRoute,
              private location: Location) { }

  ngOnInit() {
    // TODO - Add Creator name, rating, views
    this.route.paramMap.subscribe(params => {
      this.qs.get_quiz(params.get('id')).subscribe(res => {
        this.qs.get_taken(res.quiz._id).subscribe(taken => {
          console.log(taken > 0);
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
        this.quiz.questions.forEach((question, index) => {
          question.choice = this.shuffle(question.choice);
          this.point[index] = 0;
        });

      });
    });
  }

  onSubmit(f: any) {
    this.mark = 0;
    // TODO - Ask User before submit
    this.quiz.questions.forEach((question, index) => {
      this.point[index] = 0;
      for (let i = 0; i < question.choice.length; i++) {
        if (question.choice[i].answer && i === f.value[index]) {
          this.point[index] = 1;
          this.mark++;
        }
      }
      // TODO - Show Dialog of Mark User gets
    });
    this.quiz.isTaken = true;
    this.qs.taken_quiz(this.quiz._id, this.mark);
  }

  onRetest() {
    // TODO - Ask user to Retest
    this.quiz.isTaken = false;
    this.isTaken = false;
  }
  onClickBack() {
    this.location.back();
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


}
