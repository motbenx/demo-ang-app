import { Component, EventEmitter, Output, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiStepper, TuiStep } from '@taiga-ui/kit';
import { Certificate, CertStatus } from '../certificates.component';
import { CertificatesService } from '../certificates.service';

interface Step1Data {
  customer: string;
  phone: string;
  email: string;
  address: string;
  dealer: string;
  branch: string;
  salesman: string;
}

interface Step2Data {
  manufacturer: string;
  model: string;
  imeiSerial: string;
  manufacturerWarranty: string;
  devicePrice: number;
  category: string;
}

interface Step3Data {
  insuranceServiceType: string;
  insuranceTerm: string;
  validFrom: string;
  validTo: string;
  paymentType: string;
  monthlyPayment: number;
  certPrice: number;
  insurancePlan: string;
  pricingName: string;
  pricing: number;
  status: CertStatus;
}

@Component({
  selector: 'app-new-certificate-modal',
  standalone: true,
  imports: [DecimalPipe, FormsModule, TuiButton, TuiIcon, TuiTextfield, TuiStepper, TuiStep],
  templateUrl: './new-certificate-modal.component.html',
  styleUrls: ['./new-certificate-modal.component.css'],
})
export class NewCertificateModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<Certificate>();

  protected readonly activeStep = signal(0);
  protected readonly isDirty = signal(false);
  protected readonly createdCertificate = signal<Certificate | null>(null);

  protected readonly step1Data = signal<Step1Data>({
    customer: '',
    phone: '',
    email: '',
    address: '',
    dealer: '',
    branch: '',
    salesman: '',
  });

  protected readonly step2Data = signal<Step2Data>({
    manufacturer: '',
    model: '',
    imeiSerial: '',
    manufacturerWarranty: '12 months',
    devicePrice: 0,
    category: '',
  });

  protected readonly step3Data = signal<Step3Data>({
    insuranceServiceType: 'EW',
    insuranceTerm: '24 months',
    validFrom: '',
    validTo: '',
    paymentType: 'Full',
    monthlyPayment: 0,
    certPrice: 0,
    insurancePlan: '',
    pricingName: '',
    pricing: 0,
    status: 'active',
  });

  protected readonly step1Valid = computed(() => {
    const data = this.step1Data();
    return !!(
      data.customer &&
      data.phone &&
      data.email &&
      data.address &&
      data.dealer &&
      data.branch &&
      data.salesman
    );
  });

  protected readonly step2Valid = computed(() => {
    const data = this.step2Data();
    return !!(
      data.manufacturer &&
      data.model &&
      data.imeiSerial &&
      data.manufacturerWarranty &&
      data.devicePrice > 0 &&
      data.category
    );
  });

  protected readonly step3Valid = computed(() => {
    const data = this.step3Data();
    return !!(
      data.insuranceServiceType &&
      data.insuranceTerm &&
      data.validFrom &&
      data.validTo &&
      data.paymentType &&
      data.certPrice > 0 &&
      data.pricingName &&
      data.pricing > 0
    );
  });

  protected readonly canProceed = computed(() => {
    const step = this.activeStep();
    if (step === 0) return this.step1Valid();
    if (step === 1) return this.step2Valid();
    if (step === 2) return this.step3Valid();
    if (step === 3) return true;
    return false;
  });

  protected readonly insuranceServiceTypes = ['EW', 'ADH', 'EW+ADH'];
  protected readonly insuranceTerms = ['12 months', '24 months', '36 months'];
  protected readonly paymentTypes = ['Full', 'Partial (3 months)', 'Partial (6 months)'];
  protected readonly statusOptions: CertStatus[] = ['active', 'pending', 'suspended', 'expired'];
  protected readonly categories = ['Smartphones', 'Laptops', 'Tablets', 'E-Scooters', 'Audio', 'Wearables'];
  protected readonly warrantyOptions = ['6 months', '12 months', '24 months', '36 months'];

  constructor(private certificatesService: CertificatesService) {}

  protected updateStep1<K extends keyof Step1Data>(field: K, value: Step1Data[K]): void {
    this.step1Data.update(data => ({ ...data, [field]: value }));
    this.isDirty.set(true);
  }

  protected updateStep2<K extends keyof Step2Data>(field: K, value: Step2Data[K]): void {
    this.step2Data.update(data => ({ ...data, [field]: value }));
    this.isDirty.set(true);
  }

  protected updateStep3<K extends keyof Step3Data>(field: K, value: Step3Data[K]): void {
    this.step3Data.update(data => ({ ...data, [field]: value }));
    this.isDirty.set(true);
    
    if (field === 'paymentType' || field === 'certPrice') {
      this.calculateMonthlyPayment();
    }
  }

  protected nextStep(): void {
    if (this.canProceed() && this.activeStep() < 3) {
      if (this.activeStep() === 2) {
        this.createCertificate();
      }
      this.activeStep.update(s => s + 1);
    }
  }

  protected prevStep(): void {
    if (this.activeStep() > 0) {
      this.activeStep.update(s => s - 1);
    }
  }

  protected onCancel(): void {
    if (this.isDirty()) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        this.close.emit();
      }
    } else {
      this.close.emit();
    }
  }

  protected onFinish(): void {
    const cert = this.createdCertificate();
    if (cert) {
      this.submit.emit(cert);
      this.close.emit();
    }
  }

  protected async downloadPDF(): Promise<void> {
    const element = document.getElementById('cert-preview');
    const cert = this.createdCertificate();
    
    if (!element || !cert) {
      return;
    }

    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Certificate-${cert.certNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
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

  protected getDealerInitials(dealer: string): string {
    return dealer
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  private createCertificate(): void {
    const step1 = this.step1Data();
    const step2 = this.step2Data();
    const step3 = this.step3Data();

    const certificateData: Omit<Certificate, 'certNo' | 'barcode' | 'productCode' | 'registryCode' | 'created'> = {
      customer: step1.customer,
      phone: step1.phone,
      email: step1.email,
      address: step1.address,
      dealer: step1.dealer,
      branch: step1.branch,
      salesman: step1.salesman,
      manufacturer: step2.manufacturer,
      model: step2.model,
      imeiSerial: step2.imeiSerial,
      manufacturerWarranty: step2.manufacturerWarranty,
      devicePrice: step2.devicePrice,
      category: step2.category,
      insuranceServiceType: step3.insuranceServiceType,
      insuranceTerm: step3.insuranceTerm,
      validFrom: step3.validFrom,
      validTo: step3.validTo,
      paymentType: step3.paymentType,
      monthlyPayment: step3.monthlyPayment,
      certPrice: step3.certPrice,
      insurancePlan: step3.insurancePlan,
      pricingName: step3.pricingName,
      pricing: step3.pricing,
      status: step3.status,
    };

    const newCertificate = this.certificatesService.addCertificate(certificateData);
    this.createdCertificate.set(newCertificate);
  }

  private calculateMonthlyPayment(): void {
    const data = this.step3Data();
    if (data.paymentType === 'Full') {
      this.step3Data.update(d => ({ ...d, monthlyPayment: 0 }));
    } else if (data.paymentType.includes('3 months')) {
      this.step3Data.update(d => ({ ...d, monthlyPayment: d.certPrice / 3 }));
    } else if (data.paymentType.includes('6 months')) {
      this.step3Data.update(d => ({ ...d, monthlyPayment: d.certPrice / 6 }));
    }
  }
}
