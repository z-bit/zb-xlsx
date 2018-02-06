import { Component } from '@angular/core';

@Component({
  selector: 'app-rendern-component',
  template: `
      <span class="{{css}}">{{ params.value }}</span>
  `,
  styles: [`
    .good {
        color: green;
        font-weight: bold;
    }
    .bad {
        color: red;
        font-weight: bold;
    }
    .work {
        color: blue;
        font-weight: bold;
    }
  `]
})
export class RenderComponent {
  private params: any;
  private css: string;

  agInit(params: any) {
    switch (params.value.substr(0, 2)) {
      case 'in': this.css = 'work'; break;
      case 'Fe': this.css = 'bad'; break;
      case 'OK': this.css = 'good'; break;
      default: this.css = '';
    }
    this.params = params;
  }
}