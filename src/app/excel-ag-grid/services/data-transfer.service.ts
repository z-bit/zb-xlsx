import { Injectable } from '@angular/core';

@Injectable()
export class DataTransferService {
  data: any[];

  setData(data) {
    this.data = data;
  }

  getData(): any[] {
    return this.data;
  }
}