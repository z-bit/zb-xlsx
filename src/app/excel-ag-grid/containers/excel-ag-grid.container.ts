import { Component } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as XLSX from 'xlsx';

import { DataTransferService } from '../services/data-transfer.service';

type AOA = any[][];
interface WS  {
  name: string;
  data: AOA;
}
class TableDataSource extends DataSource<any> {

  constructor(private dataTransferService: DataTransferService) {
    super();
  }
  connect(): Observable<any[]> {
    return Observable.of(this.dataTransferService.getData());
  }
  disconnect() {}
}

@Component({
  selector: 'app-excel-ag-grid',
  templateUrl: './excel-ag-grid.html',
  styleUrls: ['./excel-ag-grid.scss']
})
export class ExcelAgGridContainerComponent {
  icon = 'assets/excel_round_202.png';
  hint = 'Zur Auswahl bitte auf Excel-Symbol klicken.';
  enabled = true;
  today: string;

  rowData = [
    {make: 'Toyota', model: 'Celica', price: 35000, status: 'zu buchen'},
    {make: 'Ford', model: 'Mondeo', price: 32000, status: `OK - gebucht ${this.today}`},
    {make: 'Porsche', model: 'Boxter', price: 72000, status: 'Fehler: Preis zu hoch'},
    {make: 'Trabant', model: 'P601', price: 8000, status: `in Arbeit`},
  ];

  fileName = '';
  fileInputEvent$: Observable<any>;
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  excel: WS[] = [];
  wsName: string[] = [];
  headers: string[][] = [];
  listOfObjects: any[][] = [];
  dataSource: TableDataSource[] = [];

  // für Spalten ohne Header
  reserveHeader = 'Reserve 0';
  generateReserveHeader() {
    const a = this.reserveHeader.split(' ');
    a[1] = (+a[1] + 1).toString();
    this.reserveHeader = a.join(' ');
  }



  constructor() {
    const heute = new Date();
    let dd = heute.getDate() + '';
    let mm = (heute.getMonth() + 1) + ''; // January is 0
    let yy = heute.getFullYear() + ''; // make it a string
    if (dd.length === 1) { dd = '0' + dd; }
    if (mm.length === 1) { mm = '0' + mm; }
    yy = yy.substr(2);
    this.today = dd + '.' + mm + '.' + yy;

  }


onChange(event) {
    console.log('changed: ' + event.target.files[0].name);
    console.log('changed: ', event);
    this.fileInputEvent$ = Observable.of(event);
    console.log('changed: ', this.fileInputEvent$);
    /*
    const target: DataTransfer = <DataTransfer>(event.target);

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
        return false;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      let name: string;
      let ws: XLSX.WorkSheet;
      let data: AOA;

      for (let i = 0; i < wb.SheetNames.length; i++) {
        this.listOfObjects[i] = [];
      }
      for (let i = 0; i < wb.SheetNames.length; i++) {
        name = wb.SheetNames[i];
        ws = wb.Sheets[name];
        data = XLSX.utils.sheet_to_json(ws, {header: 1});
        let obj = {};
        this.wsName[i] = name;
        this.headers[i] = data.shift();

        for (let j = 0; j <= data.length; j++) {      // why j <= data.length (2)
          const zeile = data.shift();
          console.log(zeile);
          obj = { Zeile: j + 1 };
          console.log(obj);
          for (let k = 0; k < zeile.length; k++) {
            if (!this.headers[i][k]) {
              this.generateReserveHeader();
              this.headers[i][k] = this.reserveHeader;
            }
            obj[this.headers[i][k]] = zeile[k];
          }
        }
        this.listOfObjects[i].push(obj);
        this.headers[i].unshift('Zeile');
        console.log(this.headers[i]);
        console.log(this.listOfObjects[i]);

        this.dataTranferService.setData(this.listOfObjects[i]);
        this.dataSource[i] = new TableDataSource(this.dataTranferService);
      }
    };
    reader.readAsBinaryString(target.files[0]);
    */
  }
}
