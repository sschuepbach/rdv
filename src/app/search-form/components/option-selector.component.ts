import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-option-selector',
  template: `
    <label class="btn btn-sm btn-outline-primary mr-1" [class.active]="isChecked" (click)="toggleChecked()">
      <span class="fa" [class.fa-check-circle]="isChecked" [class.fa-circle-thin]="!isChecked"></span>
      <span> {{label}}</span>
    </label>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OptionSelectorComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionSelectorComponent implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() label: string;
  isChecked = false;
  propagateChange = (_: any) => {
  };

  toggleChecked() {
    this.isChecked = !this.isChecked;
    this.propagateChange(this.isChecked);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    if (obj !== undefined) {
      this.isChecked = obj;
    }
  }
}
