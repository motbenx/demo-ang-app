import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiStepper, TuiStep } from '@taiga-ui/kit';
import { Certificate } from '../certificates.component';
import { DealersService } from '../../dealers/dealers.service';
import { Dealer } from '../../dealers/dealers.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type Step = 1 | 2 | 3 | 4;

interface Branch {
  id: string;
  name: string;
  dealerId: string;
}

@Component({
  selector: 'app-new-certificate-modal',
  standalone: true,
  imports: [DecimalPipe, FormsModule, TuiButton, TuiIcon, TuiStepper, TuiStep],
  templateUrl: './new-certificate-modal.component.html',
  styleUrls: ['./new-certificate-modal.component.css'],
})
export class NewCertificateModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<Certificate>();

  protected readonly currentStep = signal<Step>(1);
  protected readonly hasChanges = signal(false);
  protected readonly showConfirmCancel = signal(false);
  protected readonly generatedCertificate = signal<Certificate | null>(null);

  // Step 1 — Customer & Sale
  protected readonly customerName = signal('');
  protected readonly phone = signal('');
  protected readonly email = signal('');
  protected readonly address = signal('');
  protected readonly selectedDealer = signal('');
  protected readonly selectedBranch = signal('');
  protected readonly salesman = signal('');
  protected readonly createdDate = signal(this.formatDateForInput(new Date()));

  // Step 2 — Insured Device
  protected readonly category = signal('');
  protected readonly manufacturer = signal('');
  protected readonly model = signal('');
  protected readonly imeiSerial = signal('');
  protected readonly devicePrice = signal<number | null>(null);
  protected readonly manufacturerWarranty = signal('');

  // Step 3 — Coverage & Pricing
  protected readonly insuranceServiceType = signal('');
  protected readonly insuranceTerm = signal('');
  protected readonly validFrom = signal(this.formatDateForInput(new Date()));
  protected readonly pricingName = signal('');
  protected readonly certPrice = signal<number | null>(null);
  protected readonly paymentType = signal('');
  protected readonly monthlyPayment = signal<number | null>(null);
  protected readonly insurancePlan = signal('');

  // Options
  protected readonly dealers = signal<Dealer[]>([]);
  protected readonly branches = signal<Branch[]>([
    { id: 'BR-001', name: 'Vilnius Main', dealerId: 'DLR-001' },
    { id: 'BR-002', name: 'Vilnius North', dealerId: 'DLR-001' },
    { id: 'BR-003', name: 'Kaunas Central', dealerId: 'DLR-002' },
    { id: 'BR-004', name: 'Riga Nord', dealerId: 'DLR-003' },
    { id: 'BR-005', name: 'Riga South', dealerId: 'DLR-003' },
    { id: 'BR-006', name: 'Tallinn Park', dealerId: 'DLR-004' },
    { id: 'BR-007', name: 'Berlin Central', dealerId: 'DLR-006' },
    { id: 'BR-008', name: 'Berlin West', dealerId: 'DLR-006' },
    { id: 'BR-009', name: 'Berlin East', dealerId: 'DLR-006' },
    { id: 'BR-010', name: 'Prague Main', dealerId: 'DLR-007' },
  ]);

  protected readonly filteredBranches = computed(() => {
    const dealerId = this.selectedDealer();
    if (!dealerId) {
      return [];
    }
    return this.branches().filter(b => b.dealerId === dealerId);
  });

  protected readonly categoryOptions = ['Smartphones', 'Laptops', 'Tablets', 'E-Scooters', 'Audio', 'Other'];
  protected readonly warrantyOptions = ['12 months', '24 months', '36 months'];
  protected readonly serviceTypeOptions = [
    { value: 'EW', label: 'EW (Extended Warranty)' },
    { value: 'ADH', label: 'ADH (Accidental Damage & Handling)' },
  ];
  protected readonly termOptions = ['12 months', '24 months', '36 months'];
  protected readonly pricingOptions = ['Basic', 'Standard', 'Standard Plus', 'Premium', 'Premium Pro'];
  protected readonly paymentTypeOptions = ['Full', 'Partial (3 months)'];

  protected readonly salesmen = ['Tom K.', 'Sarah L.', 'Mike R.', 'Anna V.', 'Peter D.', 'Jane S.', 'Mark B.'];

  protected readonly validTo = computed(() => {
    const from = this.validFrom();
    const term = this.insuranceTerm();
    if (!from || !term) {
      return '';
    }
    const fromDate = new Date(from);
    const months = parseInt(term.split(' ')[0]);
    const toDate = new Date(fromDate);
    toDate.setMonth(toDate.getMonth() + months);
    return this.formatDateForDisplay(toDate);
  });

  protected readonly step1Valid = computed(() => {
    return !!(
      this.customerName() &&
      this.phone() &&
      this.email() &&
      this.address() &&
      this.selectedDealer() &&
      this.selectedBranch() &&
      this.salesman() &&
      this.createdDate()
    );
  });

  protected readonly step2Valid = computed(() => {
    return !!(
      this.category() &&
      this.manufacturer() &&
      this.model() &&
      this.imeiSerial() &&
      this.imeiSerial().length >= 10 &&
      this.devicePrice() !== null &&
      this.devicePrice()! > 0 &&
      this.manufacturerWarranty()
    );
  });

  protected readonly step3Valid = computed(() => {
    const baseValid = !!(
      this.insuranceServiceType() &&
      this.insuranceTerm() &&
      this.validFrom() &&
      this.pricingName() &&
      this.certPrice() !== null &&
      this.certPrice()! > 0 &&
      this.paymentType()
    );

    if (this.paymentType() === 'Partial (3 months)') {
      return baseValid && this.monthlyPayment() !== null && this.monthlyPayment()! > 0;
    }

    return baseValid;
  });

  constructor(private dealersService: DealersService) {
    this.dealers.set(this.dealersService.getDealers().filter(d => d.status === 'active'));
  }

  protected markChanged(): void {
    this.hasChanges.set(true);
  }

  protected onNext(): void {
    if (this.currentStep() === 1 && this.step1Valid()) {
      this.currentStep.set(2);
    } else if (this.currentStep() === 2 && this.step2Valid()) {
      this.currentStep.set(3);
    }
  }

  protected onBack(): void {
    if (this.currentStep() === 2) {
      this.currentStep.set(1);
    } else if (this.currentStep() === 3) {
      this.currentStep.set(2);
    } else if (this.currentStep() === 4) {
      this.currentStep.set(3);
    }
  }

  protected onCancel(): void {
    if (this.hasChanges()) {
      this.showConfirmCancel.set(true);
    } else {
      this.close.emit();
    }
  }

  protected confirmCancel(): void {
    this.showConfirmCancel.set(false);
    this.close.emit();
  }

  protected cancelCancelation(): void {
    this.showConfirmCancel.set(false);
  }

  protected onSubmit(): void {
    if (!this.step3Valid()) {
      return;
    }

    const dealer = this.dealers().find(d => d.id === this.selectedDealer());
    const branch = this.branches().find(b => b.id === this.selectedBranch());

    const certificate: Certificate = {
      certNo: this.generateTempCertNo(),
      created: this.createdDate(),
      customer: this.customerName(),
      phone: this.phone(),
      dealer: dealer?.name || '',
      branch: branch?.name || '',
      salesman: this.salesman(),
      category: this.category(),
      pricingName: this.pricingName(),
      pricing: this.certPrice()!,
      status: 'pending',
      insuranceServiceType: this.insuranceServiceType(),
      insuranceTerm: this.insuranceTerm(),
      validFrom: this.validFrom(),
      validTo: this.validTo(),
      paymentType: this.paymentType(),
      monthlyPayment: this.paymentType() === 'Full' ? 0 : (this.monthlyPayment() || 0),
      certPrice: this.certPrice()!,
      insurancePlan: this.insurancePlan(),
      barcode: this.generateTempBarcode(),
      productCode: this.generateTempProductCode(),
      registryCode: this.generateTempRegistryCode(),
      manufacturer: this.manufacturer(),
      model: this.model(),
      imeiSerial: this.imeiSerial(),
      manufacturerWarranty: this.manufacturerWarranty(),
      devicePrice: this.devicePrice()!,
      email: this.email(),
      address: this.address(),
    };

    this.generatedCertificate.set(certificate);
    this.currentStep.set(4);
  }

  protected async downloadPDF(): Promise<void> {
    const cert = this.generatedCertificate();
    if (!cert) {
      return;
    }

    const element = document.getElementById('cert-preview');
    if (!element) {
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Certificate-${cert.certNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }

  protected onClosePreview(): void {
    const cert = this.generatedCertificate();
    if (cert) {
      this.submit.emit(cert);
    }
    this.close.emit();
  }

  protected onDealerChange(): void {
    this.selectedBranch.set('');
    this.markChanged();
  }

  protected onPaymentTypeChange(): void {
    if (this.paymentType() === 'Full') {
      this.monthlyPayment.set(0);
    }
    this.markChanged();
  }

  protected getDealerInitials(dealerName: string): string {
    return dealerName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatDateForDisplay(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private generateTempCertNo(): string {
    const timestamp = Date.now().toString().slice(-5);
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `LTU040${timestamp}${random}`.slice(0, 11);
  }

  private generateTempBarcode(): string {
    const random = Math.floor(Math.random() * 100000000000).toString().padStart(11, '0');
    return `110001${random}`.slice(0, 11);
  }

  private generateTempProductCode(): string {
    const random = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    return `10010${random}`.slice(0, 10);
  }

  private generateTempRegistryCode(): string {
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `100${random}`.slice(0, 6);
  }
}
