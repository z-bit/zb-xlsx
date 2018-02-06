import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import { GridOptions } from 'ag-grid/main';
import * as XLSX from 'xlsx';
import {isNumber} from "util";
import {validate} from "codelyzer/walkerFactory/walkerFn";
// for whex-grid
// import { RenderComponent } from './render.component';

/**
 * third: ExcelData come as WS[];
 */
type AOA = any[][];
interface WS  {
  name: string;
  data: AOA;
}
interface ColumnDef {
  headerName: string;
  field: string;
}
interface RowData {
  [key: string]: any;
}

@Component({
  selector: 'app-whex-grid',
  template: `
    <h3>4. WHex Grid</h3>
    File Name: {{ fileName }}
    <br><br>
    <ag-grid-angular style="width: 1400px; height: 380px;"
                     class="ag-theme-fresh"
                     [gridOptions]="gridOptions"
                     (gridReady)="onGridReady($event)"
    ></ag-grid-angular>
  `
})
export class WhexGridComponent implements OnChanges {
  @Input() fileInputEvent$: Observable<any>;
  id = 0;
  fileName = '';
  rowData: RowData = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

  gridOptions: GridOptions = {};
  columnDef: ColumnDef[] = [
    {headerName: 'Id', field: 'id'},          // each row
    {headerName: 'Tabelle', field: 'sheet' }, // each row
    {headerName: 'Zeile', field: 'row'},      // each row
    {headerName: 'Fa', field: 'fa'},          // each row
    {headerName: 'Fi', field: 'fi'},          // each row
    {headerName: 'Kommission', field: 'kom'},           // col =  0
    {headerName: 'Satzart', field: 'sa'},               // col =  1
    {headerName: 'Text', field: 'text'},                // col =  2
    {headerName: 'EK-Nr', field: 'eknr'},               // col =  3
    {headerName: 'EK-Datum', field: 'ekdat'},           // col =  4
    {headerName: 'Buch-Datum', field: 'budat'},         // col =  5
    {headerName: 'Einkaufswert', field: 'ekwert'},      // col =  6
    {headerName: 'Ausstattung', field: 'ausstattung'},  // col =  7
    {headerName: 'Einkaeufer', field: 'eink'},          // col =  8
    {headerName: 'Lieferant', field: 'lief'},           // col =  9
    {headerName: 'K-Art', field: 'kart'},               // col = 10
    {headerName: 'Kontierung', field: 'kont'},          // col = 11
    {headerName: 'StCD', field: 'stcd'},                // col = 12
    {headerName: 'StPr', field: 'stproz'},              // col = 13
    {headerName: 'Care', field: 'care'},                // col = 14
  ];

  ngOnChanges() {
    this.id = 0;
    this.rowData = [];
    this.gridOptions = {};
    console.log('whex-grid: ', this.fileInputEvent$);
    if (this.fileInputEvent$) {
      this.fileInputEvent$
        .take(1)
        .subscribe( (event) => {
          console.log('subscribe started');
          this.fileName = event.target.files[0].name;
          const ext: string = this.fileName.split('.').pop().toLowerCase();
          switch (ext) {
            case 'xls':  this.wopts.bookType = 'xls';  break;
            case 'xlsx': this.wopts.bookType = 'xlsx'; break;
            default:
              alert('Ich kann nur ".xls" oder ".xlsx" - Vesuch\'s noch mal!');
              return false;
          }
          this.readExcelWhexFile(event);
      });
    }
  }

  readExcelWhexFile(event) {
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      let ws: XLSX.WorkSheet;
      let name: string;
      let data: AOA;
      let fa: string;
      let fi: string;

      // for each sheet:
      for (let sheet = 0; sheet < wb.SheetNames.length; sheet++) {
        name = wb.SheetNames[sheet];
        if (name.substr(0, 2) === 'WH' && isNumber(Number(name.substr(2, 4))) && name.length === 6) {
          fa = name.substr(2, 2);
          fi = name.substr(4, 2);
        } else {
          console.log(name.substr(0, 2));
          console.log(Number(name.substr(2, 4)));
          console.log(isNumber(Number(name.substr(2, 4))));
          console.log(name.length);
          alert(`Tabelle ${name} ist nicht im Format WHxxyy \n
                 mit xx = Firma und yy = Filiale \n
                 und wurde daher von der Verarbeitung ausgeschlossen.`);
          continue;
        }
        ws = wb.Sheets[name];
        data = XLSX.utils.sheet_to_json(ws, {header: 1});

        // for each row
        for (let row = 2; row < data.length; row++) {      // why row <= data.length (2)
          const zeile = data[row];
          if (zeile[0]) {
            const rowDataTmp: RowData = {
              ['fa']: fa,
              ['fi']: fi,
              ['kom']: zeile[0],
              ['sa']: zeile[1],
              ['text']: zeile[2],
              ['eknr']: zeile[3],
              ['ekdat']: zeile[4],
              ['budat']: zeile[5],
              ['ekwert']: zeile[6],
              ['ausstattung']: zeile[7],
              ['eink']: zeile[8],
              ['lief']: zeile[9],
              ['kart']: zeile[10],
              ['kont']: zeile[11],
              ['stcd']: zeile[12],
              ['stproz']: zeile[13],
              ['care']: zeile[14],
              ['id']: this.id++,
              ['sheet']: name,
              ['row']: row,
            };
            this.rowData.push(rowDataTmp);
          }
        }
      }
      this.gridOptions = {
        columnDefs: this.columnDef,
        rowData: <RowData[]>this.rowData,
        enableSorting: true,
      };
      console.log(this.gridOptions);
    };
    reader.readAsBinaryString(event.target.files[0]);
  }

  onGridReady(evt) {
    evt.api.sizeColumnsToFit();
  }
}
