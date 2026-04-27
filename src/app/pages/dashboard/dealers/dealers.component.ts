import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiSelect } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { DealersService } from './dealers.service';
import { DealerFormComponent } from './dealer-form/dealer-form.component';

export type DealerStatus = 'active' | 'inactive' | 'suspended';

export interface Dealer {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  status: DealerStatus;
  branches: number;
  certificates: number;
}

@Component({
  selector: 'app-dealers',
  standalone: true,
  imports: [RouterLink, FormsModule, TuiButton, TuiIcon, TuiTextfield, TuiSelect, DealerFormComponent],
  templateUrl: './dealers.component.html',
  styleUrls: ['./dealers.component.css'],
})
export class DealersComponent {
  protected readonly dealers = signal<Dealer[]>([]);
  protected readonly filteredDealers = signal<Dealer[]>([]);
  protected readonly searchQuery = signal('');
  protected readonly statusFilter = signal<string>('all');
  protected readonly statusOptions = ['all', 'active', 'inactive', 'suspended'];
  protected readonly showDeleteConfirm = signal<string | null>(null);
  protected readonly showForm = signal(false);
  protected readonly editingDealer = signal<Dealer | null>(null);

  constructor(private dealersService: DealersService) {
    this.dealers.set(this.dealersService.getDealers());
    this.filteredDealers.set(this.dealers());
  }

  protected applyFilters(): void {
    let result = this.dealers();

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      result = result.filter(
        d =>
          d.name.toLowerCase().includes(query) ||
          d.contact.toLowerCase().includes(query) ||
          d.email.toLowerCase().includes(query)
      );
    }

    if (this.statusFilter() !== 'all') {
      result = result.filter(d => d.status === this.statusFilter());
    }

    this.filteredDealers.set(result);
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('all');
    this.filteredDealers.set(this.dealers());
  }

  protected statusLabel(status: DealerStatus): string {
    const labels: Record<DealerStatus, string> = {
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended',
    };
    return labels[status];
  }

  protected openAddForm(): void {
    this.editingDealer.set(null);
    this.showForm.set(true);
  }

  protected openEditForm(dealer: Dealer): void {
    this.editingDealer.set(dealer);
    this.showForm.set(true);
  }

  protected closeForm(): void {
    this.showForm.set(false);
    this.editingDealer.set(null);
  }

  protected saveDealer(dealer: Dealer): void {
    if (this.editingDealer()) {
      this.dealersService.updateDealer(dealer.id, dealer);
    } else {
      this.dealersService.addDealer(dealer);
    }
    this.dealers.set(this.dealersService.getDealers());
    this.applyFilters();
    this.closeForm();
  }

  protected confirmDelete(id: string): void {
    this.showDeleteConfirm.set(id);
  }

  protected cancelDelete(): void {
    this.showDeleteConfirm.set(null);
  }

  protected deleteDealer(id: string): void {
    this.dealersService.deleteDealer(id);
    this.dealers.set(this.dealersService.getDealers());
    this.applyFilters();
    this.showDeleteConfirm.set(null);
  }

  protected viewCertificates(dealerId: string): void {
    // Navigate to certificates page with dealer filter
    // For now, just navigate to certificates page
  }
}
