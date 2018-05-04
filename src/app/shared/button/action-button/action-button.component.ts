import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mst-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionButtonComponent {
  @Input() showPlus = false;
  @Output() clicked = new EventEmitter<boolean>();
  showContent = false;

  onClick() {
    this.showContent = true;
    this.clicked.emit(true);
  }
  onHideContent() {
    this.showContent = false;
  }
}
