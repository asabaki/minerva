import {ChangeDetectorRef, Component, Inject, Injectable, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {FlashCardService} from '../../../services/flash-card.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {MAT_SNACK_BAR_DATA, MatSnackBar} from '@angular/material';
import {ErrorSnackComponent, SuccessSnackComponent} from '../../../sign-up/sign-up.component';
import {FormArray, FormControl, FormGroup, NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {stringify} from 'querystring';

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
  card: Array<Object> = [];
  updateSub: Subscription;
  index: number;
  form: FormGroup;
  isLoading = true;

  // cards: Array;
  constructor(private flashService: FlashCardService,
              private route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private changeDet: ChangeDetectorRef,
              private matSnack: MatSnackBar) {
    this.isLoading = true;
    this.form = new FormGroup({}, null);
  }

  ngOnInit() {
    this.index = this.data.index;
    this.flashService.index = this.index;
    let i = 0;
    this.data.cards.forEach((card) => {
      this.form.addControl(i.toString(), new FormGroup({
        id: new FormControl(card._id),
        front_text: new FormControl(card.front_text),
        back_text: new FormControl(card.back_text)
      }, null));
      i++;

    });
    i = 0;
    // console.log(this.data);
    this.isLoading = false;
  }


  onDelete(id: string) {
    this.flashService.delete_card(id).subscribe((res) => {
      this.data.cards = res.body.card;
      this.changeDet.detectChanges();
      this.matSnack.openFromComponent(SuccessSnackComponent, {
        duration: 2000,
        data: 'Delete Card Successful'
      });
    });
  }

  onAddCard(front: string, back: string, f: NgForm) {
    this.flashService.collectionId = this.data._id;
    this.flashService.add_card(front, back).subscribe((response) => {
      if (response.statusText === 'OK') {
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'Success Add Card',
          duration: 1500
        });
        this.data.cards = response.body.card;
        const newCard = this.data.cards[this.data.cards.length - 1];
        // console.log(newCard);
        this.form.addControl((this.data.cards.length - 1).toString(), new FormGroup({
          id: new FormControl(newCard._id),
          front_text: new FormControl(newCard.front_text),
          back_text: new FormControl(newCard.back_text)
        }, null));
        // console.log(response.body.card);
        this.flashService.fetch_card(this.data._id);
        this.changeDet.detectChanges();
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'Something went Wrong!' + response.statusText,
          duration: 1500
        });
      }
    });
    f.resetForm();
  }

  onUpdate(title: string, desc: string) {
    this.updateSub = this.flashService.update_card_detail(this.data._id, title, desc).subscribe((res) => {

      if (res.ok) {
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'Update Success!',
          duration: 1500
        });
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'Something Went Wrong! \n' + res.statusText,
          duration: 1500
        });
      }
    });
  }

  onUpdateCard() {
    // console.log(this.form.value);
    for (let i = 0; i < this.data.cards.length; i++) {
      this.card[i] = this.form.value[i];
    }
    this.flashService.update_card(this.data._id, this.card).subscribe((res) => {
      if (res.ok) {
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'Update Cards Success!',
          duration: 1500
        });
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'Something went wrong!\n' + res.statusText,
          duration: 1500
        });
      }
    });
  }

  onAddControl() {
  }
}
