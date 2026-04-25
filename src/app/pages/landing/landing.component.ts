import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterLink,
    TuiButton,
    TuiTextfield,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {}