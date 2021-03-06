import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {QuizModel} from '../quiz/my-quiz/create-quiz/create-quiz.component';
import {AuthService} from './auth.service';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../../environments/environment';
import {ErrorSnackComponent} from '../shared-components/error-snack/error-snack.component';
import {SuccessSnackComponent} from '../shared-components/success-snack/success-snack.component';
import {Socket} from 'ngx-socket-io';
const BACKEND_URL = environment.apiUrl + '/quiz/';
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
  rated_subject = new Subject<any>();
  rate_update_subject = new Subject<any>();
  quiz_update_subject = new Subject<any>();
  constructor(private http: HttpClient,
              private authService: AuthService,
              private matSnack: MatSnackBar,
              private socket: Socket) {
  }

  get_allQuizzes() {
    this.http.get<any>(BACKEND_URL + 'get/all_quizzes', {
      observe: 'response'
    }).subscribe(res => {
      // console.log(res)
      const returnVal = [];
      if (res.ok) {
        res.body.quizzes.forEach((quiz, index) => {
          returnVal.push({
            _id: quiz._id,
            author: res.body.creators[index],
            title: quiz.title,
            description: quiz.description,
            noq: quiz.questions.length,
            updatedAt: quiz.lastUpdated,
            rating: quiz.rating,
            views: quiz.views
          });
        });
        this.all_quizzes_subject.next(returnVal);
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
    this.http.get(BACKEND_URL + 'get/my_quizzes', {
      observe: 'response'
    }).subscribe(res => {
      this.myQuizzes_subject.next(res.body);
    });
    return this.myQuizzes_subject.asObservable();
  }

  get_quiz(id: string) {
    this.http.get(BACKEND_URL + 'get/quiz', {
      params: new HttpParams().set('id', id),
      observe: 'response'
    }).subscribe(res => {
      this.quiz_subject.next(res.body);
      // console.log(res);
    });
    return this.quiz_subject.asObservable();
  }

  get_taken(id: string) {
    this.http.get(BACKEND_URL + 'get/quiz_taken', {
      params: new HttpParams().set('id', id),
      observe: 'response'
    }).subscribe(res => {
      // console.log(res);
      this.quiz_taken_subject.next(res.body);
    });
    return this.quiz_taken_subject.asObservable();
  }

  getRated(id: string) {
    this.http.get(BACKEND_URL + 'rate/' + id, {observe: 'response'}).subscribe(res => {
      this.rated_subject.next(res);
    });
    return this.rated_subject.asObservable();
  }

  getRating(id: string) {
    this.http.get(BACKEND_URL + 'rate', {
      params: new HttpParams().set('id', id),
      observe: 'response'
    }).subscribe(res => {

    });
  }

  add_quiz(q: QuizModel) {
    // console.log(q);
    this.http.post<any>(BACKEND_URL + 'add', q, {observe: 'response'}).subscribe(res => {
      if (res.ok) {
        if (!res.body.privacy) {
          this.socket.emit('create', {
            user_id: localStorage.getItem('userId'),
            item: 'quiz',
            item_id: res.body._id
          });
        }
        this.myQuiz_subject_create.next(res);
      }
    });
    return this.myQuiz_subject_create.asObservable();
  }

  taken_quiz(id: string, score: number) {
    this.http.patch(BACKEND_URL + 'taken/' + id, {score}, { observe: 'response'}).subscribe(res => {
      this.quiz_taken_subject.next(res.body);
    });
    return this.quiz_taken_subject.asObservable();
  }

  delete_quiz(id: string) {
    this.http.delete(BACKEND_URL + 'delete/',
      {
        params: new HttpParams().set('id', id),
        observe: 'response'
      }).subscribe((response) => this.myQuizzes_subject_delete.next(response));
    return this.myQuizzes_subject_delete.asObservable();
  }

  rate_collection(id: string, rate: number) {
    this.http.patch(BACKEND_URL + 'rate', {rate, id}, {observe: 'response'}).subscribe(res => {
      if (res.ok) {
        this.rate_update_subject.next(res);
      }
    });
    return this.rate_update_subject.asObservable();
  }

  unrate_collection(id: string) {
    this.http.patch(BACKEND_URL + 'unrate', {id}, {observe: 'response'}).subscribe(res => {
      if (res.ok) {
        this.rate_update_subject.next(res);
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'You Have Unrated This Quiz',
          duration: 1500
        });
      }
    }, err => {
      this.matSnack.openFromComponent(ErrorSnackComponent, {
        data: 'Something went wrong\n' + err.statusText,
        duration: 1500
      });
    });
  }

  update_quiz(quiz: any) {
    this.http.patch<any>(BACKEND_URL + 'update', quiz, {observe: 'response'}).subscribe(res => {
      this.quiz_subject.next(res.body);
      if (!res.body.privacy) {
        this.socket.emit('update', {
          user_id: localStorage.getItem('userId'),
          item: 'quiz',
          item_id: res.body._id
        });
      }
      this.quiz_update_subject.next(res.ok);
    });
    return this.quiz_update_subject.asObservable();
  }
}
