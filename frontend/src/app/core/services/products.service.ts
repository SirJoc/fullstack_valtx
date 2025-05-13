import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { Products } from "../models/products.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private backendUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(`${this.backendUrl}/products`).pipe(
      tap((response) => {}),
      catchError(this.handleError),
    );
  }

  uploadProductImage(productId: string, file: File): Observable<any> {
    if (!productId) {
      return throwError(
        () => new Error("Product ID es requerido para subir la imagen."),
      );
    }
    if (!file) {
      return throwError(
        () => new Error("El archivo es requerido para subir la imagen."),
      );
    }

    const formData = new FormData();
    formData.append("file", file, file.name);

    const url = `${this.backendUrl}/products/${productId}/images`;

    return this.http.post<any>(url, formData).pipe(
      tap((response) => {
        console.log("Imagen subida exitosamente al backend:", response);
      }),
      catchError(this.handleError),
    );
  }

  updateProduct(
    productId: string,
    productUpdateData: { nombre: string; categoria: string },
  ): Observable<Products> {
    if (!productId) {
      return throwError(
        () =>
          new Error(
            "Product ID es requerido para la operación de actualización.",
          ),
      );
    }
    if (
      !productUpdateData ||
      !productUpdateData.nombre ||
      !productUpdateData.categoria
    ) {
      return throwError(
        () =>
          new Error(
            "Los datos del producto (nombre y categoría) son requeridos para la actualización.",
          ),
      );
    }

    const url = `${this.backendUrl}/products/${productId}`;
    return this.http.put<Products>(url, productUpdateData).pipe(
      tap((updatedProduct) => {
        console.log(
          `Solicitud de actualización exitosa para el ID de producto: ${productId}`,
          updatedProduct,
        );
      }),
      catchError(this.handleError),
    );
  }

  createProduct(productData: {
    nombre: string;
    categoria: string;
  }): Observable<Products> {
    const url = `${this.backendUrl}/products`;
    return this.http.post<Products>(url, productData).pipe(
      tap((newlyCreatedProduct) => {
        console.log(
          "Producto creado exitosamente en el backend:",
          newlyCreatedProduct,
        );
      }),
      catchError(this.handleError), // Reutiliza tu manejador de errores existente
    );
  }

  deleteProduct(productId: string): Observable<void> {
    if (!productId) {
      return throwError(
        () => new Error("Product ID cannot be empty for delete operation."),
      );
    }
    const url = `${this.backendUrl}/products/${productId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        console.log(`Delete request successful for product ID: ${productId}`);
      }),
      catchError(this.handleError),
    );
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
