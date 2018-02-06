import { Component } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { RenderComponent } from './render.component';

/**
 * first columnDefs and rowData are defined in the component itself
 */

@Component({
  selector: 'app-fix-grid',
  template: `
      <h3>1. Fixed Grid</h3>
      <ag-grid-angular style="width: 700px; height: 130px;"
                       class="ag-theme-fresh"
                       [gridOptions]="gridOptions"
                       (gridReady)="onGridReady($event)">
      </ag-grid-angular>
  `
})
export class FixGridComponent {
  gridOptions: GridOptions;

  onGridReady(evt) {
    evt.api.sizeColumnsToFit();
    alert('fix-grid: ready');
  }

  constructor() {
    const columnDefs = [
      {headerName: 'Make', field: 'make' },
      {headerName: 'Model', field: 'model'},
      {headerName: 'Price', field: 'price'},
      {headername: 'Status', field: 'status', width: 400, cellRendererFramework: RenderComponent}
    ];

    const heute = new Date();
    let dd = heute.getDate() + '';
    let mm = (heute.getMonth() + 1) + ''; // January is 0
    let yy = heute.getFullYear() + ''; // make it a string
    if (dd.length === 1) { dd = '0' + dd; }
    if (mm.length === 1) { mm = '0' + mm; }
    yy = yy.substr(2);
    const today = dd + '.' + mm + '.' + yy;

    const rowData = [
      {make: 'Toyota', model: 'Celica', price: 35000, status: 'zu buchen'},
      {make: 'Ford', model: 'Mondeo', price: 32000, status: `OK - gebucht ${today}`},
      {make: 'Porsche', model: 'Boxter', price: 72000, status: 'Fehler: Preis zu hoch'},
      {make: 'Trabant', model: 'P601', price: 8000, status: `in Arbeit`},
    ];

    this.gridOptions = <GridOptions>{
      columnDefs,
      rowData,
      enableSorting: true,
    };
  }
}
