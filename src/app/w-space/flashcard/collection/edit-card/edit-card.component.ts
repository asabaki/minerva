import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {FlashCardService} from '../../../services/flash-card.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {MAT_SNACK_BAR_DATA} from '@angular/material';
@Injectable()
@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.scss']
})
export class EditCardComponent implements OnInit {
  panelOpenState = false;
  title: string;
  desc: string;
  // cards: Array;
  constructor(private flashService: FlashCardService,
              private route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data.cards);
  }

}
