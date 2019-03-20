import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';


const BACKEND_URL = environment.apiUrl + '/note/';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  note_create_subject = new Subject<any>();
  note_getAll_subject = new Subject<any>();
  note_getMy_subject = new Subject<any>();
  note_get_subject = new Subject<any>();
  note_update_subject = new Subject<any>();

  constructor(private http: HttpClient) {
  }

  allNotes() {
    this.http.get<any>(BACKEND_URL + 'all', {observe: 'response'})
      .pipe(map(res => {
        const ret = [];
        if (res.status === 200) {
          res.body.notes.forEach((note, index) => {
            ret.push({
              _id: note._id,
              author: res.body.users[index],
              title: note.title,
              description: note.description,
              updatedAt: note.lastUpdated,
              rating: note.rating,
              views: note.views
            });
          });
        } else {
          ret.push('err');
        }
        return ret;
      })).subscribe(res => {
      this.note_getAll_subject.next(res);
    }, (err) => {
      console.log(err);
    });
    return this.note_getAll_subject.asObservable();
  }

  getMyNote() {
    this.http.get(BACKEND_URL + 'get/my', {observe: 'response'}).subscribe(res => {
      this.note_getMy_subject.next(res.body);
    }, (err) => {
      console.log(err);
    });
    return this.note_getMy_subject.asObservable();
  }

  getNote(id: string) {
    this.http.get(BACKEND_URL + 'get/' + id, {observe: 'response'}).subscribe(res => {
      this.note_get_subject.next(res);
    }, err => {
      console.log(err);
    });
    return this.note_get_subject.asObservable();
  }

  createNote(note: any) {
    console.log(note);
    this.http.post(BACKEND_URL + 'create', {note}, {
      observe: 'response'
    }).subscribe(res => {
      this.note_create_subject.next(res);
    });
    return this.note_create_subject.asObservable();
  }

  updateNote(id: string, p: boolean, t: string, d: string, data: string) {
    this.http.patch(BACKEND_URL + 'update', {id, p, t, d, data}, {observe: 'response'}).subscribe(res => {
      this.note_get_subject.next(res);
      this.note_update_subject.next(res.ok);
    }, err => {
      console.log(err);
    });
    return this.note_update_subject.asObservable();
  }
}
