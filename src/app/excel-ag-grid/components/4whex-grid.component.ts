import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';


import { GridOptions } from 'ag-grid/main';
import * as XLSX from 'xlsx';
import {isNumber} from 'util';

// for whex-grid
import { RenderComponent } from './render.component';
import {saveAs} from 'file-saver';

/**
 * forth: ExcelData from WS[] are flattened and meta data are added
 */
type AOA = any[][];
interface WS  {
    name: string;
    data: AOA;
}

@Component({
  selector: 'app-whex-grid',
  template: `
    <h3>4. WHex Grid</h3>

    <mat-card>
      <mat-card-title>Datei: {{ fileName }}</mat-card-title>
      <mat-card-content>
        <ag-grid-angular style="width: 1600px; height: 600px; font-size: x-small"
                         class="ag-theme-fresh"
                         [gridOptions]="gridOptions"
                         (gridReady)="onGridReady($event)"
        ></ag-grid-angular>
      </mat-card-content>
      <mat-card-actions>
        <a mat-raised-button (click)="schreiben()">Schreiben</a>
        <a mat-raised-button (click)="export()">Create new</a>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .right { float: right}
  `],
})
export class WhexGridComponent implements OnChanges {
  @Input() fileInputEvent$: Observable<any>;
  id = 0;
  fileName = 'download.xlsx';
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  excelData: WS[] = [];
  data: AOA = [ [1, 2], [3, 4] ]; // for tests creating an Excel file
  sheetCheck = '';

  columnDefs = [
    {headerName: 'Id',        field: 'id',    width: 110, cellStyle: '{text-align: right}', },          // each row
    {headerName: 'Tab',       field: 'sheet', width: 150 }, // each row
    {headerName: 'Zl',        field: 'row',   width: 110, },      // each row
    {headerName: 'Fa',        field: 'fa',    width: 110, },          // each row
    {headerName: 'Fi',        field: 'fi',    width: 110, },          // each row
    {headerName: 'Komm',      field: 'kom',   width: 150},           // col =  0
    {headerName: 'SA',        field: 'sa',    width: 110, },               // col =  1
    {headerName: 'Text',      field: 'text',          width: 150, },                // col =  2
    {headerName: 'EK-Nr',     field: 'eknr',          width: 150, },               // col =  3
    {headerName: 'EK-Datum',  field: 'ekdat',         width: 150, },           // col =  4
    {headerName: 'Bu-Datum',  field: 'budat',         width: 120, },        // col =  5
    {headerName: 'EK-Wert',   field: 'ekwert',        width: 120, },      // col =  6
    {headerName: 'Ausst.',    field: 'ausstattung',   width: 120, },  // col =  7
    {headerName: 'Eink.',     field: 'eink',          width: 120, },          // col =  8
    {headerName: 'Lief.',     field: 'lief',          width: 120, },           // col =  9
    {headerName: 'K-Art',     field: 'kart',          width: 120, },               // col = 10
    {headerName: 'Kont.',     field: 'kont',          width: 120, },          // col = 11
    {headerName: 'StCD',      field: 'stcd',          width: 120, },                // col = 12
    {headerName: 'StPr',      field: 'stproz',        width: 120, },              // col = 13
    {headerName: 'Care',      field: 'care',          width: 400, cellRendererFramework: RenderComponent, },                // col = 14
  ];

  rowData: Object[];

  gridOptions = <GridOptions>{
      enableSorting: true,
      columnDefs: this.columnDefs,
  };
/*
  rowData: RowData[] = [
    {
      ['fa']: '20',
      ['fi']: '01',
      ['kom']: '12345',
      ['sa']: '300',
      ['text']: 'text',
      ['eknr']: 'eknr',
      ['ekdat']: 'ekdat',
      ['budat']: undefined,
      ['ekwert']: 'ekwert',
      ['ausstattung']: 'a',
      ['eink']: 'e',
      ['lief']: 'l',
      ['kart']: 'kart',
      ['kont']: 'kont',
      ['stcd']: 'stcd',
      ['stproz']: 'st',
      ['care']: 'care',
      ['id']: this.id++,
      ['sheet']: 'sheet',
      ['row']: 3,
    },
    {
      ['fa']: '20',
      ['fi']: '01',
      ['kom']: '12345',
      ['sa']: '300',
      ['text']: 'text',
      ['eknr']: 'eknr',
      ['ekdat']: 'ekdat',
      ['budat']: undefined,
      ['ekwert']: 'ekwert',
      ['ausstattung']: 'a',
      ['eink']: 'e',
      ['lief']: 'l',
      ['kart']: 'kart',
      ['kont']: 'kont',
      ['stcd']: 'stcd',
      ['stproz']: 'st',
      ['care']: 'care',
      ['id']: this.id++,
      ['sheet']: 'sheet',
      ['row']: 3,
  }
];

  constructor() {
    this.gridOptions = {
      columnDefs: this.columnDefs,
      rowData: this.rowData,
      enableSorting: true,
    };
    console.log('gridOptions: ', this.gridOptions);
  }
*/
  ngOnChanges() {
    this.id = 0;
    this.rowData = [];
    console.log('whex-grid: ', this.fileInputEvent$);
    if (this.fileInputEvent$) {
      this.fileInputEvent$
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
        if (this.sheetCheck.indexOf(name) > -1) {
          // ws bereits verarbeitet
          continue;
        } else {
            // in checklist aufnehmen
          this.sheetCheck += '<>' + name;
        }
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

        // Merken der Original-Daten, damit sie später wieder so ausgegeben werden können
        const excelTabelle: WS = { name, data };
        this.excelData.push(excelTabelle);

        // for each row
        for (let row = 2; row < data.length; row++) {      // why row <= data.length (2)
          const zeile = data[row];
          if (zeile[0]) {
            const rowDataTmp = {
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
              ['care']: zeile[14] ? zeile[14] : 'zu buchen',
              ['id']: this.id++,
              ['sheet']: name,
              ['row']: row,
            };
            this.rowData.push(rowDataTmp);
          }
        }
      }
      this.gridOptions.api.setRowData(this.rowData);
      console.log('rowData: ', this.rowData);
      console.log('gridOptions: ', this.gridOptions);
    };
    reader.readAsBinaryString(event.target.files[0]);
  }

  onGridReady(evt) {
    evt.api.sizeColumnsToFit();
  }

    export(): void {
        this.data[0] = [];
        this.data[0][0] = 99.01;
        console.log('data[0][0]: ', this.data[0][0]);
        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        const wbout: ArrayBuffer = XLSX.write(wb, this.wopts);
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.fileName);
    }

    schreiben(): void {
    alert('schreiben');
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        console.log('wb: ', wb);
        for (let i = 0; i < this.excelData.length; i++) {
            const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.excelData[i].data);
            console.log('ws: ', ws);
            XLSX.utils.book_append_sheet(wb, ws, this.excelData[i].name);
        }
        const wbout: ArrayBuffer = XLSX.write(wb, this.wopts);
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.fileName);
    }
}
