import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { Certificate, CertStatus } from '../certificates.component';
import { CertificatesService } from '../certificates.service';

@Component({
  selector: 'app-certificate-details',
  standalone: true,
  imports: [DecimalPipe, TuiButton, TuiIcon],
  templateUrl: './certificate-details.component.html',
  styleUrls: ['./certificate-details.component.css'],
})
export class CertificateDetailsComponent {
  protected readonly certificate = signal<Certificate | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private certificatesService: CertificatesService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const cert = this.certificatesService.getCertificateById(id);
      if (cert) {
        this.certificate.set(cert);
      } else {
        this.router.navigate(['/dashboard/certificates']);
      }
    } else {
      this.router.navigate(['/dashboard/certificates']);
    }
  }

  protected statusLabel(status: CertStatus): string {
    const labels: Record<CertStatus, string> = {
      active: 'Active',
      expired: 'Expired',
      pending: 'Pending',
      suspended: 'Suspended',
    };
    return labels[status];
  }

  protected goBack(): void {
    this.router.navigate(['/dashboard/certificates']);
  }
}
