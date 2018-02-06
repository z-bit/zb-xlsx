import { Component, Input, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { RenderComponent } from './render.component';

/**
 * second: rowData come from container
 */

@Component({
  selector: 'app-flexi-grid',
  template: `
      <h3>2. Flexi Grid</h3>
      <ag-grid-angular style="width: 700px; height: 130px;"
                       class="ag-theme-fresh"
                       [gridOptions]="gridOptions"
                       (gridReady)="onGridReady($event)">
      </ag-grid-angular>
  `
})
export class FlexiGridComponent implements OnInit {
  gridOptions: GridOptions;
  @Input() rowData: any[];

  ngOnInit() {
    const columnDefs = [
      {headerName: 'Make', field: 'make' },
      {headerName: 'Model', field: 'model'},
      {headerName: 'Price', field: 'price'},
      {headername: 'Status', field: 'status', width: 400, cellRendererFramework: RenderComponent}
    ];
    this.gridOptions = <GridOptions>{
      columnDefs,
      rowData: this.rowData,
      enableSorting: true,
    };
  }
  onGridReady(evt) {
    evt.api.sizeColumnsToFit();
    alert('flexi-grid: ready');
  }

  constructor() {}
}
