import { Component } from '@angular/core';
import * as xlsx from 'xlsx';
import * as xlsxStyle from 'xlsx-style';

import { saveAs } from 'file-saver';
type AOA = any[][];
type WS = {
  name: string;
  data: AOA;
};

@Component({
  selector: 'app-xlsx',
  templateUrl: './xlsx.html',
  styleUrls: ['./xlsx.scss']
})
export class XlsxContainerComponent {
  style = false;
  data: AOA = [ [1, 2], [3, 4] ];
  wopts: xlsx.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName = 'SheetJS.xlsx';
  excel: WS[] = [];

  onFileChange(evt: any) {
    /* wire up file reader */
    // console.log('onFileChange');

    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    this.fileName = target.files[0].name;
    const ext: string = this.fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'xls' : this.wopts.bookType = 'xls'; break;
      case 'xlsx': this.wopts.bookType = 'xlsx'; break;
      default:
        alert('Ich kann nur ".xls" oder ".xlsx" - Vesuch\'s noch mal!');
        console.log(document.getElementById('input'));
        return false;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      let wb: xlsx.WorkBook = null;
      if (this.style) {
        wb = xlsxStyle.read(bstr, {type: 'binary'});
      } else {
        wb = xlsx.read(bstr, {type: 'binary'});
      }

      /*
      original
      // grab first sheet
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      console.log(wsname);
      // save data
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
      */

      let name: string;
      let ws: xlsx.WorkSheet;
      let data: AOA;
      for (let i = 0; i < wb.SheetNames.length; i++) {
        name = wb.SheetNames[i];
        ws = wb.Sheets[name];
        if (this.style) {
          data = xlsxStyle.utils.sheet_to_json(ws, {header: 1});
        } else {
          data = xlsx.utils.sheet_to_json(ws, {header: 1});
        }
        this.excel[i] = { name, data };
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  export(): void {
    this.data[0][0] = 99;
    /* generate worksheet */
    const ws: xlsx.WorkSheet = xlsx.utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    const wbout: ArrayBuffer = xlsx.write(wb, this.wopts);
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.fileName);
  }

  schreiben(): void {
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    for (let i = 0; i < this.excel.length; i++) {
      const ws: xlsx.WorkSheet = xlsx.utils.aoa_to_sheet(this.excel[i].data);
      xlsx.utils.book_append_sheet(wb, ws, this.excel[i].name);
    }
    const wbout: ArrayBuffer = xlsx.write(wb, this.wopts);
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.fileName);
  }
}
