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


    /* VALIDATION */

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
      '================================='
    );

    console.log(
      'REGISTRATION REQUEST STARTED'
    );

    console.log(
      'Email:',
      this.email.trim()
    );

    console.log(
      '================================='
    );


    this.authService
      .register(
        this.email.trim(),
        this.password,
        this.firstName.trim(),
        this.lastName.trim()
      )
      .subscribe({

        /* SUCCESS */

        next: (response) => {

          console.log(
            'REGISTRATION SUCCESS'
          );

          console.log(
            'Server response:',
            response
          );


          this.isLoading = false;


          this.message =
            'Registration successful!';


          /*
           * SHOW SUCCESS POPUP
           */

          this.showSuccessPopup = true;


          /*
           * CLEAR FORM
           */

          this.firstName = '';
          this.lastName = '';
          this.email = '';
          this.password = '';


          /*
           * AUTOMATIC REDIRECT
           *
           * User still has time to see
           * the successful registration popup.
           */

          setTimeout(() => {

            if (this.showSuccessPopup) {

              this.goToLogin();

            }

          }, 4000);

        },


        /* ERROR */

        error: (error) => {

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


          this.isLoading = false;


          /*
           * ALREADY REGISTERED
           */

          if (error.status === 409) {

            this.errorMessage =
              'This email is already registered.';

            this.showAlreadyRegisteredPopup =
              true;

            return;
          }


          /*
           * BAD REQUEST
           */

          if (error.status === 400) {

            this.errorMessage =
              error.error?.message ||
              'Invalid registration details.';

            return;
          }


          /*
           * RATE LIMIT
           */

          if (error.status === 429) {

            this.errorMessage =
              'Too many requests. Please try again later.';

            return;
          }


          /*
           * SERVER ERROR
           */

          if (error.status >= 500) {

            this.errorMessage =
              'Server error. Please try again later.';

            return;
          }


          /*
           * OTHER ERROR
           */

          this.errorMessage =
            'Unable to connect to the server.';

        }

      });
  }


  /*
   * GO TO LOGIN
   */

  goToLogin(): void {

    this.showSuccessPopup = false;

    this.showAlreadyRegisteredPopup = false;

    this.router.navigate([
      '/login'
    ]);

  }


  /*
   * CLOSE ALREADY REGISTERED POPUP
   */

  closeAlreadyRegisteredPopup(): void {

    this.showAlreadyRegisteredPopup =
      false;

  }

}