import { Component, OnInit } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  public EditorDe = DecoupledEditor;
  public imageConfig = {
    plugins: [ Image, ImageToolbar, ImageCaption, ImageStyle ],
    image: {
        toolbar: [ 'imageTextAlternative', '|', 'imageStyle:full', 'imageStyle:side' ]
    }
  };
  public onReady( editor ) {
    editor.ui.view.editable.element.parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.view.editable.element,
        Array.from( editor.ui.componentFactory.names() )
    );
}
  constructor() { }

  ngOnInit() {
  }
}
