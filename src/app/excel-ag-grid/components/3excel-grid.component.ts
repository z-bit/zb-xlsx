import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GridOptions } from 'ag-grid/main';
import * as XLSX from 'xlsx';
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
  selector: 'app-excel-grid',
  template: `
    <h3>3. Excel Grid</h3>
    File Name: {{ fileName }}
    <br><br>
    <div>
      <mat-tab-group>
        <mat-tab *ngFor="let sheet of wsName; let i = index" label="{{sheet}}">
          <ag-grid-angular style="width: 1400px; height: 380px;"
                           class="ag-theme-fresh"
                           [gridOptions]="gridOptions[i]"
                           (gridReady)="onGridReady($event)"
          ></ag-grid-angular>
        </mat-tab>
      </mat-tab-group>
    </div>
  `
})
export class ExcelGridComponent implements OnChanges {
  @Input() fileInputEvent$: Observable<any>;

  fileName = '';
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  excel: WS[] = [];
  wsName: string[] = [];
  headers: string[][] = [];
  fields: string[][] = [];

  gridOptions: GridOptions[] = [];
  columnDef: ColumnDef[];
  rowData: RowData[] = [];

  // für Spalten ohne Header
  reserveHeader = 'Reserve 0';
  generateReserveHeader() {
    const a = this.reserveHeader.split(' ');
    a[1] = (+a[1] + 1).toString();
    this.reserveHeader = a.join(' ');
  }

  ngOnChanges() {
    console.log('excel-grid: ', this.fileInputEvent$);
    if (this.fileInputEvent$) {
      this.fileInputEvent$.subscribe(
        (event) => {
          console.log('excel-grid: ', event);
          this.fileName = event.target.files[0].name;
          const ext: string = this.fileName.split('.').pop().toLowerCase();
          switch (ext) {
            case 'xls':  this.wopts.bookType = 'xls';  break;
            case 'xlsx': this.wopts.bookType = 'xlsx'; break;
            default:
              alert('Ich kann nur ".xls" oder ".xlsx" - Vesuch\'s noch mal!');
              return false;
          }
          this.readExcelFile(event);
        }
      );
    }
  }

  readExcelFile(event) {
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
console.log(wb);
      let ws: XLSX.WorkSheet;
      let name: string;
      let data: AOA;
      this.wsName = [];

      // for each sheet:
      for (let sheet = 0; sheet < wb.SheetNames.length; sheet++) {
        this.gridOptions[sheet] = <GridOptions>{};
        this.columnDef = [];
        this.rowData[sheet] = [];
        this.headers[sheet] = [];
        this.fields[sheet] = [];
        name = wb.SheetNames[sheet];
        this.wsName.push(name);
        ws = wb.Sheets[name];
        data = XLSX.utils.sheet_to_json(ws, {header: 1});

        // for each row
        for (let row = 0; row < data.length; row++) {      // why row <= data.length (2)
          const zeile = data[row];
          const rowDataTmp: RowData = {};
console.log(zeile);
          // for each column
          for (let col = 0; col < zeile.length; col++) {
            if (row === 0) {
              // erste Zeile => Ueberschriften
              this.headers[sheet][col] = zeile[col];
              this.fields[sheet][col] = String.fromCharCode(65 + col); // A, B, C ...
              this.columnDef.push({
                headerName: this.headers[sheet][col],
                field: this.fields[sheet][col],
              });
            } else {
              // alle anderen Zeilen
              if (!this.headers[sheet][col]) {
                this.generateReserveHeader();
                this.headers[sheet][col] = this.reserveHeader;
                this.fields[sheet][col] = String.fromCharCode(65 + col);
              }
              rowDataTmp[this.fields[sheet][col]] = zeile[col];
            }
          }
          this.rowData[sheet].push(rowDataTmp);
        }
        // remove the header line
        this.rowData[sheet].shift();
        console.log('columnDefs: ', this.columnDef);
        console.log('rowData: ', this.rowData[sheet]);

        this.gridOptions[sheet] = {
          columnDefs: this.columnDef,
          rowData: <RowData[]>this.rowData[sheet],
          enableSorting: true,
        };
        console.log(this.gridOptions[sheet]);
      }
    };
    reader.readAsBinaryString(event.target.files[0]);
  }
  onGridReady() {}
}
