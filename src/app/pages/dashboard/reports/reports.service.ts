import { Injectable, signal } from '@angular/core';

export interface Report {
  id: string;
  title: string;
  type: string;
  generatedDate: string;
  generatedBy: string;
  fileSize: string;
  status: 'Ready' | 'Processing' | 'Failed';
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly reports = signal<Report[]>([
    {
      id: 'RPT-001',
      title: 'Monthly Sales Report - January 2025',
      type: 'Sales',
      generatedDate: '2025-01-31',
      generatedBy: 'Alex Morgan',
      fileSize: '2.4 MB',
      status: 'Ready',
    },
    {
      id: 'RPT-002',
      title: 'Certificate Issuance Summary Q1 2025',
      type: 'Certificates',
      generatedDate: '2025-03-31',
      generatedBy: 'Sarah Johnson',
      fileSize: '1.8 MB',
      status: 'Ready',
    },
    {
      id: 'RPT-003',
      title: 'Dealer Performance Analysis - February',
      type: 'Dealers',
      generatedDate: '2025-02-28',
      generatedBy: 'Mike Peterson',
      fileSize: '3.2 MB',
      status: 'Ready',
    },
    {
      id: 'RPT-004',
      title: 'Payment Reconciliation Report',
      type: 'Payments',
      generatedDate: '2025-04-15',
      generatedBy: 'Alex Morgan',
      fileSize: '5.1 MB',
      status: 'Processing',
    },
    {
      id: 'RPT-005',
      title: 'Insurance Claims Analysis - Q1',
      type: 'Claims',
      generatedDate: '2025-03-15',
      generatedBy: 'Emma Wilson',
      fileSize: '4.3 MB',
      status: 'Ready',
    },
    {
      id: 'RPT-006',
      title: 'Revenue Breakdown by Region',
      type: 'Revenue',
      generatedDate: '2025-04-01',
      generatedBy: 'John Davis',
      fileSize: '2.7 MB',
      status: 'Ready',
    },
    {
      id: 'RPT-007',
      title: 'Customer Satisfaction Survey Results',
      type: 'Analytics',
      generatedDate: '2025-03-20',
      generatedBy: 'Sarah Johnson',
      fileSize: '1.5 MB',
      status: 'Failed',
    },
    {
      id: 'RPT-008',
      title: 'Inventory Status Report - March',
      type: 'Inventory',
      generatedDate: '2025-03-31',
      generatedBy: 'Mike Peterson',
      fileSize: '3.8 MB',
      status: 'Ready',
    },
    {
      id: 'RPT-009',
      title: 'Dealer Commission Statement - Q1',
      type: 'Commissions',
      generatedDate: '2025-04-05',
      generatedBy: 'Alex Morgan',
      fileSize: '6.2 MB',
      status: 'Ready',
    },
    {
      id: 'RPT-010',
      title: 'Active Certificates Overview',
      type: 'Certificates',
      generatedDate: '2025-04-20',
      generatedBy: 'Emma Wilson',
      fileSize: '2.1 MB',
      status: 'Ready',
    },
    {
      id: 'RPT-011',
      title: 'Suspended Certificates Audit',
      type: 'Certificates',
      generatedDate: '2025-04-18',
      generatedBy: 'John Davis',
      fileSize: '1.9 MB',
      status: 'Ready',
    },
    {
      id: 'RPT-012',
      title: 'Monthly Financial Summary - March',
      type: 'Finance',
      generatedDate: '2025-03-31',
      generatedBy: 'Sarah Johnson',
      fileSize: '4.5 MB',
      status: 'Ready',
    },
    {
      id: 'RPT-013',
      title: 'Product Performance Analysis',
      type: 'Analytics',
      generatedDate: '2025-04-10',
      generatedBy: 'Mike Peterson',
      fileSize: '3.6 MB',
      status: 'Processing',
    },
    {
      id: 'RPT-014',
      title: 'Branch Comparison Report - Q1',
      type: 'Dealers',
      generatedDate: '2025-04-01',
      generatedBy: 'Alex Morgan',
      fileSize: '2.8 MB',
      status: 'Ready',
    },
    {
      id: 'RPT-015',
      title: 'Year-to-Date Revenue Summary',
      type: 'Revenue',
      generatedDate: '2025-04-15',
      generatedBy: 'Emma Wilson',
      fileSize: '5.3 MB',
      status: 'Ready',
    },
  ]);

  getReports(): Report[] {
    return this.reports();
  }

  getReportById(id: string): Report | undefined {
    return this.reports().find(r => r.id === id);
  }

  addReport(report: Report): void {
    this.reports.update(list => [...list, report]);
  }

  updateReport(id: string, updates: Partial<Report>): void {
    this.reports.update(list =>
      list.map(r => (r.id === id ? { ...r, ...updates } : r))
    );
  }

  deleteReport(id: string): void {
    this.reports.update(list => list.filter(r => r.id !== id));
  }
}
