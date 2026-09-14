import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
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

  constructor(
    private authService: AuthService
  ) {}

  register(): void {

    this.message = '';
    this.errorMessage = '';

    // Basic frontend validation
    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.password
    ) {
      this.errorMessage = 'Please fill in all fields.';

      alert('Please fill in all fields.');

      return;
    }

    this.isLoading = true;

    console.log('Sending registration request...');

    // IMPORTANT:
    // AuthService.register() expects:
    // email, password, firstName, lastName

    this.authService.register(
      this.email.trim(),
      this.password,
      this.firstName.trim(),
      this.lastName.trim()
    )
    .subscribe({

      next: (response) => {

        this.isLoading = false;

        console.log(
          'Registration successful:',
          response
        );

        this.message = 'Registration successful!';

        alert(
          'Registration successful!\n\n' +
          'Please check your email and verify your account before logging in.'
        );

        // Clear form
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.password = '';
      },

      error: (error) => {

        this.isLoading = false;

        console.error(
          'Registration failed:',
          error
        );

        // Already registered
        if (error.status === 409) {

          this.errorMessage =
            'This email is already registered.';

          alert(
            'Already Registered\n\n' +
            'An account with this email already exists.'
          );

          return;
        }

        // Bad request / validation error
        if (error.status === 400) {

          let backendMessage =
            'Invalid registration details.';

          if (error.error?.message) {
            backendMessage =
              error.error.message;
          }

          this.errorMessage =
            backendMessage;

          alert(
            'Registration Failed\n\n' +
            backendMessage
          );

          return;
        }

        // Rate limit
        if (error.status === 429) {

          this.errorMessage =
            'Too many requests. Please try again later.';

          alert(
            'Too Many Requests\n\n' +
            'Please wait a moment and try again.'
          );

          return;
        }

        // Server error
        if (error.status >= 500) {

          this.errorMessage =
            'Server error. Please try again later.';

          alert(
            'Server Error\n\n' +
            'Please try again later.'
          );

          return;
        }

        // Unknown error
        this.errorMessage =
          'Unable to connect to the server.';

        alert(
          'Registration Error\n\n' +
          'Unable to connect to the server.'
        );
      }
    });
  }
}