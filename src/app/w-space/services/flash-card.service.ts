import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {FlashModel} from './flash_collection.model';
import {RequestOptions} from '@angular/http';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FlashCardService {

  subject = new Subject<any>();
  addSubject = new Subject<any>();
  cardSubject = new Subject<any>();
  collectionId: string;
  index: number;

  constructor(private http: HttpClient,
              private auth: AuthService,
              private route: ActivatedRoute) {
  }

  create_collection(title: string, description: string) {
    if (this.auth.getIsAuth()) {
      const userId = localStorage.getItem('userId');
      const card = {title, description, userId};
      this.http.post<any>('http://localhost:3000/api/flash/add', card).subscribe(
        (res) => {
          this.collectionId = res._id;
        },
        (err) => {
          console.log(err);
        }
      );
      // console.log(title, description);
    }
  }

  fetch_collection() {
    const userId = localStorage.getItem('userId');
    this.http.get<FlashModel[]>('http://localhost:3000/api/flash/fetch/' + userId, {observe: 'response'})
      .pipe(map(res => {
        // console.log(res);
        const ret = [];
        if (res.status === 200) {
          res.body.forEach((collection) => {
            ret.push({
              _id: collection._id,
              title: collection.title,
              description: collection.description,
              numberOfCard: collection.card.length
            });
          });
        } else {
          ret.push('err');
        }
        return ret;

      }))
      .subscribe((res) => {
        this.subject.next(res);
      });
    return this.subject.asObservable();
  }

  fetch_card(id: string) {
    this.http.get('http://localhost:3000/api/flash/pull/' + id, {observe: 'response'}).subscribe((response) => {
      // console.log(response);
      this.cardSubject.next(response);
    });
    return this.cardSubject.asObservable();
  }

  getIndex() {
    return this.index;
  }
  delete_card(id: string) {
    this.http.delete('http://localhost:3000/api/flash/delete',
      {
        params: new HttpParams().set('id', id),
        observe: 'response'
      }).subscribe((response) => {
      this.cardSubject.next(response);
    });
    return this.cardSubject.asObservable();
  }

  add_card(front: string, back: string) {
    if (this.collectionId && this.auth.getIsAuth()) {
      const card = {front, back};
      this.http.post<any>('http://localhost:3000/api/flash/add/' + this.collectionId, card, {observe: 'response'}).subscribe((res) => {
        if (res.ok) {
          console.log(res);
          this.addSubject.next(res);
        } else {
          this.addSubject.next(res);
          // return res.message;
        }
      });
    } else {
      this.addSubject.next('Error');
    }
    return this.addSubject.asObservable();
  }

  update_card_detail(id: string, title: string, description: string) {
    const updateBody = {id, title, description};
    this.http.patch<any>('http://localhost:3000/api/flash/update', updateBody, {observe: 'response'}).subscribe((res) => {
      console.log(res);
      this.cardSubject.next(res);
    });
    return this.cardSubject.asObservable();
  }

  update_card(id: string, cards: any) {

  }
}
