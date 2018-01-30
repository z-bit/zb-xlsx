import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { AppMaterialModule } from './app-material';


import { XlsxModule } from './xlsx/xlsx.module';
import { Table1Module } from './table1/table1.module';
import { Table2Module } from './table2/table2.module';
import { ExcelTableModule } from './excel-table/excel-table.module';
import { ExcelMiniTableModule } from './excel-mini-table/excel-mini-table.module';
import { ExcelMini2TableModule } from './excel-mini2-table/excel-mini2-table.module';
import { ExcelFlexTableModule } from './excel-flex-table/excel-flex-table.module';


import { AppComponent } from './app-root/components/app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    XlsxModule,
    Table1Module,
    Table2Module,
    ExcelTableModule,
    ExcelMiniTableModule,
    ExcelMini2TableModule,
    ExcelFlexTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
