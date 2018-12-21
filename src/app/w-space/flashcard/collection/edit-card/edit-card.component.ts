import {ChangeDetectorRef, Component, Inject, Injectable, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {FlashCardService} from '../../../services/flash-card.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {MAT_SNACK_BAR_DATA, MatSnackBar} from '@angular/material';
import {ErrorSnackComponent, SuccessSnackComponent} from '../../../sign-up/sign-up.component';
import {NgForm} from '@angular/forms';
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
              @Inject(MAT_DIALOG_DATA) public data: any,
              private changeDet: ChangeDetectorRef,
              private matSnack: MatSnackBar) { }

  ngOnInit() {
    console.log(this.data);
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
      if (response === 'OK') {
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'Success Add Card',
          duration: 1500
        });
        this.flashService.fetch_card(this.data._id);
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'Something went Wrong!' + response,
          duration: 1500
        });
      }
    });
    f.resetForm();
  }

  onUpdate(title: string, desc: string) {
    this.flashService.update_card(this.data._id, title, desc).subscribe((res) => {
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

}
