import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiInputDateRange } from '@taiga-ui/kit';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { FormsModule } from '@angular/forms';
import { Report, ReportsService } from './reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TuiButton, TuiIcon, TuiInputDateRange],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
  protected readonly reports = signal<Report[]>([]);
  protected readonly startDate = signal<TuiDay | null>(null);
  protected readonly endDate = signal<TuiDay | null>(null);

  private internalDateRange: TuiDayRange | null = null;

  constructor(private reportsService: ReportsService) {
    this.reports.set(this.reportsService.getReports());
  }

  protected get dateRangeValue(): TuiDayRange | null {
    return this.internalDateRange;
  }

  protected set dateRangeValue(range: TuiDayRange | null) {
    this.internalDateRange = range;
    if (range) {
      this.startDate.set(range.from);
      this.endDate.set(range.to);
    } else {
      this.startDate.set(null);
      this.endDate.set(null);
    }
  }

  protected clearDateRange(): void {
    this.startDate.set(null);
    this.endDate.set(null);
    this.internalDateRange = null;
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
