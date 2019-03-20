import { Component, OnInit } from '@angular/core';
import {PlannerService} from '../../services/planner.service';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

  events = [];
  number_events: number;
  constructor(private planService: PlannerService) { }

  ngOnInit() {
    this.planService.get_countdowns().subscribe(res => {
      this.number_events = res.body.length;
      if (res.body) {
        this.sortByKey(res.body, 'start');
      }
      res.body.forEach(event => {
        const startTime = Math.floor(Math.abs(new Date(event.start).getTime() - new Date(Date.now()).getTime()) / (1000 * 60));
        this.events.push({
          title: event.title,
          startAt: event.start,
          endAt: event.end ? event.end : '',
          days: Math.floor(startTime / 1440)
        });
      });
      console.log(this.events);
    });
  }
  sortByKey(array, key) {
    return array.sort(function (a, b) {
      const x = a[key], y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

}
