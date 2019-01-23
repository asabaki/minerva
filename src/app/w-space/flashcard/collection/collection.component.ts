import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router, Routes} from '@angular/router';
import {FlashCardService} from '../../services/flash-card.service';
import {Location} from '@angular/common';
import {MatDialog} from '@angular/material';
// import {EditCardComponent} from './edit-card/edit-card.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  bootRate = 1;
  faRate = 1;
  cssRate = 1;
  faoRate = 2;
  faoRated = false;


  // @ViewChild(EditCardComponent) edit;
  cards: Object = [];
  public title: string;
  desc: string;
  numberOfCard: number;
  index: number;
  prevIndex = 1;
  id: string;
  cardObj: Object;
  // arr: Array<number>;
  isLoading = true;

  constructor(private route: ActivatedRoute,
              private location: Location,
              private router: Router,
              private flashService: FlashCardService,
              public dialog: MatDialog,
              ) {
  }

  ngOnInit() {
    this.index = 1;
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('id')) {
        this.flashService.fetch_card(params.get('id')).subscribe((res) => {
          this.title = res.body.title;
          this.desc = res.body.description;
          this.numberOfCard = res.body.card.length;
          this.index = this.numberOfCard === 0 ? 0 : this.index;
          this.cards = res.body.card;
          this.id = params.get('id');
          this.cardObj = {
            title: this.title,
            description: this.desc,
            noc: this.numberOfCard,
            cards: this.cards,
            _id: this.id,
            index: this.index
          };
          this.isLoading = false;
        });

      } else {
        this.isLoading = true;
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

  // openEditCardDialog() {
  //   this.cardObj = {
  //     title: this.title,
  //     description: this.desc,
  //     noc: this.numberOfCard,
  //     cards: this.cards,
  //     _id: this.id,
  //     index: this.index
  //   };
  //   const dialogRef = this.dialog.open(EditCardComponent,
  //     {
  //       panelClass: 'myapp-no-padding-dialog',
  //       data: this.cardObj,
  //     });
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     // console.log(this.flashService.getIndex());
  //     this.prevIndex = this.flashService.getIndex();
  //     if (this.prevIndex > this.numberOfCard || this.prevIndex === 0) {
  //       this.index = this.numberOfCard;
  //     }
  //   });
  // }

  // openAddCardDialog() {
  //   this.flashService.collectionId = this.id;
  //   const dialogRef = this.dialog.open(AddCardComponent, {panelClass: 'myapp-no-padding-dialog'});
  //   console.log(this.flashService.getIndex());
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('It closed na');
  //     this.index = 1;
  //   });
  // }
  onFaoRate(e) {
    this.faoRated = true;
    this.faoRate = e;
  }

  faoReset() {
    this.faoRated = false;
    this.faoRate = 3.6;
  }
}
