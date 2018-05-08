import { Component } from '@angular/core';

@Component({
  selector: 'mst-go-back',
  templateUrl: './go-back.component.html',
  styleUrls: ['./go-back.component.scss']
})
export class GoBackComponent {
  onBack() {
    window.history.back();
  }
}
