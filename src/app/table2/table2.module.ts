import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from 'app/app-material';
import { HttpClientModule } from '@angular/common/http';

import { UserService } from './services/user.service';

import { Table2ContainerComponent } from './containers/table2.container';



@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    HttpClientModule,
  ],
  declarations: [
    Table2ContainerComponent,
  ],
  exports: [
    Table2ContainerComponent,
  ],
  providers: [
    UserService,
  ],
})
export class Table2Module { }

