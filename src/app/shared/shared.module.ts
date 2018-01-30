import { NgModule } from '@angular/core';

import { ExcelService } from './services/excel.service';
import { DataTransferService } from './services/data-transfer.service';

@NgModule({
  imports: [

  ],
  declarations: [

  ],
  exports: [

  ],
  providers: [
    ExcelService,
    DataTransferService,
  ]
})
export class SharedModule { }

