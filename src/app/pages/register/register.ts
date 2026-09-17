import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  firstName = '';
  lastName = '';
  email = '';
  password = '';

  message = '';
  errorMessage = '';

  isLoading = false;

  showSuccessPopup = false;
  showAlreadyRegisteredPopup = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {

    this.message = '';
    this.errorMessage = '';

    this.showSuccessPopup = false;
    this.showAlreadyRegisteredPopup = false;

    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.password
    ) {

      this.errorMessage =
        'Please fill in all fields.';

      return;
    }

    this.isLoading = true;

    console.log(
      'REGISTRATION REQUEST STARTED'
    );

    this.authService
      .register(
        this.email.trim(),
        this.password,
        this.firstName.trim(),
        this.lastName.trim()
      )
      .subscribe({

        next: (response) => {

          console.log(
            'REGISTRATION SUCCESS',
            response
          );

          this.isLoading = false;

          this.message =
            'Registration successful!';

          this.showSuccessPopup = true;

          this.firstName = '';
          this.lastName = '';
          this.email = '';
          this.password = '';
        },

        error: (error) => {

          console.error(
            'REGISTRATION FAILED',
            error
          );

          this.isLoading = false;

          if (error.status === 409) {

            this.errorMessage =
              'This email is already registered.';

            this.showAlreadyRegisteredPopup =
              true;

            return;
          }

          if (error.status === 400) {

            this.errorMessage =
              error.error?.message ||
              'Invalid registration details.';

            return;
          }

          if (error.status === 429) {

            this.errorMessage =
              'Too many requests. Please try again later.';

            return;
          }

          if (error.status >= 500) {

            this.errorMessage =
              'Server error. Please try again later.';

            return;
          }

          this.errorMessage =
            'Unable to connect to the server.';
        }
      });
  }


  goToLogin(): void {

    this.showSuccessPopup = false;
    this.showAlreadyRegisteredPopup = false;

    this.router.navigate(['/login']);
  }


  closeAlreadyRegisteredPopup(): void {

    this.showAlreadyRegisteredPopup = false;
  }
}