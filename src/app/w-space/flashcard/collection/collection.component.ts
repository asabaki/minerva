import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router, Routes} from '@angular/router';
import {FlashCardService} from '../../services/flash-card.service';
import {Location} from '@angular/common';
import {MatDialog} from '@angular/material';
import {EditCardComponent} from '../collection/edit-card/edit-card.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  cards: Object = [];
  title: string;
  desc: string;
  numberOfCard: number;
  index: number;
  id: string;
  cardObj: Object;
  // arr: Array<number>;
  num: number;

  constructor(private route: ActivatedRoute,
              private location: Location,
              private router: Router,
              private flashService: FlashCardService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.index = 1;
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('id')) {
        this.flashService.fetch_card(params.get('id')).subscribe((res) => {
          this.title = res.body.title;
          this.desc = res.body.description;
          this.numberOfCard = res.body.card.length;
          this.cards = res.body.card;
          this.id = params.get('id');
          this.cardObj = {
            title: this.title,
            description: this.desc,
            noc: this.numberOfCard,
            cards: this.cards,
            _id: this.id
          };
        });

      }
    });
  }

  onClickBack() {
    // this.router.navigate(back)
    this.location.back();
  }

  onChangeCard(r: any) {
    this.index = r;
  }

  helper(num: number) {
    return Array(num);
  }

  openEditCardDialog() {
    const dialogRef = this.dialog.open(EditCardComponent,
      {
        panelClass: 'myapp-no-padding-dialog',
        data: this.cardObj
      });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
