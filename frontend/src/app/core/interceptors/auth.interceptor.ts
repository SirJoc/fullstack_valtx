import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private excludedPaths: string[] = ["/auth/login", "/auth/register"];

  private fullExcludedUrls: string[];
  constructor() {
    this.fullExcludedUrls = this.excludedPaths.map(
      (path) => environment.apiUrl + path,
    );
    if (!environment.production) {
      console.log(
        "AuthInterceptor initialized. Excluded URLs:",
        this.fullExcludedUrls,
      );
    }
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const isExcluded = this.fullExcludedUrls.some((url) =>
      req.url.startsWith(url),
    );
    if (isExcluded) {
      if (!environment.production) {
        console.log(
          `AuthInterceptor: Excluding URL from token addition: ${req.url}`,
        );
      }
      return next.handle(req);
    }
    const accessToken = localStorage.getItem("accessToken"); // Or get it from your auth service

    if (accessToken) {
      if (!environment.production) {
        console.log(`AuthInterceptor: Adding token to URL: ${req.url}`);
      }
      const clonedReq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${accessToken}`),
      });
      return next.handle(clonedReq);
    } else {
      if (!environment.production) {
        console.warn(
          `AuthInterceptor: No access token found for URL: ${req.url}. Passing request without token.`,
        );
      }
      return next.handle(req);
    }
  }
}
