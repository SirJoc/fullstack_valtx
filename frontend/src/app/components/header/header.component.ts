import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  username: string | null = null;
  isAuthenticated$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    this.username = localStorage.getItem("username");

    this.authService.isAuthenticated$.subscribe((isAuth) => {
      if (isAuth) {
        this.username = localStorage.getItem("username");
      } else {
        this.username = null;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
