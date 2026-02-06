import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    NgForOf
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
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(60px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => visible', animate('700ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ]),

    trigger('fadeOnly', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', animate('600ms ease'))
    ]),

    trigger('scaleIn', [
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0.8)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('hidden => visible', animate('600ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ]),

    trigger('slideInLeft', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(-100px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('hidden => visible', animate('800ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ]),

    trigger('slideInRight', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(100px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('hidden => visible', animate('800ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ]),

    trigger('zoomIn', [
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0.5)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('hidden => visible', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ])
  ]
})
export class HomeComponent implements OnInit {
  years: number[] = [];
  formSubmitting = false;
  formSuccess = false;
  formError = false;

  sectionStates: { [key: string]: string } = {
    aboutTitle: 'hidden',
    aboutImage: 'hidden',
    aboutText: 'hidden',
    servicesTitle: 'hidden',
    service1: 'hidden',
    service2: 'hidden',
    service3: 'hidden',
    service4: 'hidden',
    service5: 'hidden',
    service6: 'hidden',
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

  constructor() { }

  ngOnInit(): void {
    this.generateYears();
    this.checkScroll();

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

  onSubmit(event: Event): void {
    event.preventDefault();
    this.formSubmitting = true;
    this.formSuccess = false;
    this.formError = false;

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as any).toString(),
    })
      .then((response) => {
        if (response.ok) {
          this.formSuccess = true;
          form.reset();
        } else {
          this.formError = true;
        }
        this.formSubmitting = false;
      })
      .catch(() => {
        this.formError = true;
        this.formSubmitting = false;
      });
  }
}
