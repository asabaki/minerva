import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CalendarEvent} from 'angular-calendar';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlannerService {

  events_subject = new Subject<any>();
  event_add_subject = new Subject<any>();
  constructor(private http: HttpClient) {
  }

  get_sample(e: CalendarEvent[]) {
    // this.http.get('http://localhost:3000/api/planner/').subscribe(res => {
    //   console.log(res);
    // });
    console.log(e);
  }

  get_events() {
    this.http.get('http://localhost:3000/api/planner/get/events', {observe: 'response'}).subscribe(res => {
      this.events_subject.next(res.body);
    });
    return this.events_subject.asObservable();
  }

  add_event(e: CalendarEvent[]) {
    delete e['actions'];
    delete e['draggable'];
    delete e['resizable'];
    this.http.post('http://localhost:3000/api/planner/add', e, {
      observe: 'response'
    }).subscribe(res => {
      this.event_add_subject.next(res);
    });
    return this.event_add_subject.asObservable();
  }


  delete_event(e: CalendarEvent) {
    this.http.delete('http://localhost:3000/api/planner/delete', {
      observe: 'response',
      params: new HttpParams().set('id', e.id.toString())
    }).subscribe(res => {
      console.log(res);
    });
  }



}
