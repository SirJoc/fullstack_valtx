import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, tap, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environment";

export interface AuthResponseData {
  token: string;
  email: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private backendUrl = environment.apiUrl;
  private tokenKey = "accessToken";

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken(),
  );
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(`${this.backendUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.saveToken(response.token);
          this.saveUsername(response.email);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(this.handleError),
      );
  }

  logout(): void {
    this.removeToken();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(["/login"]);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  saveUsername(user: string): void {
    localStorage.setItem("username", user);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An unknown error occurred!";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 401 || error.status === 400) {
        errorMessage =
          error.error.message || "Invalid credentials or bad request.";
      } else {
        errorMessage = `Server returned code ${error.status}, error message is: ${error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
