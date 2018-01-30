import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from 'app/app-material';

import { Table1ContainerComponent } from './items/cn_table1.container';



@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
  declarations: [
    Table1ContainerComponent,
  ],
  exports: [
    Table1ContainerComponent,
  ]
})
export class Table1Module { }

