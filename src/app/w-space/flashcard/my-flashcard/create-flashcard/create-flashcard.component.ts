import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import { AddCardComponent } from './add-card/add-card.component';
import {AuthService} from '../../../services/auth.service';
import {FlashCardService} from '../../../services/flash-card.service';
import {Router} from '@angular/router';
import {ErrorSnackComponent} from '../../../shared-components/error-snack/error-snack.component';

@Component({
  selector: 'app-create-flashcard',
  templateUrl: './create-flashcard.component.html',
  styleUrls: ['./create-flashcard.component.scss']
})
export class CreateFlashcardComponent implements OnInit {
  privacyText = 'Only Me';
  constructor(public dialog: MatDialog,
              private matSnack: MatSnackBar,
              private authService: AuthService,
              private flashService: FlashCardService,
              private router: Router ) {}
  ngOnInit() {
  }

  onAddCollection(title: string, desc: string, privacy: boolean) {
    this.flashService.create_collection(title, desc, !privacy).subscribe(res => {
      if (res.ok) {
        this.router.navigate(['flash/item/' + res.body.cards._id]);
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'Something went wrong\n' + res.statusText,
          duration: 1500
        });
      }
    });
    this.openAddCardDialog();
    this.flashService.fetch_collection();
  }

  openAddCardDialog() {
    const dialogRef = this.dialog.open(AddCardComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  sliding(f: any) {
    this.privacyText = f ? 'Only Me' : 'Publish' ;
  }
}
