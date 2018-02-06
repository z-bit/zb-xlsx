import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular/main';

import { AppMaterialModule } from 'app/app-material';
import { SharedModule } from 'app/shared/shared.module';


import { ExcelAgGridContainerComponent } from './containers/excel-ag-grid.container';
import { FixGridComponent } from './components/1fix-grid.component';
import { FlexiGridComponent } from './components/2flexi-grid.component';

import { ExcelGridComponent } from './components/3excel-grid.component';
import { WhexGridComponent } from './components/4whex-grid.component';

import { RenderComponent } from './components/render.component';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule.withComponents([RenderComponent]),
    AppMaterialModule,
    SharedModule,
  ],
  declarations: [
    ExcelAgGridContainerComponent,
    FixGridComponent,
    FlexiGridComponent,
    ExcelGridComponent,
    WhexGridComponent,
    RenderComponent,
  ],
  exports: [
    ExcelAgGridContainerComponent,
  ],
  providers: [
  ]
})
export class ExcelAgGridModule { }

