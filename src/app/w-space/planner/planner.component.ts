import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef, OnInit, ChangeDetectorRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';


import {MatDialog, MatSnackBar} from '@angular/material';
import {PlanDetailComponent} from './plan-detail/plan-detail.component';
import {PlannerService} from '../services/planner.service';
import {SuccessSnackComponent} from '../shared-components/success-snack/success-snack.component';
import {ErrorSnackComponent} from '../shared-components/error-snack/error-snack.component';
import {ConfirmDialogComponent} from '../quiz/quiz-collection/confirm-dialog/confirm-dialog.component';
import {AddTaskComponent} from './add-task/add-task.component';


const colors: any = {
  green: '#a8f9c4',
  blue: '#1e90ff',
  yellow: '#fff7e7'
};


@Component({
  selector: 'app-planner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  constructor(private modal: NgbModal,
              public dialog: MatDialog,
              private service: PlannerService,
              private matSnack: MatSnackBar) {
  }


  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-pencil-alt grey"></i>',
      onClick: ({event}: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times grey"></i>',
      onClick: ({event}: { event: CalendarEvent }): void => {
        const deleteCfrm = this.dialog.open(ConfirmDialogComponent, {
          data: { mssg: 'Do you want to delete this event?', type: 'alert'},
          panelClass: 'myapp-no-padding-dialog'
        });
        deleteCfrm.afterClosed().subscribe(res => {
          if (res) {
            this.service.delete_event(event);
            this.events = this.events.filter(iEvent => iEvent !== event);
            this.handleEvent('Deleted', event);
            this.refresh.next();
            this.activeDayIsOpen = false;
          }
        });
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];
  temp_events: CalendarEvent[] = [];


  activeDayIsOpen: boolean = true;

  ngOnInit(): void {
    this.service.get_latest();
    this.service.get_events().subscribe(res => {
      this.events = [];
      res.forEach(event => {
        this.events.push({
          id: event._id,
          start: new Date(event.start),
          end: new Date(event.end),
          title: event.title,
          color: {primary: event.color, secondary: event.color},
          actions: this.actions
        });
      });
      this.refresh.next();
    });
    this.activeDayIsOpen = false;
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd
                    }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    if (action !== 'Deleted') {
      const dialogRef = this.dialog.open(PlanDetailComponent, {
        data: event,
        panelClass: 'myapp-no-padding-dialog'});
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

  addEvent(): void {
    this.temp_events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      color: colors.yellow,
      actions: this.actions,
    });

    this.refresh.next();
  }

  onSave(e: any) {
    console.log(e);
    this.service.add_event(e).subscribe(res => {
      if (res.ok) {
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'Event Added Successful!',
          duration: 1500
        });
        this.service.get_events();
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'Something Went Wrong!\n' + res.statusText,
          duration: 1500
        });
      }
    });
    this.temp_events = this.temp_events.filter(iEvent => iEvent !== e);
  }

  planDetailDialog() {
    const dialogRef = this.dialog.open(PlanDetailComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  addTaskDialog() {
    const dialogRef = this.dialog.open(AddTaskComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
