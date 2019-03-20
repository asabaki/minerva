import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CalendarEvent} from 'angular-calendar';
import {Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
const BACKEND_URL = environment.apiUrl + '/planner/';
@Injectable({
  providedIn: 'root'
})
export class PlannerService {

  events_subject = new Subject<any>();
  event_add_subject = new Subject<any>();
  event_latest = new Subject<any>();
  event_countdowns = new Subject<any>();
  constructor(private http: HttpClient) {
  }

  get_sample(e: CalendarEvent[]) {
    // this.http.get(BACKEND_URL + '').subscribe(res => {
    //   console.log(res);
    // });
    console.log(e);
  }

  get_events() {
    this.http.get(BACKEND_URL + 'get/events', {observe: 'response'}).subscribe(res => {
      this.events_subject.next(res.body);
    });
    return this.events_subject.asObservable();
  }

  get_latest() {
    this.http.get(BACKEND_URL + 'latest/event', {observe: 'response'}).subscribe(res => {
      this.event_latest.next(res.body);
    });
    return this.event_latest.asObservable();
  }

  get_countdowns() {
    this.http.get(BACKEND_URL + 'countdowns', {observe: 'response'}).subscribe(res => {
      this.event_countdowns.next(res);
    });
    return this.event_countdowns.asObservable();

  }

  add_event(e: CalendarEvent[]) {
    delete e['actions'];
    delete e['draggable'];
    delete e['resizable'];
    this.http.post(BACKEND_URL + 'add', e, {
      observe: 'response'
    }).subscribe(res => {
      this.event_add_subject.next(res);
    });
    return this.event_add_subject.asObservable();
  }


  delete_event(e: CalendarEvent) {
    this.http.delete(BACKEND_URL + 'delete', {
      observe: 'response',
      params: new HttpParams().set('id', e.id.toString())
    }).subscribe(res => {
      console.log(res);
    });
  }



}
