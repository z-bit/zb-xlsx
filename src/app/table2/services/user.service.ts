import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserService {

  private serviceUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  getUser(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.serviceUrl);
  }
}
