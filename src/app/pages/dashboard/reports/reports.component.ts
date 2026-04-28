import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiInputDateRange } from '@taiga-ui/kit';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { Report, ReportsService } from './reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButton,
    TuiIcon,
    TuiTextfield,
    TuiInputDateRange,
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
  protected readonly reports = signal<Report[]>([]);
  protected readonly isLoading = signal(false);

  protected readonly dateRangeForm = new FormGroup({
    dateRange: new FormControl<TuiDayRange | null>(null),
  });

  constructor(private reportsService: ReportsService) {
    this.reports.set(this.reportsService.getReports());

    effect(() => {
      const dateRangeValue = this.dateRangeForm.value.dateRange;
      this.onDateRangeChange(dateRangeValue);
    });
  }

  protected onDateRangeChange(range: TuiDayRange | null): void {
    if (!range || !range.from || !range.to) {
      this.reports.set(this.reportsService.getReports());
      return;
    }

    this.isLoading.set(true);

    const startDate = range.from.toLocalNativeDate();
    const endDate = range.to.toLocalNativeDate();

    const filteredReports = this.reportsService.getReportsByDateRange(startDate, endDate);
    this.reports.set(filteredReports);

    this.isLoading.set(false);
  }

  protected clearDateRange(): void {
    this.dateRangeForm.patchValue({ dateRange: null });
    this.reports.set(this.reportsService.getReports());
  }

  protected generateReport(): void {
    console.log('Generate new report');
  }

  protected exportReport(reportId: string): void {
    console.log('Export report:', reportId);
  }

  protected viewReport(reportId: string): void {
    console.log('View report:', reportId);
  }

  protected reportTypeLabel(type: Report['type']): string {
    const labels: Record<Report['type'], string> = {
      revenue: 'Revenue',
      certificates: 'Certificates',
      dealers: 'Dealers',
      payments: 'Payments',
    };
    return labels[type];
  }
}
