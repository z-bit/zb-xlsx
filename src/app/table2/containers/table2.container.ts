import { Component } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';

class UserDataSource extends DataSource<any> {

  constructor(private userService: UserService) {
    super();
  }

  connect(): Observable<UserModel[]> {
    return this.userService.getUser();
  }

  disconnect() {}
}

/**
 * @title User Table
 * @source https://medium.com/codingthesmartway-com-blog/angular-material-part-4-data-table-23874582f23a
 */
@Component({
  selector: 'app-table2',
  templateUrl: 'table2.html',
  styleUrls: ['table2.scss'],
})
export class Table2ContainerComponent {

  constructor( private userService: UserService) {}

  dataSource = new UserDataSource(this.userService);
  displayedColumns = [ 'name', 'email', 'phone', 'company' ];
}

