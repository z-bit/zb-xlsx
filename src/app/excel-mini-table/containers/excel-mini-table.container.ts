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
  selector: 'app-excel-mini-table',
  templateUrl: 'excel-mini-table.html',
  styleUrls: ['excel-mini-table.scss'],
})
export class ExcelMiniTableContainerComponent {

  constructor(private dataTranferService: DataTransferService) {}

  inputHint = 'Zur Auswahl bitte auf Excel-Symbol klicken.';
  fileName = '';
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  excel: WS;
  wsName: string;
  headers: string[] = [];
  listOfObjects: any[] = [];
  dataSource: TableDataSource;

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
      const name = wb.SheetNames[0];
      this.wsName = name;
      const ws = wb.Sheets[name];
      const data: AOA = XLSX.utils.sheet_to_json(ws, {header: 1});
      this.headers = data.shift();
      console.log(data.length);
      for (let j = 0; j <= data.length; j++) {      // why j <= data.length (2)
        const zeile = data.shift();
        const obj = { Zeile: j + 1 };
        for (let k = 0; k < zeile.length; k++) {
          obj[this.headers[k]] = zeile[k];
        }
        this.listOfObjects.push(obj);
      }
      this.headers.unshift('Zeile');
      console.log(this.headers);
      console.log(this.listOfObjects);
      this.dataTranferService.setData(this.listOfObjects);
      this.dataSource = new TableDataSource(this.dataTranferService);
    };
    reader.readAsBinaryString(target.files[0]);
  }

}
