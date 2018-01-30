import { Component, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { WhexModel, whexInit } from '../models/whex.model';
import { DataTransferService } from '../services/data-transfer.service';


type AOA = any[][];
interface WS  {
  name: string;
  data: AOA;
}

class WhexDataSource extends DataSource<any> {

  constructor(private dataTransferService: DataTransferService) {
    super();
  }
  connect(): Observable<WhexModel[]> {
    return Observable.of(this.dataTransferService.getData());
  }
  disconnect() {}
}


@Component({
  selector: 'app-excel-table',
  templateUrl: './excel-table.html',
  styleUrls: ['./excel-table.scss'],
})
export class ExcelTableContainerComponent {
  whexFields = ['kom', 'satzart', 'text', 'eknr', 'ekdatum', 'budatum', 'ekwert', 'ausstattung',
                'ekbkz', 'lieferant', 'ka', 'kont', 'stcd', 'stpr', 'care', 'bem1', 'bem2'];
  inputHint = 'Zur Auswahl bitte auf Excel-Symbol klicken.';
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName = '';
  sheetNames: string[] = [];
  excel: WS[] = [];
  obj: WhexModel = whexInit;
  table: WhexModel[] = [];
  // excel$: Observable<WhexModel[]>[] = [];
  excel$: WhexDataSource[] = [];
  headers: any[] = [];
  subheaders: any[] = [];

  constructor(private dataTransferService: DataTransferService) {}

  onFileChange(evt: any) {
    this.inputHint = '';
    const target: DataTransfer = <DataTransfer>(evt.target);

    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    this.fileName = target.files[0].name;
    const ext: string = this.fileName.split('.').pop().toLowerCase();

    switch (ext) {
      case 'xls' :
        this.wopts.bookType = 'xls';
        break;
      case 'xlsx':
        this.wopts.bookType = 'xlsx';
        break;
      default:
        alert('Ich kann nur ".xls" oder ".xlsx" - Vesuch\'s noch mal!');
        console.log(document.getElementById('input'));
        return false;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      // let wb: XLSX.WorkBook = null;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      let name: string;
      let ws: XLSX.WorkSheet;
      let data: AOA;
      for (let i = 0; i < wb.SheetNames.length; i++) {
        name = wb.SheetNames[i];
        ws = wb.Sheets[name];
        data = XLSX.utils.sheet_to_json(ws, {header: 1});
        this.headers.push(this.excel[i].data.shift());
        this.subheaders.push(this.excel[i].data.shift());
        this.sheetNames[i] = name;
        this.excel[i] = { name, data };
        // xx
        for (let j = 0; j < this.excel[i].data.length; j++) {
          this.table = [];
          this.obj = whexInit;
          for (let k = 0; k <= 16; k++) {
            const key = this.whexFields[k];
            this.obj[key] = this.excel[i].data[j][k] ? this.excel[i].data[j][k] : '';
          }
          this.table.push(this.obj);
        }
        this.dataTransferService.setData(this.table);
        const dataSource: WhexDataSource = new WhexDataSource(this.dataTransferService);
        this.excel$.push(dataSource);
      }

      console.log(this.headers[1]);
      console.log(this.subheaders[1]);
      console.log(this.excel[1].data);
      console.log(this.excel$);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  schreiben(): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    for (let i = 0; i < this.excel.length; i++) {
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.excel[i].data);
      XLSX.utils.book_append_sheet(wb, ws, this.excel[i].name);
    }
    const wbout: ArrayBuffer = XLSX.write(wb, this.wopts);
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.fileName);
  }
}

/*
var fileInputTextDiv = document.getElementById('file_input_text_div');
var fileInput = document.getElementById('file_input_file');
var fileInputText = document.getElementById('file_input_text');

fileInput.addEventListener('change', changeInputText);
fileInput.addEventListener('change', changeState);

function changeInputText() {
  var str = fileInput.value;
  var i;
  if (str.lastIndexOf('\\')) {
    i = str.lastIndexOf('\\') + 1;
  } else if (str.lastIndexOf('/')) {
    i = str.lastIndexOf('/') + 1;
  }
  fileInputText.value = str.slice(i, str.length);
}

function changeState() {
  if (fileInputText.value.length != 0) {
    if (!fileInputTextDiv.classList.contains("is-focused")) {
      fileInputTextDiv.classList.add('is-focused');
    }
  } else {
    if (fileInputTextDiv.classList.contains("is-focused")) {
      fileInputTextDiv.classList.remove('is-focused');
    }
  }
}
*/