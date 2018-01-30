import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from 'app/app-material';

import { ExcelMiniTableContainerComponent } from './containers/excel-mini-table.container';
import { DataTransferService } from './services/data-transfer.service';


@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
  declarations: [
    ExcelMiniTableContainerComponent,
  ],
  exports: [
    ExcelMiniTableContainerComponent,
  ],
  providers: [
    DataTransferService,
  ]
})
export class ExcelMiniTableModule { }

