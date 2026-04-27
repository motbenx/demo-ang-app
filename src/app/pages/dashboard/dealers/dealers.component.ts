import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiDataList, TuiDialogService, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapper, TuiSelectModule } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { DealerFormComponent, DealerFormData, DealerFormResult } from './dealer-form/dealer-form.component';
import { Dealer, DealerStatus, DealersService } from './dealers.service';

@Component({
  selector: 'app-dealers',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink,
    TuiButton,
    TuiDataList,
    TuiDataListWrapper,
    TuiIcon,
    TuiSelectModule,
    TuiTextfield,
  ],
  templateUrl: './dealers.component.html',
  styleUrls: ['./dealers.component.css'],
})
export class DealersComponent {
  private readonly dialogs = inject(TuiDialogService);
  private readonly dealersService = inject(DealersService);

  protected readonly searchQuery = signal('');
  protected readonly statusFilter = signal<string>('all');
  protected readonly statusOptions = ['all', 'active', 'inactive', 'pending'];

  private readonly allDealers = signal<Dealer[]>([]);

  protected readonly filteredDealers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();
    let dealers = this.allDealers();

    if (query) {
      dealers = dealers.filter((d) => d.name.toLowerCase().includes(query));
    }

    if (status !== 'all') {
      dealers = dealers.filter((d) => d.status === status);
    }

    return dealers;
  });

  protected readonly stats = computed(() => {
    const dealers = this.allDealers();
    const active = dealers.filter((d) => d.status === 'active').length;
    const totalRevenue = dealers.reduce((sum, d) => sum + d.totalRevenue, 0);
    const totalContracts = dealers.reduce((sum, d) => sum + d.activeContracts, 0);

    return [
      { label: 'Total Dealers', value: dealers.length.toString(), icon: '@tui.store', color: '#6366f1' },
      { label: 'Active', value: active.toString(), icon: '@tui.check-circle', color: '#22c55e' },
      { label: 'Total Contracts', value: totalContracts.toString(), icon: '@tui.file-badge', color: '#f59e0b' },
      { label: 'Total Revenue', value: `€${(totalRevenue / 1000).toFixed(1)}k`, icon: '@tui.trending-up', color: '#8b5cf6' },
    ];
  });

  constructor() {
    this.allDealers.set(this.dealersService.getAll());
  }

  protected onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }

  protected onStatusChange(value: string): void {
    this.statusFilter.set(value);
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('all');
  }

  protected statusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  protected onEdit(dealer: Dealer): void {
    const data: DealerFormData = { dealer, mode: 'edit' };
    this.dialogs
      .open<DealerFormResult>(new PolymorpheusComponent(DealerFormComponent), { data })
      .subscribe((result) => {
        if (result?.success) {
          this.allDealers.set(this.dealersService.getAll());
        }
      });
  }

  protected onDelete(dealer: Dealer): void {
    if (confirm(`Are you sure you want to delete dealer "${dealer.name}"?`)) {
      this.dealersService.remove(dealer.id);
      this.allDealers.set(this.dealersService.getAll());
    }
  }

  protected onAddDealer(): void {
    const data: DealerFormData = { mode: 'add' };
    this.dialogs
      .open<DealerFormResult>(new PolymorpheusComponent(DealerFormComponent), { data })
      .subscribe((result) => {
        if (result?.success) {
          this.allDealers.set(this.dealersService.getAll());
        }
      });
  }
}
