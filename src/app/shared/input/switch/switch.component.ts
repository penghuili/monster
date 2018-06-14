import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mst-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitchComponent {
  @Input() set defaultValue(value: boolean) {
    this._defaultValue = value;
    this.yes = !!this._defaultValue;
  }
  @Input() set timestamp(value: number) {
    this.yes = !!this._defaultValue;
  }
  @Output() switched = new EventEmitter<boolean>();

  yes: boolean;
  private _defaultValue: boolean;

  onClick() {
    this.yes = !this.yes;
    this.switched.emit(this.yes);
  }
}
