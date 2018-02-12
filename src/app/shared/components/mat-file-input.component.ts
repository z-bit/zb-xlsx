import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-mat-file-input',
  templateUrl: './mat-file-input.html',
  styleUrls: ['./mat-file-input.scss'],
})
export class MatFileInputComponent {
  @Input() icon: string;
  @Input() hint: string;
  @Input() enabled: boolean;
  @Output() change = new EventEmitter();

  tooltip = 'Datei auswählen';
  fileName = '';

  onChange($event) {
    this.hint = '';
    this.tooltip = 'Knopf ist deaktiviert. \n Seite neu laden, um andere Datei zu bearbeiten.';
    this.enabled = false;
    this.fileName = $event.target.files[0].name;
    this.change.emit($event);
  }
}
