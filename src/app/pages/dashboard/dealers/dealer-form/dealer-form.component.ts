import { Component, EventEmitter, Input, Output, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import { Dealer, DealerStatus } from '../dealers.component';

@Component({
  selector: 'app-dealer-form',
  standalone: true,
  imports: [FormsModule, TuiButton, TuiTextfield],
  templateUrl: './dealer-form.component.html',
  styleUrls: ['./dealer-form.component.css'],
})
export class DealerFormComponent {
  @Input() dealer: Dealer | null = null;
  @Output() save = new EventEmitter<Dealer>();
  @Output() cancel = new EventEmitter<void>();

  protected readonly formData = signal<Partial<Dealer>>({
    id: '',
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    branches: 0,
    certificates: 0,
  });

  constructor() {
    effect(() => {
      if (this.dealer) {
        this.formData.set({ ...this.dealer });
      } else {
        this.formData.set({
          id: this.generateDealerId(),
          name: '',
          contact: '',
          email: '',
          phone: '',
          address: '',
          status: 'active',
          branches: 0,
          certificates: 0,
        });
      }
    });
  }

  protected get isEditing(): boolean {
    return this.dealer !== null;
  }

  protected get statusOptions(): DealerStatus[] {
    return ['active', 'inactive', 'suspended'];
  }

  protected updateField<K extends keyof Dealer>(field: K, value: Dealer[K]): void {
    this.formData.update(data => ({ ...data, [field]: value }));
  }

  protected onSubmit(): void {
    const data = this.formData();
    if (this.isValid(data)) {
      this.save.emit(data as Dealer);
    }
  }

  protected onCancel(): void {
    this.cancel.emit();
  }

  private isValid(data: Partial<Dealer>): data is Dealer {
    return !!(
      data.id &&
      data.name &&
      data.contact &&
      data.email &&
      data.phone &&
      data.address &&
      data.status
    );
  }

  private generateDealerId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `DLR-${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
  }
}
