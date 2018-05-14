import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export interface InputControlOptions {
  required?: boolean;
  value?: string;
}

export class InputControl {
  value$: Observable<string>;
  setValue$: Observable<string>;
  valid: boolean;

  private _value$: BehaviorSubject<string>;
  private _setValue$ = new BehaviorSubject<string>('');
  private required: boolean;

  constructor(options?: InputControlOptions) {
    const value = options && options.value ? options.value : '';
    const required = options ? !!options.required : false;
    this._value$ = new BehaviorSubject<string>(value);
    this.value$ = this._value$.asObservable();
    this.setValue$ = this._setValue$.asObservable();
    this.required = required;
  }

  getValue(): string {
    return this._value$.getValue();
  }
  setValue(value: string) {
    this.valid = this.required ? !!value : true;
    if (this.valid) {
      this._value$.next(value);
      this._setValue$.next(value);
    }
  }
  receiveValue(value: string) {
    this.valid = this.required ? !!value : true;
    this._value$.next(value);
  }
}
