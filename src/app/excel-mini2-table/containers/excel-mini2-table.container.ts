import { Component } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as XLSX from 'xlsx';

import { ExcelService } from '../../shared/services/excel.service';
import { DataTransferService } from '../services/data-transfer.service';



type AOA = any[][];
interface WS  {
  name: string;
  columnNames: string[];
  tableData: AOA;
  dataSource: TableDataSource;
}

@Component({
  selector: 'app-excel-mini2-table',
  templateUrl: 'excel-mini2-table.html',
  styleUrls: ['excel-mini2-table.scss'],
})
export class ExcelMini2TableContainerComponent {

  constructor(private dataTransferService: DataTransferService) {}

  inputHint = 'Zur Auswahl bitte auf Excel-Symbol klicken.';
  fileName = '';
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  sheets: WS[] = [];


  onFileChange(evt: any) {
    this.sheets = [];
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
      console.log('wb: ', wb);
      for (let i = 0; i < wb.SheetNames.length; i++) {
        const sheet: WS = { name: '', columnNames: [], tableData: [], dataSource: null };
        sheet.name =  wb.SheetNames[i];
        console.log(sheet.name);
        const ws = wb.Sheets[sheet.name];
        console.log('ws: ', ws);
        sheet.tableData = XLSX.utils.sheet_to_json(ws, {header: 1});
        console.log(sheet.tableData);
        sheet.columnNames = sheet.tableData.shift(); // headers = first line = coulmnNames
        console.log(sheet.columnNames);
        const removedHeaderLines = 1;
        sheet.dataSource = this.getDataSource(sheet.columnNames, removedHeaderLines, sheet.tableData);
        console.log(sheet.dataSource);
        this.sheets.push(sheet);
        console.log(this.sheets[i]);
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  private getDataSource( columnNames: string[], removedHeaderLines: number, tableData: AOA): TableDataSource {

    const objects: object[] = [];

    // for each row of tableData
    for (let r = 0; r <= tableData.length; r++) {      // why j <= data.length (2)
      const zeile = tableData.shift();
      const obj =  {}; // { Zeile: r + removedHeaderLines };

      // for each column in the row
      for (let c = 0; c < zeile.length; c++) {
        obj[columnNames[c]] = zeile[c];
      }
      objects[r] = obj;
      // columnNames.unshift('Zeile');
    }

    this.dataTransferService.setData(objects);
    return new TableDataSource(this.dataTransferService);
  }
}

class TableDataSource extends DataSource<any> {
  constructor(private dataTransferService: DataTransferService) {
    super();
  }
  connect(): Observable<object[]> {
    return Observable.of(this.dataTransferService.getData());
  }
  disconnect() {}
}
