import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export interface InputControlOptions {
  required?: boolean;
  value?: string;
}
export interface InputControlSetOptions {
  emitEvent?: boolean;
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
    this.required = options ? !!options.required : false;
    this.valid = this.isValid(value);

    this._value$ = new BehaviorSubject<string>(value);
    this.value$ = this._value$.asObservable();
    this.setValue$ = this._setValue$.asObservable();
  }

  getValue(): string {
    return this._value$.getValue();
  }
  setValue(value: string, options: InputControlSetOptions = {emitEvent: true}) {
    this.valid = this.isValid(value);
    if (this.valid) {
      this._setValue$.next(value);
      if (options && options.emitEvent) {
        this._value$.next(value);
      }
    }
  }
  receiveValue(value: string) {
    this.valid = this.isValid(value);
    this._value$.next(value);
  }
  reset() {
    this._setValue$.next('');
    this._value$.next('');
    this.valid = this.isValid('');
  }

  private isValid(value: string) {
    return this.required ? !!value : true;
  }
}
