import { Injectable } from '@angular/core';
import { WhexModel } from '../models/whex.model';


@Injectable()
export class DataTransferService {
  data: WhexModel[];

  setData(data: WhexModel[]) {
    this.data = data;
  }

  getData(): WhexModel[] {
    return this.data;
  }
}