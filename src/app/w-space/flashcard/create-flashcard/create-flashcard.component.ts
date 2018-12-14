import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { AddCardComponent } from './add-card/add-card.component';
import {AuthService} from '../../services/auth.service';
import {FlashCardService} from '../../services/flash-card.service';

@Component({
  selector: 'app-create-flashcard',
  templateUrl: './create-flashcard.component.html',
  styleUrls: ['./create-flashcard.component.scss']
})
export class CreateFlashcardComponent implements OnInit {

  constructor(public dialog: MatDialog,
              private authService: AuthService,
              private flashService: FlashCardService) {}
  ngOnInit() {
  }

  onAddCollection(title: string, desc: string) {

    this.flashService.createCollection(title, desc);
    this.flashService.fetchCol();
    this.openAddCardDialog();
  }

  openAddCardDialog() {
    const dialogRef = this.dialog.open(AddCardComponent, {panelClass: 'myapp-no-padding-dialog'});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
