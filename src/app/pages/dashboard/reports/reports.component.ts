import { Component, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { ReportsService } from './reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, DecimalPipe, TuiButton, TuiIcon],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
  protected readonly monthlyBreakdown = computed(() => 
    this.reportsService.getMonthlyBreakdown()
  );

  constructor(private reportsService: ReportsService) {}

  protected onExportCSV(): void {
    const data = this.monthlyBreakdown();
    
    const headers = ['Month', 'Certificates', 'Revenue', 'Paid Invoices'];
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = [
        row.month,
        row.certificates.toString(),
        row.revenue.toFixed(2),
        row.paidInvoices.toString(),
      ];
      csvRows.push(values.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `monthly-breakdown-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
  }
}
