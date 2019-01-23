import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import { AddCardComponent } from './add-card/add-card.component';
import {AuthService} from '../../../services/auth.service';
import {FlashCardService} from '../../../services/flash-card.service';
import {Router} from '@angular/router';
import {ErrorSnackComponent} from '../../../sign-up/sign-up.component';

@Component({
  selector: 'app-create-flashcard',
  templateUrl: './create-flashcard.component.html',
  styleUrls: ['./create-flashcard.component.scss']
})
export class CreateFlashcardComponent implements OnInit {
  // TODO - Redirect After Create Collection
  privacyText = 'Private';
  constructor(public dialog: MatDialog,
              private matSnack: MatSnackBar,
              private authService: AuthService,
              private flashService: FlashCardService,
              private router: Router ) {}
  ngOnInit() {
  }

  onAddCollection(title: string, desc: string, privacy: boolean) {
    console.log(privacy);
    this.flashService.create_collection(title, desc, privacy).subscribe(res => {
      if (res.ok) {
        this.router.navigate(['flash/my/' + res.body._id]);
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'Something went wrong\n' + res.statusText,
          duration: 1500
        });
      }
    });
    this.flashService.fetch_collection();
    this.openAddCardDialog();
  }

  openAddCardDialog() {
    const dialogRef = this.dialog.open(AddCardComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  sliding(f: any) {
    this.privacyText = f ? 'Private' : 'Public' ;
  }
}
