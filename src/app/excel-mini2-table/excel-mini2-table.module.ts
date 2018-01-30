import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from 'app/app-material';

import { ExcelMini2TableContainerComponent } from './containers/excel-mini2-table.container';
import { DataTransferService } from './services/data-transfer.service';


@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
  declarations: [
    ExcelMini2TableContainerComponent,
  ],
  exports: [
    ExcelMini2TableContainerComponent,
  ],
  providers: [
    DataTransferService,
  ]
})
export class ExcelMini2TableModule { }

