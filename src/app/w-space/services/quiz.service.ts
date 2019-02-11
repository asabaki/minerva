import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {QuizModel} from '../quiz/my-quiz/create-quiz/create-quiz.component';
import {AuthService} from './auth.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  myQuizzes_subject = new Subject<any>();
  myQuizzes_subject_delete = new Subject<any>();
  quiz_subject = new Subject<any>();
  constructor(private http: HttpClient,
              private authService: AuthService) { }

  get_myquizzes() {
    this.http.get('http://localhost:3000/api/quiz/get/my_quizzes', {
      observe: 'response'
    }).subscribe(res => {
      this.myQuizzes_subject.next(res.body);
      console.log(res);
    });
    return this.myQuizzes_subject.asObservable();
  }

  get_quiz(id: string) {
    this.http.get('http://localhost:3000/api/quiz/get/quiz', {
      params: new HttpParams().set('id', id),
      observe: 'response'
    }).subscribe(res => {
      this.quiz_subject.next(res.body);
      console.log(res);
    });
    return this.quiz_subject.asObservable();
  }
  get_taken(id: string) {
    this.http.get('http://localhost:3000/api/quiz/get/quiz_taken', {
      params: new HttpParams().set('id', id),
      observe: 'response'
    }).subscribe(res => {
      console.log(res);
    });
  }

  add_quiz(q: QuizModel) {
    console.log(q);
    this.http.post('http://localhost:3000/api/quiz/add', q , { observe: 'response'}).subscribe(res => {
      console.log(res);
    });
  }

  delete_quiz(id: string) {
    this.http.delete('http://localhost:3000/api/quiz/delete/',
      {
        params: new HttpParams().set('id', id),
        observe: 'response'
      }).subscribe((response) => this.myQuizzes_subject_delete.next(response));
    return this.myQuizzes_subject_delete.asObservable();
  }
}
