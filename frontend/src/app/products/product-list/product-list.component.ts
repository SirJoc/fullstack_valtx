import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { finalize } from "rxjs";
import { Products } from "src/app/core/models/products.model";
import { ProductService } from "src/app/core/services/products.service";
import { AddImageDialogComponent } from "src/app/dialogs/add-image-dialog/add-image-dialog.component";
import {
  AddProductDialogComponent,
  NewProductData,
} from "src/app/dialogs/add-product-dialog/add-product-dialog.component";
import {
  ConfirmDeleteDialogComponent,
  ConfirmDeleteDialogData,
} from "src/app/dialogs/confirm-delete-dialog/confirm-delete-dialog.component";
import { EditProductDialogComponent } from "src/app/dialogs/edit-product-dialog/edit-product-dialog.component";
import { ListImagesDialogComponent } from "src/app/dialogs/list-images-dialog/list-images-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  errorMessage: string = "";
  isLoading: boolean = false;
  products: Products[] = [];
  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.iniList();
  }

  iniList(): void {
    this.productService.getProducts().subscribe((response) => {
      console.log(response);
      this.products = response;
    });
  }

  getFirstImageUrl(product: Products): string | null {
    if (product.images && product.images.length > 0 && product.images[0].url) {
      return product.images[0].url;
    }
    return "assets/noimage.webp";
  }

  editProduct(productToEdit: Products): void {
    if (!productToEdit.id) {
      console.error("Product ID is undefined. Cannot edit.");
      this.snackBar.open(
        "No se puede editar el producto: Falta el ID.",
        "Cerrar",
        { duration: 3000, panelClass: ["error-snackbar"] },
      );
      return;
    }

    console.log("Abriendo diálogo de edición para:", productToEdit.nombre);
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: "450px",
      disableClose: true,
      data: { product: productToEdit }, // Pass the original product data
    });

    dialogRef
      .afterClosed()
      .subscribe((resultFromDialog: Products | undefined) => {
        console.log("El diálogo de edición fue cerrado");
        if (resultFromDialog && resultFromDialog.id) {
          // Check if dialog returned data and ID is present
          console.log(
            "Datos del diálogo para guardar (producto actualizado):",
            resultFromDialog,
          );
          this.isLoading = true;
          this.errorMessage = "";

          // Prepare only the fields your backend expects for update
          const updatePayload = {
            nombre: resultFromDialog.nombre,
            categoria: resultFromDialog.categoria,
          };

          this.productService
            .updateProduct(resultFromDialog.id, updatePayload)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
              next: (updatedProductFromBackend) => {
                // Find the index of the product in the local array
                const index = this.products.findIndex(
                  (p) => p.id === updatedProductFromBackend.id,
                );
                if (index !== -1) {
                  // Update the product in the local array
                  this.products[index] = updatedProductFromBackend;
                  // Create a new array reference to trigger change detection if needed by onPush components
                  // this.products = [...this.products];
                  console.log(
                    "Producto actualizado exitosamente en la lista local:",
                    updatedProductFromBackend,
                  );
                  this.snackBar.open(
                    `Producto "${updatedProductFromBackend.nombre}" actualizado.`,
                    "Cerrar",
                    {
                      duration: 3000,
                      panelClass: ["success-snackbar"],
                    },
                  );
                } else {
                  // Should not happen if ID is consistent, but good to log
                  console.warn(
                    "Producto actualizado no encontrado en la lista local, recargando lista...",
                  );
                  // Optionally, you could refresh the entire list from the backend here
                  // this.loadProducts(); // Assuming you have a method to reload all products
                }
              },
              error: (err) => {
                console.error("Error al actualizar el producto:", err);
                this.errorMessage =
                  err.message || "Falló la actualización del producto.";
                this.snackBar.open(this.errorMessage, "Cerrar", {
                  duration: 5000,
                  panelClass: ["error-snackbar"],
                });
              },
            });
        } else {
          console.log(
            "Diálogo de edición cancelado o sin cambios para guardar.",
          );
        }
      });
  }

  addImage(product: Products): void {
    console.log("Opening add image dialog for:", product.nombre);
    const dialogRef = this.dialog.open(AddImageDialogComponent, {
      width: "400px",
      data: { product: product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The add image dialog was closed");
      if (result?.uploaded) {
        console.log("Image supposedly uploaded");
        this.iniList();
      } else {
        console.log("Add image dialog cancelled or upload failed.");
      }
    });
  }

  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: "450px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: NewProductData | undefined) => {
      console.log("El diálogo para agregar producto fue cerrado");
      if (result) {
        console.log("Datos del nuevo producto:", result);
        this.isLoading = true;
        this.errorMessage = "";

        this.productService
          .createProduct(result)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: (newProductFromBackend) => {
              this.products = [newProductFromBackend, ...this.products];
              console.log(
                "Producto agregado exitosamente y lista actualizada:",
                newProductFromBackend,
              );
            },
            error: (err) => {
              console.error("Error al crear el producto:", err);
              this.errorMessage =
                err.message || "Falló la creación del producto.";
            },
          });
      } else {
        console.log("Diálogo para agregar producto cancelado.");
      }
    });
  }

  listImages(product: Products): void {
    console.log("Opening list images dialog for:", product.nombre);
    this.dialog.open(ListImagesDialogComponent, {
      width: "500px",
      maxWidth: "90vw",
      data: { product: product },
    });
  }

  deleteProduct(product: Products): void {
    const dialogData: ConfirmDeleteDialogData = {
      itemName: product.nombre,
      itemType: "product",
      message: `¿Estás seguro de eliminar el producto "${product.nombre}"?`,
    };

    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: "400px",
      maxWidth: "90vw",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        console.log("User confirmed deletion for:", product.nombre);
        this.isLoading = true;
        this.productService
          .deleteProduct(product.id ?? "")
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: () => {
              this.products = this.products.filter((p) => p.id !== product.id);
              console.log("Product deleted successfully:", product.nombre);
            },
            error: (err) => {
              console.error("Error deleting product:", err);
              this.errorMessage =
                err?.error?.message ||
                err?.message ||
                "Failed to delete product.";
            },
          });
      } else {
        console.log("User cancelled deletion for:", product.nombre);
      }
    });
  }
}
