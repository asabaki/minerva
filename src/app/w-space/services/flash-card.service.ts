import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {FlashModel} from './flash_collection.model';

@Injectable({
  providedIn: 'root'
})
export class FlashCardService {

  subject = new Subject<any>();
  addSubject = new Subject<string>();
  cardSubject = new Subject<any>();
  collectionId: string;

  constructor(private http: HttpClient,
              private auth: AuthService) {
  }

  createCollection(title: string, description: string) {
    if (this.auth.getIsAuth()) {
      const userId = localStorage.getItem('userId');
      const card = {title, description, userId};
      this.http.post<any>('http://localhost:3000/api/flash/add', card).subscribe(
        (res) => {
          console.log(res);
          this.collectionId = res._id;
        },
        (err) => {
          console.log(err);
        }
      );
      // console.log(title, description);
    }
  }

  fetchCol() {
    const userId = localStorage.getItem('userId');
    this.http.get<FlashModel[]>('http://localhost:3000/api/flash/fetch/' + userId)
      .pipe(map(res => {
        const ret = [];
        res.forEach((collection) => {
          ret.push({
            _id: collection._id,
            title: collection.title,
            description: collection.description,
            numberOfCard: collection.card.length
          });
        });
        return ret;
      }))
      .subscribe((res) => {
        this.subject.next(res);
      });
    return this.subject.asObservable();
  }

  fetchCard(id: string) {
    this.http.get('http://localhost:3000/api/flash/pull/' + id).subscribe((response) => {
      // console.log(response);
      this.cardSubject.next(response);
    });
    return this.cardSubject.asObservable();
  }

  addCard(front: string, back: string) {
    if (this.collectionId && this.auth.getIsAuth()) {
      const card = {front, back};
      this.http.post<any>('http://localhost:3000/api/flash/add/' + this.collectionId, card).subscribe((res) => {
        if (res.status === 'ok') {
          this.addSubject.next('ok');
        } else {
          this.addSubject.next(res.message);
          // return res.message;
        }
      });
    } else {
      this.addSubject.next('Error');
    }
    return this.addSubject.asObservable();
  }
}
