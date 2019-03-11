import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router, Routes} from '@angular/router';
import {FlashCardService} from '../../services/flash-card.service';
import {Location} from '@angular/common';
import {MatDialog, MatSnackBar} from '@angular/material';
import {EditCardComponent} from './edit-card/edit-card.component';
import {AddCardComponent} from '../my-flashcard/create-flashcard/add-card/add-card.component';
import {AuthService} from '../../services/auth.service';
import {SuccessSnackComponent} from '../../shared-components/success-snack/success-snack.component';
import {ErrorSnackComponent} from '../../shared-components/error-snack/error-snack.component';

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
  creator: string;
  creatorName: string;
  prevIndex = 1;
  id: string;
  cardObj: Object;
  privacy: boolean;
  views: number;
  rating: number;
  isFollowing: boolean;
  // arr: Array<number>;
  isLoading = true;
  isRated = false;

  constructor(private route: ActivatedRoute,
              private location: Location,
              private router: Router,
              private matSnack: MatSnackBar,
              private flashService: FlashCardService,
              private authService: AuthService,
              public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.index = 1;
    this.flashService.index = this.index;
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('id')) {
        this.flashService.fetch_card(params.get('id')).subscribe((res) => {
          this.creator = res.body.cards.user_id;
          this.creatorName = res.body.creatorName;
          this.privacy = res.body.cards.privacy;
          this.rating = res.body.cards.rating;
          this.faoRate = this.rating;
          this.views = res.body.cards.views;
          this.title = res.body.cards.title;
          this.desc = res.body.cards.description;
          this.numberOfCard = res.body.cards.card.length;
          this.index = this.numberOfCard === 0 ? 0 : this.flashService.getIndex();
          this.cards = res.body.cards.card;
          this.id = params.get('id');
          this.cardObj = {
            title: this.title,
            description: this.desc,
            noc: this.numberOfCard,
            cards: this.cards,
            _id: this.id,
            index: this.index
          };
          this.authService.isFollowing(localStorage.getItem('userId'), this.creator).subscribe(fol => this.isFollowing = fol);
          this.flashService.getRated(this.id).subscribe(rate => {
            this.faoRated = rate.body;
          });
          this.isLoading = false;
        });
        // this.flashService.getRating(this.id);

      } else {
        this.isLoading = true;
      }
    });

  }

  onClickGetRate() {
    this.flashService.getRated(this.id);
  }

  onClickBack() {
    this.location.back();
  }

  onChangeCard(r: any) {
    this.index = r;
  }

  helper(num: number) {
    return Array(num);
  }

  isCreator() {
    return localStorage.getItem('userId') === this.creator;
  }


  openEditCardDialog() {
    this.cardObj = {
      title: this.title,
      description: this.desc,
      noc: this.numberOfCard,
      cards: this.cards,
      _id: this.id,
      index: this.index,
      views: this.views,
      privacy: this.privacy,
      rating: this.rating
    };
    const dialogRef = this.dialog.open(EditCardComponent,
      {
        panelClass: 'myapp-no-padding-dialog',
        data: this.cardObj,
      });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(this.flashService.getIndex());
      this.prevIndex = this.flashService.getIndex();
      if (this.prevIndex > this.numberOfCard || this.prevIndex === 0) {
        this.index = this.numberOfCard;
      }
    });
  }

  onFollow(id: string) {
    this.authService.followUser(id).subscribe(res => {
      // console.log(res)
      if (res !== -1 ) {
        this.isFollowing = true;
        this.authService.isFollowing(localStorage.getItem('userId'), this.creator);
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'You successfully follow ' + this.creatorName,
          duration: 1500
        });
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'You have already follow this user!',
          duration: 1500
        });
      }
    });
  }

  onUnfollow(id: string) {
    this.authService.unfollowUser(id).subscribe(res => {
      if (res !== -1 ) {
        this.isFollowing = false;
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'You successfully unfollow ' + this.creatorName,
          duration: 1500
        });
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'You have already unfollow this user!',
          duration: 1500
        });
      }
    });
  }

  openAddCardDialog() {
    this.flashService.collectionId = this.id;
    const dialogRef = this.dialog.open(AddCardComponent, {panelClass: 'myapp-no-padding-dialog'});
    dialogRef.afterClosed().subscribe(result => {
      this.index = 1;
    });
  }

  onFaoRate(e) {
    this.flashService.rate_collection(this.id, e).subscribe(r => {
      if (r.ok) {
        // this.faoRated = true;
        this.flashService.getRated(this.id).subscribe(rated => this.faoRated = rated.body);
        this.faoRate = r.body.cards.rating;
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'Submitted\n Thank you for your feedback!',
          duration: 1500
        });
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'Something went wrong!\n' + r.statusText,
          duration: 1500
        });
      }
    });
  }

  faoReset(rate: number) {
    this.flashService.unrate_collection(this.id);
  }
}
