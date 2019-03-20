import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import {NoteService} from '../../../services/note.service';
import {MatSnackBar} from '@angular/material';
import {SuccessSnackComponent} from '../../../shared-components/success-snack/success-snack.component';
import {ErrorSnackComponent} from '../../../shared-components/error-snack/error-snack.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})
export class CreateNoteComponent implements OnInit {
  privacyText = 'Only Me';
  data = '';
  public Editor = DecoupledEditor;

  public captureScreen() {
    const data = document.getElementById('pdfCreate');
    html2canvas(data).then(canvas => {
      console.log(canvas);
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

  constructor(private noteService: NoteService,
              private matSnack: MatSnackBar,
              private location: Location,
              private router: Router) {
  }

  ngOnInit() {
  }

  sliding(f: any) {
    this.privacyText = f ? 'Only Me' : 'Publish';
  }

  onSave(title: string, description: string, privacy: boolean) {
    this.noteService.createNote({title, description, privacy: !privacy, data: this.data}).subscribe(res => {
      // console.log(res);
      if (res.ok) {
        this.matSnack.openFromComponent(SuccessSnackComponent, {
          data: 'You have successfully create new note!',
          duration: 1500
        });
        this.router.navigate(['note/item/' + res.body._id]);
      } else {
        this.matSnack.openFromComponent(ErrorSnackComponent, {
          data: 'Something went Wrong!\n' + res.statusText,
          duration: 1500
        });
      }
    });
  }

  onClickBack() {
    this.location.back();
  }

}
