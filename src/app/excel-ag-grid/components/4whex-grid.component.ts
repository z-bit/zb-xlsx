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

interface WhexData {
  id: string;
  sheet: string;
  row: string;
  fa: string;
  fi: string;
  kom: string;
  sa: string;
  text: string;
  eknr: string;
  ekdat: string;
  budat: string;
  ekwert: string;
  ausstattung: string;
  eink: string;
  lief: string;
  kart: string;
  kont: string;
  stcd: string;
  stproz: string;
  care: string;
}

@Component({
  selector: 'app-whex-grid',
  templateUrl: './4whex-grid.html',
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
  zeileToCange = 0;

  columnDefs = [
    {headerName: 'Id',        field: 'id',            width: 110, cellStyle: '{text-align: right}', }, // each row
    {headerName: 'Tab',       field: 'sheet',         width: 150 },   // each row
    {headerName: 'Zl',        field: 'row',           width: 110, },  // each row
    {headerName: 'Fa',        field: 'fa',            width: 110, },  // each row
    {headerName: 'Fi',        field: 'fi',            width: 110, },  // each row
    {headerName: 'Komm',      field: 'kom',           width: 150},    // col =  0
    {headerName: 'SA',        field: 'sa',            width: 110, },  // col =  1
    {headerName: 'Text',      field: 'text',          width: 150, },  // col =  2
    {headerName: 'EK-Nr',     field: 'eknr',          width: 150, },  // col =  3
    {headerName: 'EK-Datum',  field: 'ekdat',         width: 150, },  // col =  4
    {headerName: 'Bu-Datum',  field: 'budat',         width: 150, },  // col =  5
    {headerName: 'EK-Wert',   field: 'ekwert',        width: 120, },  // col =  6
    {headerName: 'Ausst.',    field: 'ausstattung',   width: 120, },  // col =  7
    {headerName: 'Eink.',     field: 'eink',          width: 120, },  // col =  8
    {headerName: 'Lief.',     field: 'lief',          width: 120, },  // col =  9
    {headerName: 'K-Art',     field: 'kart',          width: 120, },  // col = 10
    {headerName: 'Kont.',     field: 'kont',          width: 120, },  // col = 11
    {headerName: 'StCD',      field: 'stcd',          width: 120, },  // col = 12
    {headerName: 'StPr',      field: 'stproz',        width: 120, },  // col = 13
    {headerName: 'Care',      field: 'care',          width: 400, cellRendererFramework: RenderComponent, }, // col = 14
  ];

  rowData: Object[];

  gridOptions = <GridOptions>{
      enableSorting: true,
      animateRows: true,
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

  setDatum(val: string) {
    // 01.01.2018
    let datumArray: string[];
    if (val.indexOf('.') > 0) {
      datumArray = val.trim().split('.');
    } else if (val.indexOf('/') > 0) {
      datumArray = val.trim().split('/');
    } else {
      return 'Datumsformat konnte nicht ermittelt werden: ' + val;
    }
    let d: string = datumArray[0]; if (d.length === 1) { d = '0' + d; }
    let m: string = datumArray[1]; if (m.length === 1) { m = '0' + m; }
    const y: string = datumArray[2];
    return d + '.' + m + '.' + y;
  }

  setEuroExcel(val) {
    // in Excel: 0,00 €, komm rein als : 0.00 €
    if (val.trim().indexOf(' ') > 0) {
      // Währung enfernen
      const arr = val.trim().split(' ');
      val = arr[0];
    }
    if (val.indexOf('.') > -1) {
      // Punkt zurück in Komma
      val = val.replace('.', ',');
    }
    if (val.indexOf(',') === -1) {
      // ganze Zahl mit Nachkommastellen auffüllen
      val = val.trim() + ',00';
    }
    if (val.indexOf(',') === 0) {
      // bei Zahlen die mit Komma beginn die Null davorsetzen
      val = '0' + val;
    }
    return val + ' €';
  }
  setEuroSql(val) {
    if (val.trim().indexOf(' ') > 0) {
      // Währung enfernen
      const arr = val.trim().split(' ');
      val = arr[0];
    }
    if (val.indexOf(',') > -1) {
      // bei Zahlen mit Komma brauchts einen Punkt
      val = val.replace(',', '.');
    }
    return val;
  }

  setProzExcel(val) {
    if (!val) {
      return '0,00';
    }
    if (val.indexOf('.') > -1) {
      // Punkt zurück in Komma
      val = val.replace('.', ',');
    }
    if (val.indexOf(',') === -1) {
      // ganze Zahl mit Nachkommastellen auffüllen
      val = val.trim() + ',00';
    }
    if (val.indexOf(',') === 0) {
      // bei Zahlen die mit Komma beginn die Null davorsetzen
      val = '0' + val;
    }
    return val;
  }

  setProzSql(val) {
    if (!val) {
      return '0.00';
    }
    if (val.indexOf(',') > -1) {
      // bei Zahlen mit Komma brauchts einen Punkt
      val = val.replace(',', '.');
    }
    return val;
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
          // zeilenindex (row) = excelZeile -1; 2 Überschriften (0, 1) ausgelassen
          const zeile = data[row];
          if (zeile[0]) {
            data[row][4] = this.setDatum(zeile[4]);
            data[row][5] = this.setDatum(zeile[5]);
            data[row][6] = this.setEuroExcel(zeile[6]);
            data[row][13] = this.setProzExcel(zeile[13]);
/*
            console.log('ekdat', zeile[4] + ' => ' + this.setDatum(zeile[4]));
            console.log('budat', zeile[5] + ' => ' + this.setDatum(zeile[4]));
            console.log('ekwert', zeile[6] + ' , Excel: ' + this.setEuroExcel(zeile[6]) + ' , Sql: ' + this.setEuroSql(zeile[6]));
            console.log('stproz', zeile[13] + ' , Excel: ' + this.setProzExcel(zeile[13]) + ' , Sql: ' + this.setProzSql(zeile[13]));
*/
            const rowDataTmp = {
              ['id']: this.id++,
              ['sheet']: name,
              ['row']: row,
              ['fa']: fa,
              ['fi']: fi,
              ['kom']: zeile[0],
              ['sa']: zeile[1],
              ['text']: zeile[2],
              ['eknr']: zeile[3],
              ['ekdat']: this.setDatum(zeile[4]),
              ['budat']: this.setDatum(zeile[5]),
              ['ekwert']: this.setEuroSql(zeile[6]),
              ['ausstattung']: zeile[7],
              ['eink']: zeile[8],
              ['lief']: zeile[9],
              ['kart']: zeile[10],
              ['kont']: zeile[11],
              ['stcd']: zeile[12],
              ['stproz']: this.setProzSql(zeile[13]),
              ['care']: zeile[14] ? zeile[14] : 'zu buchen',
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
    // creates a new workbook
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

    change_zeile(i): void {
      this.setCare('WH2001', i, '');
      /*
      // put 'Fehler ' in front of it
      // id =126, sheet = WH20101, zeile= 128
      const sheet = this.excelData.find( obj =>  obj.name === 'WH2001');
      console.log('sheet: ', sheet);
      console.log(i);
      const zeile = sheet.data[i-1];
      console.log(`zeile ${i}=>${i-1}: `, zeile);
      const care = zeile[14];
      console.log('care: ', care);
      console.log('care: ', this.getCare('WH2001', i))
      // console.log(this.excelData['WH2001'][126]);
      */
    }

    getCare(tabelle, zeile): string[] {
      /**
       * const sheet = excelData.find( obj =>  obj.name === tabelle);
       * const zeile = sheet.name[zeile]; // zeile - 1
       * const care = zeile[14]               // 15. Spalte (O)
       */
      return this.excelData.find( obj =>  obj.name === tabelle).data[zeile][14];
    }

    setCare(tabelle, zeile, wert): void {
      if (wert === '') {
        wert = 'Fehler: ' + this.getCare(tabelle, zeile);
      }
      // set Excel data
      this.excelData.find( obj =>  obj.name === tabelle).data[zeile][14] = wert;
      // set AgGrid data
      this.rowData.find( (obj: WhexData) => obj.sheet === tabelle && obj.row === zeile)['care'] = wert;
      this.gridOptions.api.setRowData(this.rowData);
      // sort agGrid data

      this.gridOptions.api.setSortModel([{ colId: 'care', sort: 'asc' }]);
    }
}
