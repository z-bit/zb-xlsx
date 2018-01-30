import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from 'app/app-material';

import { ExcelFlexTableContainerComponent } from './containers/excel-flex-table.container';
import { DataTransferService } from './services/data-transfer.service';


@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
  declarations: [
    ExcelFlexTableContainerComponent,
  ],
  exports: [
    ExcelFlexTableContainerComponent,
  ],
  providers: [
    DataTransferService,
  ]
})
export class ExcelFlexTableModule { }

