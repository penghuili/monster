import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export class InputControl {
  value$: Observable<string>;
  setValue$: Observable<string>;

  private _value$: BehaviorSubject<string>;
  private _setValue$ = new BehaviorSubject<string>('');

  constructor(defaultValue: string = '') {
    this._value$ = new BehaviorSubject<string>(defaultValue);
    this.value$ = this._value$.asObservable();
    this.setValue$ = this._setValue$.asObservable();
  }

  getValue(): string {
    return this._value$.getValue();
  }
  setValue(value: string) {
    this._value$.next(value);
    this._setValue$.next(value);
  }
  receiveValue(value: string) {
    this._value$.next(value);
  }
}
