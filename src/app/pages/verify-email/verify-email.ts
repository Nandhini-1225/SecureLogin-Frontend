import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css'
})
export class VerifyEmail implements OnInit {

  message = 'Verifying your email...';
  isSuccess = false;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.isLoading = false;
      this.message = 'Invalid verification link.';
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
        this.message = 'Email verified successfully!';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.isSuccess = false;

        if (error.status === 400) {
          this.message =
            error.error?.message ||
            'Invalid or expired verification token.';
        } else {
          this.message =
            'Email verification failed. Please try again.';
        }
      }
    });
  }
}