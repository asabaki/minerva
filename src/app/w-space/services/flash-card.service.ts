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
  updateSubject = new Subject<any>();
  cardSubject = new Subject<any>();
  collectionId: string;
  index: number;

  //  ---- List of cardSubject ------
  // * flash/add --> Create Collection (y)
  // * flash/pull/id --> Pull particular collection based on ID
  // * flash/delete/card --> Delete card of collection based on ID
  // * flash/update --> Update Collection Detail
  // * flash/update/id --> Update Collection Detail based on ID
  constructor(private http: HttpClient,
              private auth: AuthService,
              private route: ActivatedRoute) {
  }

  create_collection(title: string, description: string, privacy: boolean) {
    if (this.auth.getIsAuth()) {
      const userId = localStorage.getItem('userId');
      const card = {title, description, userId, privacy};
      this.http.post<any>('http://localhost:3000/api/flash/add', card, {observe: 'response'}).subscribe(
        (res) => {
          this.collectionId = res.body.cards._id;
          this.cardSubject.next(res);
        },
        (err) => {
          this.cardSubject.next(err);
        }
      );
      // console.log(title, description);
    }
    return this.cardSubject.asObservable();
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
              numberOfCard: collection.card.length,
              privacy: collection.privacy,
              updatedAt: collection.updatedAt,
              rating: 0,
              views: 0
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

  fetch_collection_all() {
    this.http.get<any>('http://localhost:3000/api/flash/fetch_all/', {observe: 'response'})
      .pipe(map(res => {
        const ret = [];
        if (res.status === 200) {
          res.body.collections.forEach((collection, index) => {
            ret.push({
              _id: collection._id,
              author: res.body.users[index],
              title: collection.title,
              description: collection.description,
              numberOfCard: collection.card.length,
              updatedAt: collection.updatedAt,
              rating: 0,
              views: 0
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

  fetch_card(id: string) { // Collection Component
    this.http.get('http://localhost:3000/api/flash/pull/' + id, {observe: 'response'}).subscribe((response) => {
      this.cardSubject.next(response);
    });
    return this.cardSubject.asObservable();
  }

  getIndex() {
    return this.index;
  }

  getRating(id: string) {
    this.http.get('http://localhost:3000/api/flash/rate', {
      params: new HttpParams().set('id', id),
      observe: 'response'
    }).subscribe(res => {
      console.log(res);
    });
  }

  delete_card(id: string) {
    this.http.delete('http://localhost:3000/api/flash/delete/card',
      {
        params: new HttpParams().set('id', id),
        observe: 'response'
      }).subscribe((response) => {
      this.cardSubject.next(response);
    });
    return this.cardSubject.asObservable();
  }

  delete_collection(id: string) {
    this.http.delete('http://localhost:3000/api/flash/delete/',
      {
        params: new HttpParams().set('id', id),
        observe: 'response'
      }).subscribe((response) => this.cardSubject.next(response));
    return this.cardSubject.asObservable();
  }

  add_card(front: string, back: string) {
    if (this.collectionId && this.auth.getIsAuth()) {
      const card = {front, back};
      this.index = this.index ? 1 : this.index;
      this.http.post<any>('http://localhost:3000/api/flash/add/' + this.collectionId, card, {observe: 'response'}).subscribe((res) => {
        if (res.ok) {
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

  update_card_detail(id: string, title: string, description: string, privacy: boolean) {
    const updateBody = {id, title, description, privacy};
    this.http.patch<any>('http://localhost:3000/api/flash/update', updateBody, {observe: 'response'}).subscribe((res) => {
      this.updateSubject.next(res);
    });
    return this.updateSubject.asObservable();
  }

  update_card(id: string, cards: Object[]) {
    // let status;
    this.http.patch('http://localhost:3000/api/flash/update/' + id, cards, {observe: 'response'}).subscribe((res) => {
      this.updateSubject.next(res);
      // status = res.statusText;
    });
    return this.updateSubject.asObservable();
    // console.log(status);
    // return status;
  }

  rate_collection(id: string, rate: number) {
    this.http.patch('http://localhost:3000/api/flash/rate', {rate, id}, { observe: 'response'}).subscribe(res => {
      if (res.ok) {
        console.log(res);
        this.cardSubject.next(res);
      }
    });
    return this.cardSubject.asObservable();
  }
}
