import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { NgForOf } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { NgForOf,NgIf } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    NgForOf,
    FormsModule
    NgIf,
    ReactiveFormsModule
  ],
  animations: [
    trigger('heroAnimation', [
      transition(':enter', [
        query('.brand, h1, .hero-buttons', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger(200, [
            animate('800ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ])
      ])
    ]),

    trigger('fadeInUp', [
      state('hidden', style({ opacity: 0, transform: 'translateY(60px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden => visible', animate('700ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ]),

    trigger('fadeOnly', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', animate('600ms ease'))
    ]),

    trigger('scaleIn', [
      state('hidden', style({ opacity: 0, transform: 'scale(0.8)' })),
      state('visible', style({ opacity: 1, transform: 'scale(1)' })),
      transition('hidden => visible', animate('600ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ]),

    trigger('slideInLeft', [
      state('hidden', style({ opacity: 0, transform: 'translateX(-100px)' })),
      state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('hidden => visible', animate('800ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ]),

    trigger('slideInRight', [
      state('hidden', style({ opacity: 0, transform: 'translateX(100px)' })),
      state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('hidden => visible', animate('800ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ]),

    trigger('zoomIn', [
      state('hidden', style({ opacity: 0, transform: 'scale(0.5)' })),
      state('visible', style({ opacity: 1, transform: 'scale(1)' })),
      transition('hidden => visible', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ]),

    trigger('slideReveal', [
      state('hidden', style({ opacity: 0, transform: 'translateY(40px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden => visible', animate('700ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  years: number[] = [];
  reservationForm!: FormGroup;
  formStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';


  // 1. ADD THIS METHOD
  async handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Prepare JSON payload
    const payload = {
      prenom: formData.get('prenom'),
      nom: formData.get('nom'),
      telephone: formData.get('telephone'),
      modeleSouhaite: formData.get('modeleSouhaite'),
      budget: formData.get('budget'),
      // Collect multiple checkbox values into arrays
      typeVehicule: formData.getAll('typeVehicule'),
      transmission: formData.getAll('transmission')
    };

    try {
      // REPLACE with your actual Cloudflare Worker URL
      const response = await fetch('https://ccs-form-handler.bathilymouhamedabdallah.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Merci ! Votre demande a été envoyée à contact@coumbacarservices.com');
        form.reset();
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert("Une erreur est survenue. Veuillez nous contacter via Instagram ou LinkedIn.");
    }
  }

  // Swipe hint state
  showSwipeHint = false;
  private swipeHintDismissed = false;
  private scrollListener!: () => void;

  sectionStates: { [key: string]: string } = {
    aboutTitle: 'hidden',
    aboutImage: 'hidden',
    aboutText: 'hidden',
    servicesTitle: 'hidden',
    service1: 'hidden',
    service2: 'hidden',
    service3: 'hidden',
    brandsTitle: 'hidden',
    brand1: 'hidden',
    brand2: 'hidden',
    brand3: 'hidden',
    brand4: 'hidden',
    brand5: 'hidden',
    brand6: 'hidden',
    valuesLine: 'hidden',
    contactForm: 'hidden'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.generateYears();
    this.checkScroll();
    this.initSwipeHint();
    this.initForm();
  }

  ngOnDestroy(): void {
    // Nettoyage de l'écouteur au destroy du composant
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  initForm(): void {
    this.reservationForm = this.fb.group({
      prenom:         ['', [Validators.required, Validators.minLength(2)]],
      nom:            ['', [Validators.required, Validators.minLength(2)]],
      telephone:      ['', [Validators.required, Validators.pattern(/^[+\d\s]{8,15}$/)]],
      typeVehicule:   [[], Validators.required],
      transmission:   [[]],
      modeleSouhaite: [''],
      budget:         ['', Validators.required]
    });
  }

  get f() { return this.reservationForm.controls; }

  isInvalid(field: string): boolean {
    const ctrl = this.reservationForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onCheckboxChange(e: Event, controlName: string): void {
    const checkbox = e.target as HTMLInputElement;
    const current: string[] = this.reservationForm.get(controlName)?.value || [];
    if (checkbox.checked) {
      this.reservationForm.get(controlName)?.setValue([...current, checkbox.value]);
    } else {
      this.reservationForm.get(controlName)?.setValue(current.filter(v => v !== checkbox.value));
    }
    this.reservationForm.get(controlName)?.markAsTouched();
  }

  async onSubmit(): Promise<void> {
    this.reservationForm.markAllAsTouched();
    if (this.reservationForm.invalid) return;

    this.formStatus = 'loading';

    try {
      const formData = new FormData();
      formData.append('form-name', 'reservation-vehicule');
      Object.entries(this.reservationForm.value).forEach(([key, value]) => {
        formData.append(key, Array.isArray(value) ? (value as string[]).join(', ') : String(value));
      });

      const res = await fetch('/', {method: 'POST', body: formData});
      this.formStatus = res.ok ? 'success' : 'error';
    } catch {
      this.formStatus = 'error';
    }
  }

  private initSwipeHint(): void {

    if (window.innerWidth > 768) return;


    setTimeout(() => {
      this.showSwipeHint = true;
    }, 1200);


    this.scrollListener = () => {
      if (this.swipeHintDismissed) return;
      if (window.pageYOffset > 30) {
        this.swipeHintDismissed = true;
        this.showSwipeHint = false;
        window.removeEventListener('scroll', this.scrollListener);
      }
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }


  generateYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear; year >= 2015; year--) {
      this.years.push(year);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScroll();
  }

  checkScroll(): void {
    const scrollPosition = window.pageYOffset + window.innerHeight;

    Object.keys(this.sectionStates).forEach(key => {
      const element = document.querySelector(`[data-animate="${key}"]`);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        if (scrollPosition > elementPosition + 100) {
          this.sectionStates[key] = 'visible';
        }
      }
    });
  }

  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  budgets = [
    '3 000 000 – 5 000 000 FCFA',
    '5 000 000 – 8 000 000 FCFA',
    '8 000 000 – 12 000 000 FCFA',
    '12 000 000 – 15 000 000 FCFA',
    '15 000 000 – 18 000 000 FCFA',
    '+ 18 000 000 FCFA'
  ];
}
