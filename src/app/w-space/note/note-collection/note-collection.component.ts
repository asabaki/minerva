import {Component, OnInit} from '@angular/core';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import {Location} from '@angular/common';
import {SuccessSnackComponent} from '../../shared-components/success-snack/success-snack.component';
import {ErrorSnackComponent} from '../../shared-components/error-snack/error-snack.component';
import {NoteService} from '../../services/note.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ConfirmDialogComponent} from '../../quiz/quiz-collection/confirm-dialog/confirm-dialog.component';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-note-collection',
  templateUrl: './note-collection.component.html',
  styleUrls: ['./note-collection.component.scss']
})
export class NoteCollectionComponent implements OnInit {
  bootRate = 1;
  faRate = 1;
  cssRate = 1;
  faoRate = 2;
  faoRated = false;
  creator: string;
  creator_id: string;
  privacy: boolean;
  isLoaded = false;
  isFollowing: boolean;
  privacyText = 'Only Me';
  id: string;
  title = '';
  description: string;
  data: string;
  views: number;
  public Editor = DecoupledEditor;
  isEdit = false;


  constructor(private noteService: NoteService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private authService: AuthService,
              private matSnack: MatSnackBar,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.isLoaded = false;
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('id')) {
        this.noteService.getNote(params.get('id')).subscribe(res => {
          this.id = res.body.note._id;
          this.title = res.body.note.title;
          this.description = res.body.note.description;
          this.privacy = res.body.note.privacy;
          this.creator = res.body.user.name;
          this.faoRate = res.body.note.rating;
          this.views = res.body.note.views;
          this.data = res.body.decryptData;
          this.creator_id = res.body.user._id;
          this.isLoaded = true;
          this.privacyText = this.privacy ? 'Only Me' : 'Published';
        });
      }
    });
  }

  toggleSlide() {
    if (this.isEdit) {
      const retest = this.dialog.open(ConfirmDialogComponent, {
        data: {mssg: 'Are you sure that you want to save this change ?', type: 'caution'},
        panelClass: 'myapp-no-padding-dialog'
      });
      retest.afterClosed().pipe(first()).subscribe(res => {
        if (res) {
          this.noteService.updateNote(this.id, this.privacy, this.title, this.description, this.data).subscribe(ok => {
            if (ok) {
              this.matSnack.openFromComponent(SuccessSnackComponent, {
                data: 'Update Note Successful',
                duration: 1500
              });
              this.isEdit = false;
            } else {
              this.matSnack.openFromComponent(ErrorSnackComponent, {
                data: 'Update Error\n' + res.statusText,
                duration: 1500
              });
            }
          });
        } else {
          this.isEdit = true;
          console.log('Denied');
        }

      });
    } else {
      this.isEdit = !this.isEdit;
    }
    // console.log(e);
  }

  isCreator() {
    return localStorage.getItem('userId') === this.creator_id;
  }

  privateSwitch() {
    this.privacy = !this.privacy;
    this.privacyText = this.privacy ? 'Only me' : 'Published';
  }

  openEditCardDialog() {

  }

  faoReset() {

  }

  onFaoRate(e) {

  }

  onFollow(id: string) {
    this.authService.followUser(id).subscribe(res => {
      // console.log(res)
      if (res !== -1) {
        this.isFollowing = true;
        this.authService.isFollowing(localStorage.getItem('userId'), this.creator_id);
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'You successfully follow ' + this.creator,
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
      if (res !== -1) {
        this.isFollowing = false;
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'You successfully unfollow ' + this.creator,
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

  public captureScreen() {
    const data = document.getElementById('pdfCreate');
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('MyNote.pdf');
    });
  }

  public onReady(editor) {
    editor.ui.view.editable.element.parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.view.editable.element,
    );
    Array.from(editor.ui.componentFactory.names());
  }

  onClickBack() {
    this.location.back();
  }

}
