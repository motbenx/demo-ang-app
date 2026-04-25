import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { Certificate, CertStatus } from '../certificates.component';

@Component({
  selector: 'app-certificate-details',
  standalone: true,
  imports: [DecimalPipe, TuiButton, TuiIcon],
  templateUrl: './certificate-details.component.html',
  styleUrls: ['./certificate-details.component.css'],
})
export class CertificateDetailsComponent {
  certificate = input.required<Certificate>();

  protected statusLabel(status: CertStatus): string {
    const labels: Record<CertStatus, string> = {
      active: 'Active',
      expired: 'Expired',
      pending: 'Pending',
      suspended: 'Suspended',
    };
    return labels[status];
  }
}
