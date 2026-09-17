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
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  passwordStrength = 0;
  passwordStrengthLabel = '';

  message = '';
  errorMessage = '';

  isLoading = false;

  showSuccessPopup = false;
  showAlreadyRegisteredPopup = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  // ==========================================================
  // PASSWORD STRENGTH
  // ==========================================================

  updatePasswordStrength(): void {

    const password = this.password;

    let score = 0;


    if (password.length >= 12) {
      score++;
    }

    if (/[A-Z]/.test(password)) {
      score++;
    }

    if (/[a-z]/.test(password)) {
      score++;
    }

    if (/[0-9]/.test(password)) {
      score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    }


    this.passwordStrength = score;


    if (!password) {

      this.passwordStrengthLabel = '';

    } else if (score <= 2) {

      this.passwordStrengthLabel = 'Weak';

    } else if (score === 3) {

      this.passwordStrengthLabel = 'Fair';

    } else if (score === 4) {

      this.passwordStrengthLabel = 'Strong';

    } else {

      this.passwordStrengthLabel = 'Very Strong';

    }

  }


  // ==========================================================
  // PASSWORD VALIDATION
  // ==========================================================

  isPasswordValid(): boolean {

    return (
      this.password.length >= 12 &&
      /[A-Z]/.test(this.password) &&
      /[a-z]/.test(this.password) &&
      /[0-9]/.test(this.password) &&
      /[^A-Za-z0-9]/.test(this.password)
    );

  }


  // ==========================================================
  // REGISTRATION
  // ==========================================================

  register(): void {

    this.message = '';
    this.errorMessage = '';

    this.showSuccessPopup = false;
    this.showAlreadyRegisteredPopup = false;


    // ========================================================
    // BASIC VALIDATION
    // ========================================================

    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.confirmPassword
    ) {

      this.errorMessage =
        'Please fill in all fields.';

      return;
    }


    // ========================================================
    // EMAIL VALIDATION
    // ========================================================

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.email.trim())) {

      this.errorMessage =
        'Please enter a valid email address.';

      return;
    }


    // ========================================================
    // PASSWORD VALIDATION
    // ========================================================

    if (!this.isPasswordValid()) {

      this.errorMessage =
        'Password must contain at least 12 characters, including uppercase, lowercase, number and special character.';

      return;
    }


    // ========================================================
    // CONFIRM PASSWORD
    // ========================================================

    if (this.password !== this.confirmPassword) {

      this.errorMessage =
        'Passwords do not match.';

      return;
    }


    // ========================================================
    // START LOADING
    // ========================================================

    this.isLoading = true;


    console.log(
      'Sending registration request...'
    );


    // ========================================================
    // SEND REGISTRATION REQUEST
    // ========================================================

    this.authService
      .register(
        this.email.trim(),
        this.password,
        this.firstName.trim(),
        this.lastName.trim()
      )
      .subscribe({

        // ====================================================
        // REGISTRATION SUCCESS
        // ====================================================

        next: (response) => {

          this.isLoading = false;

          console.log(
            'Registration successful:',
            response
          );


          this.message =
            'Registration successful!';


          this.showSuccessPopup = true;


          this.changeDetectorRef.detectChanges();


          // Clear form after successful registration
          this.firstName = '';
          this.lastName = '';
          this.email = '';
          this.password = '';
          this.confirmPassword = '';

          this.passwordStrength = 0;
          this.passwordStrengthLabel = '';

        },


        // ====================================================
        // REGISTRATION ERROR
        // ====================================================

        error: (error) => {

          this.isLoading = false;

          console.error(
            'Registration failed:',
            error
          );


          // ==================================================
          // ALREADY REGISTERED
          // ==================================================

          if (error.status === 409) {

            this.showAlreadyRegisteredPopup = true;

            this.changeDetectorRef.detectChanges();

            return;
          }


          // ==================================================
          // BAD REQUEST
          // ==================================================

          if (error.status === 400) {

            let backendMessage =
              'Invalid registration details.';


            if (error.error?.message) {

              backendMessage =
                error.error.message;

            }


            this.errorMessage =
              backendMessage;

            this.changeDetectorRef.detectChanges();

            return;
          }


          // ==================================================
          // RATE LIMIT
          // ==================================================

          if (error.status === 429) {

            this.errorMessage =
              'Too many requests. Please try again later.';

            this.changeDetectorRef.detectChanges();

            return;
          }


          // ==================================================
          // SERVER ERROR
          // ==================================================

          if (error.status >= 500) {

            this.errorMessage =
              'Server error. Please try again later.';

            this.changeDetectorRef.detectChanges();

            return;
          }


          // ==================================================
          // UNKNOWN ERROR
          // ==================================================

          this.errorMessage =
            'Unable to connect to the server.';

          this.changeDetectorRef.detectChanges();

        }

      });

  }


  // ==========================================================
  // GO TO LOGIN
  // ==========================================================

  goToLogin(): void {

    this.showSuccessPopup = false;

    this.router.navigate(['/login']);

  }


  // ==========================================================
  // CLOSE ALREADY REGISTERED POPUP
  // ==========================================================

  closeAlreadyRegisteredPopup(): void {

    this.showAlreadyRegisteredPopup = false;

  }

}