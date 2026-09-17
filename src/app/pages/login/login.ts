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

  // ==============================
  // FORM FIELDS
  // ==============================

  email = '';
  password = '';


  // ==============================
  // MESSAGES
  // ==============================

  message = '';
  errorMessage = '';


  // ==============================
  // UI STATE
  // ==============================

  isLoading = false;

  showSuccessPopup = false;

  showPassword = false;


  // ==============================
  // CONSTRUCTOR
  // ==============================

  constructor(
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  // ==============================
  // LOGIN
  // ==============================

  login(): void {

    this.message = '';
    this.errorMessage = '';
    this.showSuccessPopup = false;

    // ==============================
    // VALIDATION
    // ==============================

    if (
      !this.email.trim() ||
      !this.password
    ) {

      this.errorMessage =
        'Email and password are required.';

      this.changeDetectorRef.detectChanges();

      return;
    }


    // ==============================
    // START LOADING
    // ==============================

    this.isLoading = true;

    this.changeDetectorRef.detectChanges();


    console.log(
      '================================='
    );

    console.log(
      'LOGIN REQUEST STARTED'
    );

    console.log(
      'Email:',
      this.email.trim()
    );

    console.log(
      '================================='
    );


    // ==============================
    // API REQUEST
    // ==============================

    this.authService
      .login(
        this.email.trim(),
        this.password
      )
      .subscribe({

        // ==========================
        // SUCCESS
        // ==========================

        next: (response) => {

          console.log(
            '================================='
          );

          console.log(
            'LOGIN SUCCESS'
          );

          console.log(
            'Server response:',
            response
          );

          console.log(
            '================================='
          );


          // Stop loading
          this.isLoading = false;


          // ==========================
          // GET JWT
          // ==========================

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
              'Login succeeded, but no JWT token was found in the response.'
            );
          }


          // ==========================
          // SUCCESS MESSAGE
          // ==========================

          this.message =
            'You have successfully logged in!';


          // ==========================
          // SHOW POPUP
          // ==========================

          this.showSuccessPopup = true;


          console.log(
            'Login success message:',
            this.message
          );

          console.log(
            'Success popup:',
            this.showSuccessPopup
          );

          console.log(
            'Loading:',
            this.isLoading
          );


          // ==========================
          // FORCE UI UPDATE
          // ==========================

          this.changeDetectorRef.detectChanges();

        },


        // ==========================
        // ERROR
        // ==========================

        error: (error) => {

          console.error(
            '================================='
          );

          console.error(
            'LOGIN FAILED'
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


          // Stop loading
          this.isLoading = false;

          // Close success popup
          this.showSuccessPopup = false;


          // ==========================
          // 401
          // ==========================

          if (error.status === 401) {

            this.errorMessage =
              error.error?.message ||
              'Invalid email or password, or email is not verified.';

            this.changeDetectorRef.detectChanges();

            return;
          }


          // ==========================
          // 429
          // ==========================

          if (error.status === 429) {

            this.errorMessage =
              'Too many login attempts. Please try again later.';

            this.changeDetectorRef.detectChanges();

            return;
          }


          // ==========================
          // 400
          // ==========================

          if (error.status === 400) {

            this.errorMessage =
              error.error?.message ||
              'Please check the information you entered.';

            this.changeDetectorRef.detectChanges();

            return;
          }


          // ==========================
          // 403
          // ==========================

          if (error.status === 403) {

            this.errorMessage =
              error.error?.message ||
              'Access denied. Please verify your account.';

            this.changeDetectorRef.detectChanges();

            return;
          }


          // ==========================
          // 500+
          // ==========================

          if (error.status >= 500) {

            this.errorMessage =
              'Server error. Please try again later.';

            this.changeDetectorRef.detectChanges();

            return;
          }


          // ==========================
          // CONNECTION ERROR
          // ==========================

          this.errorMessage =
            'Unable to connect to the server.';

          this.changeDetectorRef.detectChanges();

        }

      });
  }


  // ==============================
  // SHOW / HIDE PASSWORD
  // ==============================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

    this.changeDetectorRef.detectChanges();
  }


  // ==============================
  // CONTINUE AFTER LOGIN
  // ==============================

  continueAfterLogin(): void {

    console.log(
      'Continue button clicked.'
    );

    this.showSuccessPopup = false;

    this.changeDetectorRef.detectChanges();

    this.router.navigate(['/']);
  }

}