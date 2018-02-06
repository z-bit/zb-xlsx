import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-mat-file-input',
  templateUrl: './mat-file-input.html',
  styleUrls: ['./mat-file-input.scss'],
})
export class MatFileInputComponent {
  @Input() icon: string;
  @Input() hint: string;
  @Output() change = new EventEmitter();
  fileName = '';

  onChange($event) {
    this.hint = '';
    this.fileName = $event.target.files[0].name;
    this.change.emit($event);
  }
}
