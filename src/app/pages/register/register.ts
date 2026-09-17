import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

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

  showPassword = false;

  showSuccessPopup = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  // ==========================================
  // REGISTRATION
  // ==========================================

  register(): void {

    this.message = '';
    this.errorMessage = '';
    this.showSuccessPopup = false;

    // Basic frontend validation
    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.password
    ) {

      this.errorMessage =
        'Please fill in all fields.';

      this.changeDetectorRef.detectChanges();

      return;
    }

    this.isLoading = true;

    this.changeDetectorRef.detectChanges();

    console.log('=================================');
    console.log('REGISTRATION REQUEST STARTED');
    console.log(
      'Email:',
      this.email.trim()
    );
    console.log('=================================');

    this.authService
      .register(
        this.email.trim(),
        this.password,
        this.firstName.trim(),
        this.lastName.trim()
      )
      .subscribe({

        // ========================================
        // REGISTRATION SUCCESS
        // ========================================

        next: (response) => {

          this.isLoading = false;

          console.log(
            '================================='
          );

          console.log(
            'REGISTRATION SUCCESS'
          );

          console.log(
            'Server response:',
            response
          );

          console.log(
            '================================='
          );

          this.message =
            'Registration successful!';

          this.showSuccessPopup = true;

          // Clear form
          this.firstName = '';
          this.lastName = '';
          this.email = '';
          this.password = '';

          this.changeDetectorRef.detectChanges();
        },


        // ========================================
        // REGISTRATION ERROR
        // ========================================

        error: (error) => {

          this.isLoading = false;

          console.error(
            '================================='
          );

          console.error(
            'REGISTRATION FAILED'
          );

          console.error(
            'Status:',
            error.status
          );

          console.error(
            'Response:',
            error.error
          );

          console.error(
            '================================='
          );


          // Already registered
          if (error.status === 409) {

            this.errorMessage =
              'This email is already registered.';

            this.changeDetectorRef.detectChanges();

            return;
          }


          // Bad request
          if (error.status === 400) {

            this.errorMessage =
              error.error?.message ||
              'Invalid registration details.';

            this.changeDetectorRef.detectChanges();

            return;
          }


          // Rate limit
          if (error.status === 429) {

            this.errorMessage =
              'Too many requests. Please try again later.';

            this.changeDetectorRef.detectChanges();

            return;
          }


          // Server error
          if (error.status >= 500) {

            this.errorMessage =
              'Server error. Please try again later.';

            this.changeDetectorRef.detectChanges();

            return;
          }


          // Unknown error
          this.errorMessage =
            'Unable to connect to the server.';

          this.changeDetectorRef.detectChanges();
        }
      });
  }


  // ==========================================
  // SHOW / HIDE PASSWORD
  // ==========================================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

    this.changeDetectorRef.detectChanges();
  }


  // ==========================================
  // GO TO LOGIN
  // ==========================================

  goToLogin(): void {

    this.showSuccessPopup = false;

    this.changeDetectorRef.detectChanges();

    this.router.navigate(['/login']);
  }

}