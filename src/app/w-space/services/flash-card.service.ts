import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {FlashModel} from './flash_collection.model';
import {RequestOptions} from '@angular/http';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../../environments/environment';
import {SuccessSnackComponent} from '../shared-components/success-snack/success-snack.component';
import {ErrorSnackComponent} from '../shared-components/error-snack/error-snack.component';
const BACKEND_URL = environment.apiUrl + '/flash/';
@Injectable({
  providedIn: 'root'
})
export class FlashCardService {

  subject = new Subject<any>();
  addSubject = new Subject<any>();
  updateSubject = new Subject<any>();
  cardSubject = new Subject<any>();
  ratedSubject = new Subject<any>();
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
              private route: ActivatedRoute,
              private matSnack: MatSnackBar) {
  }

  create_collection(title: string, description: string, privacy: boolean) {
    if (this.auth.getIsAuth()) {
      const userId = localStorage.getItem('userId');
      const card = {title, description, userId, privacy};
      this.http.post<any>(BACKEND_URL + 'add', card, {observe: 'response'}).subscribe(
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
    this.http.get<FlashModel[]>(BACKEND_URL + 'fetch/' + userId, {observe: 'response'})
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
              rating: collection.rating,
              views: collection.views,
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
    this.http.get<any>(BACKEND_URL + 'fetch_all/', {observe: 'response'})
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
              updatedAt: collection.lastUpdate,
              rating: collection.rating,
              views: collection.views
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
    this.http.get(BACKEND_URL + 'pull/' + id, {observe: 'response'}).subscribe((response) => {
      this.cardSubject.next(response);
    });
    return this.cardSubject.asObservable();
  }

  getIndex() {
    return this.index;
  }

  getRated(id: string) {
    this.http.get(BACKEND_URL + 'rate/' + id, {observe: 'response'}).subscribe(res => {
      this.ratedSubject.next(res);
    });
    return this.ratedSubject.asObservable();
  }

  getRating(id: string) {
    this.http.get(BACKEND_URL + 'rate', {
      params: new HttpParams().set('id', id),
      observe: 'response'
    }).subscribe(res => {

    });
  }

  delete_card(id: string) {
    this.http.delete(BACKEND_URL + 'delete/card',
      {
        params: new HttpParams().set('id', id),
        observe: 'response'
      }).subscribe((response) => {
      this.cardSubject.next(response);
    });
    return this.cardSubject.asObservable();
  }

  delete_collection(id: string) {
    this.http.delete(BACKEND_URL + 'delete/',
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
      this.http.post<any>(BACKEND_URL + 'add/' + this.collectionId, card, {observe: 'response'}).subscribe((res) => {
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
    this.http.patch<any>(BACKEND_URL + 'update', updateBody, {observe: 'response'}).subscribe((res) => {
      this.updateSubject.next(res);
    });
    return this.updateSubject.asObservable();
  }

  update_card(id: string, cards: Object[]) {
    // let status;
    this.http.patch(BACKEND_URL + 'update/' + id, cards, {observe: 'response'}).subscribe((res) => {
      this.updateSubject.next(res);
      // status = res.statusText;
    });
    return this.updateSubject.asObservable();
    // console.log(status);
    // return status;
  }

  rate_collection(id: string, rate: number) {
    this.http.patch(BACKEND_URL + 'rate', {rate, id}, {observe: 'response'}).subscribe(res => {
      if (res.ok) {
        this.updateSubject.next(res);
      }
    });
    return this.updateSubject.asObservable();
  }

  unrate_collection(id: string) {
    this.http.patch(BACKEND_URL + 'unrate', {id}, {observe: 'response'}).subscribe(res => {
      if (res.ok) {
        this.updateSubject.next(res);
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'You have unrated this collection',
          duration: 1500
        });
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'Something went wrong\n' + res.statusText,
          duration: 1500
        });
      }
    });
  }
}
