import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { AuthGuard } from "./core/guards/auth.guard";
import { ProductFormComponent } from "./products/product-form/product-form.component";
import { ProductListComponent } from "./products/product-list/product-list.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },

  {
    path: "products",
    canActivate: [AuthGuard],
    children: [
      { path: "", component: ProductListComponent, title: "My Products" },
      { path: "new", component: ProductFormComponent, title: "New Product" },
      {
        path: "edit/:id",
        component: ProductFormComponent,
        title: "Edit Product",
      },
    ],
  },

  { path: "", redirectTo: "/products", pathMatch: "full" },
  { path: "**", redirectTo: "/products" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
