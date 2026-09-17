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

  email = '';
  password = '';

  showPassword = false;

  message = '';
  errorMessage = '';

  isLoading = false;
  showSuccessPopup = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  // ==========================================================
  // LOGIN
  // ==========================================================

  login(): void {

    this.message = '';
    this.errorMessage = '';
    this.showSuccessPopup = false;


    // ========================================================
    // BASIC VALIDATION
    // ========================================================

    if (
      !this.email.trim() ||
      !this.password
    ) {

      this.errorMessage =
        'Email and password are required.';

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
    // START LOADING
    // ========================================================

    this.isLoading = true;


    console.log('=================================');
    console.log('LOGIN REQUEST STARTED');
    console.log(
      'Email:',
      this.email.trim()
    );
    console.log('=================================');


    // ========================================================
    // SEND LOGIN REQUEST
    // ========================================================

    this.authService
      .login(
        this.email.trim(),
        this.password
      )
      .subscribe({

        // ====================================================
        // LOGIN SUCCESS
        // ====================================================

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


          this.isLoading = false;


          // ==================================================
          // GET JWT TOKEN
          // ==================================================

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


          // ==================================================
          // SUCCESS MESSAGE
          // ==================================================

          this.message =
            'You have successfully logged in!';


          // ==================================================
          // SHOW SUCCESS POPUP
          // ==================================================

          this.showSuccessPopup = true;


          // ==================================================
          // FORCE UI UPDATE
          // ==================================================

          this.changeDetectorRef.detectChanges();


          console.log(
            'Login success message:',
            this.message
          );

          console.log(
            'showSuccessPopup =',
            this.showSuccessPopup
          );

          console.log(
            'isLoading =',
            this.isLoading
          );

        },


        // ====================================================
        // LOGIN ERROR
        // ====================================================

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


          this.isLoading = false;

          this.showSuccessPopup = false;


          // ==================================================
          // 401 UNAUTHORIZED
          // ==================================================

          if (error.status === 401) {

            this.errorMessage =
              error.error?.message ||
              'Invalid email or password, or email is not verified.';

            this.changeDetectorRef.detectChanges();

            return;
          }


          // ==================================================
          // 429 RATE LIMIT
          // ==================================================

          if (error.status === 429) {

            this.errorMessage =
              'Too many login attempts. Please try again later.';

            this.changeDetectorRef.detectChanges();

            return;
          }


          // ==================================================
          // 400 BAD REQUEST
          // ==================================================

          if (error.status === 400) {

            this.errorMessage =
              error.error?.message ||
              'Please check the information you entered.';

            this.changeDetectorRef.detectChanges();

            return;
          }


          // ==================================================
          // 500+ SERVER ERROR
          // ==================================================

          if (error.status >= 500) {

            this.errorMessage =
              'Server error. Please try again later.';

            this.changeDetectorRef.detectChanges();

            return;
          }


          // ==================================================
          // CONNECTION ERROR
          // ==================================================

          this.errorMessage =
            'Unable to connect to the server.';

          this.changeDetectorRef.detectChanges();

        }

      });

  }


  // ==========================================================
  // CONTINUE AFTER LOGIN
  // ==========================================================

  continueAfterLogin(): void {

    console.log(
      'Continue button clicked.'
    );


    this.showSuccessPopup = false;


    this.router.navigate(['/']);

  }

}