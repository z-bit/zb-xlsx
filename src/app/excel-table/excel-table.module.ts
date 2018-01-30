import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from 'app/app-material';

import { ExcelTableContainerComponent } from './containers/excel-table.container';
import { DataTransferService } from './services/data-transfer.service';


@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
  declarations: [
    ExcelTableContainerComponent,
  ],
  exports: [
    ExcelTableContainerComponent,
  ],
  providers: [
    DataTransferService,
  ]
})
export class ExcelTableModule { }

