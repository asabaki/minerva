import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {FlashCardService} from '../../../../services/flash-card.service';
import {NgForm} from '@angular/forms';
import {SuccessSnackComponent} from '../../../../shared-components/success-snack/success-snack.component';
import {ErrorSnackComponent} from '../../../../shared-components/error-snack/error-snack.component';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {

  constructor(private http: HttpClient,
              private flashService: FlashCardService,
              private matSnack: MatSnackBar) { }

  ngOnInit() {
  }

  onAddCard(front: string, back: string, f: NgForm) {
    this.flashService.add_card(front, back).subscribe((response) => {
      console.log(response);
      if (response.ok) {
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'Success Add Card',
          duration: 1500
        });
        this.flashService.index = 1;
        this.flashService.fetch_collection();
        this.flashService.fetch_card(this.flashService.collectionId);
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'Something went Wrong!\n' + response.statusText,
          duration: 1500
        });
      }
    });
    f.resetForm();
  }

}
