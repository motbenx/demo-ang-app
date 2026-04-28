import { DecimalPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiTabs } from '@taiga-ui/kit';
import { NewCertificateModalComponent } from './new-certificate-modal/new-certificate-modal.component';
import { CertificatesService } from './certificates.service';

export type CertStatus = 'active' | 'expired' | 'pending' | 'suspended';

export interface Certificate {
  certNo: string;
  created: string;
  customer: string;
  phone: string;
  dealer: string;
  branch: string;
  salesman: string;
  category: string;
  pricingName: string;
  pricing: number;
  status: CertStatus;
  // General details
  insuranceServiceType: string;
  insuranceTerm: string;
  validFrom: string;
  validTo: string;
  paymentType: string;
  monthlyPayment: number;
  certPrice: number;
  insurancePlan: string;
  barcode: string;
  productCode: string;
  registryCode: string;
  // Insured device
  manufacturer: string;
  model: string;
  imeiSerial: string;
  manufacturerWarranty: string;
  devicePrice: number;
  // Customer detail
  email: string;
  address: string;
}

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [DecimalPipe, RouterLink, TuiButton, TuiIcon, TuiTextfield, TuiTabs, NewCertificateModalComponent],
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css'],
})
export class CertificatesComponent {
  protected readonly activeTab = signal(0);
  protected readonly tabs = ['Certificates', 'Offers', 'Cancellations', 'Certificate report', 'Suspended Certificates'];
  protected readonly expandedCert = signal<string | null>(null);
  protected readonly showNewCertModal = signal(false);

  protected readonly certificates = signal<Certificate[]>([]);

  constructor(private certificatesService: CertificatesService) {
    this.certificates.set(this.certificatesService.getCertificates());
  }

  protected toggleExpand(certNo: string): void {
    this.expandedCert.update(v => (v === certNo ? null : certNo));
  }

  protected statusLabel(status: CertStatus): string {
    const labels: Record<CertStatus, string> = {
      active: 'Active', expired: 'Expired', pending: 'Pending', suspended: 'Suspended',
    };
    return labels[status];
  }

  protected openNewCertificateModal(): void {
    this.showNewCertModal.set(true);
  }

  protected closeNewCertificateModal(): void {
    this.showNewCertModal.set(false);
  }

  protected handleNewCertificate(certificate: Certificate): void {
    this.certificates.set(this.certificatesService.getCertificates());
    this.showNewCertModal.set(false);
  }
}
