import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { Dealer, DealersService } from '../dealers.service';

export interface DealerFormData {
  dealer?: Dealer;
  mode: 'add' | 'edit';
}

export interface DealerFormResult {
  success: boolean;
}

@Component({
  selector: 'app-dealer-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiError,
    TuiLabel,
    TuiTextfield,
  ],
  templateUrl: './dealer-form.component.html',
  styleUrls: ['./dealer-form.component.css'],
})
export class DealerFormComponent {
  private readonly context = inject<{ data: DealerFormData; completeWith: (result: DealerFormResult) => void }>(POLYMORPHEUS_CONTEXT);
  private readonly dealersService = inject(DealersService);

  protected readonly mode = this.context.data.mode;
  protected readonly title = this.mode === 'add' ? 'Add New Dealer' : 'Edit Dealer';

  protected readonly submitting = signal(false);

  protected readonly form = new FormGroup({
    name: new FormControl(this.context.data.dealer?.name || '', [
      Validators.required,
      Validators.minLength(2),
    ]),
    region: new FormControl(this.context.data.dealer?.region || '', [
      Validators.required,
    ]),
    email: new FormControl(this.context.data.dealer?.email || '', [
      Validators.required,
      Validators.email,
    ]),
    phone: new FormControl(this.context.data.dealer?.phone || ''),
  });

  protected getNameError(): string {
    const control = this.form.controls.name;
    if (control.hasError('required')) {
      return 'Name is required';
    }
    if (control.hasError('minlength')) {
      return 'Name must be at least 2 characters';
    }
    return '';
  }

  protected getRegionError(): string {
    const control = this.form.controls.region;
    if (control.hasError('required')) {
      return 'Region is required';
    }
    return '';
  }

  protected getEmailError(): string {
    const control = this.form.controls.email;
    if (control.hasError('required')) {
      return 'Email is required';
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  protected onCancel(): void {
    this.context.completeWith({ success: false });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const formValue = this.form.value;

    if (this.mode === 'add') {
      const newDealer: Dealer = {
        id: `DLR-${String(Date.now()).slice(-3).padStart(3, '0')}`,
        name: formValue.name!,
        region: formValue.region!,
        email: formValue.email!,
        phone: formValue.phone || '',
        activeContracts: 0,
        totalRevenue: 0,
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
      };
      this.dealersService.add(newDealer);
    } else {
      const dealer = this.context.data.dealer!;
      this.dealersService.update(dealer.id, {
        name: formValue.name!,
        region: formValue.region!,
        email: formValue.email!,
        phone: formValue.phone || '',
      });
    }

    this.submitting.set(false);
    this.context.completeWith({ success: true });
  }
}
