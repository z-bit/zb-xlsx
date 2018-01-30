import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { DataTransferService } from './data-transfer.service';

class TableDataSource extends DataSource<any> {
  constructor(private dataTransferService: DataTransferService) {
    super();
  }
  connect(): Observable<object[]> {
    return Observable.of(this.dataTransferService.getData());
  }
  disconnect() {}
}

type AOA = any[][];

Injectable()
export class ExcelService {

  constructor(private dataTransferService: DataTransferService) {}

  getDataSource( columnNames: string[], removedHeaderLines: number, tableData: AOA): TableDataSource {

    const objects: object[] = [];

    // for each row of tableData
    for (let r = 0; r <= tableData.length; r++) {      // why j <= data.length (2)
      const zeile = tableData.shift();
      const obj = { Zeile: r + removedHeaderLines };

      // for each column in the row
      for (let c = 0; c < zeile.length; c++) {
        obj[columnNames[c]] = zeile[c];
      }
      objects[r] = obj;
      columnNames.unshift('Zeile');
    }

    this.dataTransferService.setData(objects);
    return new TableDataSource(this.dataTransferService);
  }

}
