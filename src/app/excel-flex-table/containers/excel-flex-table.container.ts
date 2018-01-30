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
  selector: 'app-excel-flex-table',
  templateUrl: 'excel-flex-table.html',
  styleUrls: ['excel-flex-table.scss'],
})
export class ExcelFlexTableContainerComponent {

  constructor(private dataTranferService: DataTransferService) {}

  inputHint = 'Zur Auswahl bitte auf Excel-Symbol klicken.';
  fileName = '';
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  excel: WS[] = [];
  wsName: string[] = [];
  headers: string[][] = [];
  listOfObjects: any[] = [];
  dataSource: TableDataSource[] =[];

  // für Spalten ohne Header
  reserveHeader = 'Reserve 0';
  generateReserveHeader() {
    const a = this.reserveHeader.split(' ');
    a[1] = (+a[1] + 1).toString();
    this.reserveHeader = a.join(' ');
  }

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
        name = wb.SheetNames[i];
        ws = wb.Sheets[name];
        data = XLSX.utils.sheet_to_json(ws, {header: 1});
        let obj = {};
        this.wsName[i] = name;
        this.headers[i] = data.shift();

        for (let j = 0; j <= data.length; j++) {      // why j <= data.length (2)
          const zeile = data.shift();
          obj = { Zeile: j + 1 };

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
  }

}
