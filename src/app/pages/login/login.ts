import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  message = '';
  errorMessage = '';

  isLoading = false;
  showSuccessPopup = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    this.message = '';
    this.errorMessage = '';
    this.showSuccessPopup = false;

    if (
      !this.email.trim() ||
      !this.password
    ) {
      this.errorMessage =
        'Email and password are required.';
      return;
    }

    this.isLoading = true;

    console.log('LOGIN REQUEST STARTED');
    console.log('Email:', this.email.trim());

    this.authService
      .login(
        this.email.trim(),
        this.password
      )
      .subscribe({

        next: (response) => {

          console.log(
            'LOGIN SUCCESS',
            response
          );

          this.isLoading = false;

          const token =
            response?.token ||
            response?.accessToken;

          if (token) {

            sessionStorage.setItem(
              'access_token',
              token
            );

            console.log(
              'JWT stored successfully.'
            );

          } else {

            console.warn(
              'Login succeeded, but no JWT token was found.'
            );
          }

          this.message =
            'You have successfully logged in!';

          this.showSuccessPopup = true;
        },

        error: (error) => {

          console.error(
            'LOGIN FAILED',
            error
          );

          this.isLoading = false;
          this.showSuccessPopup = false;

          if (error.status === 401) {

            this.errorMessage =
              error.error?.message ||
              'Invalid email or password, or email is not verified.';

            return;
          }

          if (error.status === 429) {

            this.errorMessage =
              'Too many login attempts. Please try again later.';

            return;
          }

          if (error.status === 400) {

            this.errorMessage =
              error.error?.message ||
              'Please check the information you entered.';

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


  continueAfterLogin(): void {

    this.showSuccessPopup = false;

    this.router.navigate(['/']);
  }
}