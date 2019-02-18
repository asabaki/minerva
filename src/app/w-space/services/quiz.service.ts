import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {QuizModel} from '../quiz/my-quiz/create-quiz/create-quiz.component';
import {AuthService} from './auth.service';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {ErrorSnackComponent} from '../sign-up/sign-up.component';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  myQuizzes_subject = new Subject<any>(); // *** MY QUIZ COLLECTIONS
  myQuizzes_subject_delete = new Subject<any>(); // ** DELETED QUIZ
  myQuiz_subject_create = new Subject<any>(); // *** CREATED QUIZ
  quiz_subject = new Subject<any>(); // *** QUIZ COLLECTION
  all_quizzes_subject = new Subject<any>(); // *** ALL QUIZ COLLECTIONS
  quiz_taken_subject = new Subject<any>();
  constructor(private http: HttpClient,
              private authService: AuthService,
              private matSnack: MatSnackBar) {
  }

  get_allQuizzes() {
    this.http.get('http://localhost:3000/api/quiz/get/all_quizzes', {
      observe: 'response'
    }).subscribe(res => {
      if (res.ok) {
        this.all_quizzes_subject.next(res.body);
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          duration: 1500,
          data: 'Error: Something Went Wrong!\n' + res.statusText
        });
      }
    });
    return this.all_quizzes_subject.asObservable();
  }

  get_myquizzes() {
    this.http.get('http://localhost:3000/api/quiz/get/my_quizzes', {
      observe: 'response'
    }).subscribe(res => {
      this.myQuizzes_subject.next(res.body);
      // console.log(res);
    });
    return this.myQuizzes_subject.asObservable();
  }

  get_quiz(id: string) {
    this.http.get('http://localhost:3000/api/quiz/get/quiz', {
      params: new HttpParams().set('id', id),
      observe: 'response'
    }).subscribe(res => {
      this.quiz_subject.next(res.body);
      // console.log(res);
    });
    return this.quiz_subject.asObservable();
  }

  get_taken(id: string) {
    this.http.get('http://localhost:3000/api/quiz/get/quiz_taken', {
      params: new HttpParams().set('id', id),
      observe: 'response'
    }).subscribe(res => {
      // console.log(res);
      this.quiz_taken_subject.next(res.body);
    });
    return this.quiz_taken_subject.asObservable();
  }

  add_quiz(q: QuizModel) {
    // console.log(q);
    this.http.post('http://localhost:3000/api/quiz/add', q, {observe: 'response'}).subscribe(res => {
      if (res.ok) {
        this.myQuiz_subject_create.next(res);
      }
    });
    return this.myQuiz_subject_create.asObservable();
  }

  taken_quiz(id: string, score: number) {
    this.http.patch('http://localhost:3000/api/quiz/taken/' + id, {score}, { observe: 'response'}).subscribe(res => {
      console.log(res.body);
      this.quiz_taken_subject.next(res.body);
    });
    return this.quiz_taken_subject.asObservable();
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
