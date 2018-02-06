import { Routes, RouterModule } from '@angular/router';

import { ExcelFlexTableContainerComponent } from './excel-flex-table/containers/excel-flex-table.container';
import { ExcelMiniTableContainerComponent } from './excel-mini-table/containers/excel-mini-table.container';
import { ExcelMini2TableContainerComponent } from './excel-mini2-table/containers/excel-mini2-table.container';
import { Table1ContainerComponent } from './table1/items/cn_table1.container';
import { Table2ContainerComponent } from './table2/containers/table2.container';
import { XlsxContainerComponent } from './xlsx/containers/xlsx.container';
import { ExcelAgGridContainerComponent } from './excel-ag-grid/containers/excel-ag-grid.container';


const routes: Routes = [
  { path: '', component: ExcelFlexTableContainerComponent },
  { path: 'aggrid', component: ExcelAgGridContainerComponent },
  { path: 'flex', component: ExcelFlexTableContainerComponent },
  { path: 'mini', component: ExcelMiniTableContainerComponent },
  { path: 'mini2', component: ExcelMini2TableContainerComponent },
  { path: 'table1', component: Table1ContainerComponent },
  { path: 'table2', component: Table2ContainerComponent },
  { path: 'xlsx', component: XlsxContainerComponent },

];

export const AppRouting = RouterModule.forRoot(routes);
