import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from 'app/app-material';

import { XlsxContainerComponent } from './containers/xlsx.container';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
  declarations: [
    XlsxContainerComponent,
  ],
  exports: [
    XlsxContainerComponent,
  ]
})
export class XlsxModule { }

