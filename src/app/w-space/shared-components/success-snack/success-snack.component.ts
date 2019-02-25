import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({
  selector: 'app-success-snack',
  templateUrl: './success-snack.component.html',
  styleUrls: ['./success-snack.component.scss']
})
export class SuccessSnackComponent implements OnInit {

  constructor(@Optional() @Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

  ngOnInit() {
  }

}
