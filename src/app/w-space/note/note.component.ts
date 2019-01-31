import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  public Editor = ClassicEditor;
  public toolbarConfig = {
    toolbar: [ 'heading', '|', 'bold', 'italic' ],

  };
  constructor() { }

  ngOnInit() {
  }
}
