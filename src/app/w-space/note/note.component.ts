import { Component, OnInit } from '@angular/core';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
/*import * as jspdf from 'jspdf';*/
import html2canvas from 'html2canvas';



@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  public Editor = DecoupledEditor;

  public onReady( editor ) {
      editor.ui.view.editable.element.parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.view.editable.element,
      );
      editor.execute( 'ckfinder' );
      editor.execute( 'insertImage', '' );
      Array.from( editor.ui.componentFactory.names() );
  }
  /*public captureScreen()
  {
    var data = document.getElementById('eidtor');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }*/

  constructor() { }

  ngOnInit() {



}
}

