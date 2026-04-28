import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiInputDateRange, TuiSkeleton } from '@taiga-ui/kit';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { ReportsService, Report } from './reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    FormsModule,
    TuiButton,
    TuiIcon,
    TuiTextfield,
    TuiInputDateRange,
    TuiSkeleton,
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
  protected readonly isLoading = signal(true);
  protected readonly reports = signal<Report[]>([]);
  protected readonly searchQuery = signal('');
  protected readonly dateRange = signal<TuiDayRange | null>(null);

  protected readonly filteredReports = computed(() => {
    const search = this.searchQuery().toLowerCase();
    const range = this.dateRange();

    return this.reports().filter(report => {
      const matchesSearch = !search ||
        report.title.toLowerCase().includes(search) ||
        report.type.toLowerCase().includes(search) ||
        report.generatedBy.toLowerCase().includes(search);

      if (!matchesSearch) return false;

      if (range) {
        const [year, month, day] = report.generatedDate.split('-').map(Number);
        const reportDay = new TuiDay(year, month - 1, day);

        if (reportDay.dayBefore(range.from)) return false;
        if (reportDay.dayAfter(range.to)) return false;
      }

      return true;
    });
  });

  protected readonly totalReports = computed(() => this.filteredReports().length);
  protected readonly currentPage = signal(1);
  protected readonly pageSize = 10;

  protected readonly paginatedReports = computed(() => {
    const filtered = this.filteredReports();
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return filtered.slice(start, end);
  });

  protected readonly totalPages = computed(() =>
    Math.ceil(this.filteredReports().length / this.pageSize)
  );

  constructor(private reportsService: ReportsService) {
    this.loadReports();
  }

  private loadReports(): void {
    setTimeout(() => {
      this.reports.set(this.reportsService.getReports());
      this.isLoading.set(false);
    }, 1000);
  }

  protected onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  protected onDateRangeChange(range: TuiDayRange | null): void {
    this.dateRange.set(range);
    this.currentPage.set(1);
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.dateRange.set(null);
    this.currentPage.set(1);
  }

  protected goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  protected downloadReport(report: Report): void {
    console.log('Download report:', report.id);
  }

  protected viewReport(report: Report): void {
    console.log('View report:', report.id);
  }

  protected deleteReport(report: Report): void {
    console.log('Delete report:', report.id);
  }

  protected generateNewReport(): void {
    console.log('Generate new report');
  }

  protected get dateRangeValue(): TuiDayRange | null {
    return this.dateRange();
  }

  protected set dateRangeValue(value: TuiDayRange | null) {
    this.onDateRangeChange(value);
  }
}
