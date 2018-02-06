import { NgModule } from '@angular/core';
import { AppMaterialModule } from 'app/app-material';


import { MatFileInputComponent } from './components/mat-file-input.component';

// import { ExcelService } from './services/excel.service';
import { DataTransferService } from './services/data-transfer.service';

@NgModule({
  imports: [
    AppMaterialModule,
  ],
  declarations: [
    MatFileInputComponent,
  ],
  exports: [
    MatFileInputComponent,
  ],
  providers: [
//    ExcelService,
    DataTransferService,
  ]
})
export class SharedModule { }

