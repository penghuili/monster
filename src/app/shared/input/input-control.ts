import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export interface InputControlOptions<T> {
  required?: boolean;
  value?: T;
}
export interface InputControlSetOptions {
  emitEvent?: boolean;
}

export class InputControl<T> {
  value$: Observable<T>;
  setValue$: Observable<T>;
  valid: boolean;

  private _value$: BehaviorSubject<T>;
  private _setValue$ = new BehaviorSubject<T>(undefined);
  private required: boolean;

  constructor(options?: InputControlOptions<T>) {
    const value = options ? options.value : undefined;
    this.required = options ? !!options.required : false;
    this.valid = this.isValid(value);

    this._value$ = new BehaviorSubject<T>(value);
    this.value$ = this._value$.asObservable();
    this.setValue$ = this._setValue$.asObservable();
  }

  getValue(): T {
    return this._value$.getValue();
  }
  setValue(value: T, options: InputControlSetOptions = {emitEvent: true}) {
    this.valid = this.isValid(value);
    if (this.valid) {
      this._setValue$.next(value);
      if (options && options.emitEvent) {
        this._value$.next(value);
      }
    }
  }
  receiveValue(value: T) {
    this.valid = this.isValid(value);
    this._value$.next(value);
  }
  reset() {
    this._setValue$.next(undefined);
    this._value$.next(undefined);
    this.valid = this.isValid(undefined);
  }

  private isValid(value: T) {
    if (this.required) {
      if (typeof value === 'string') {
        return value !== undefined && value !== null && value !== '';
      } else {
        return value !== undefined && value !== null;
      }
    } else {
      return true;
    }
  }
}
