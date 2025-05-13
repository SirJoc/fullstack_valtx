import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Products } from "src/app/core/models/products.model"; // Adjust path as needed

@Component({
  selector: "app-edit-product-dialog",
  templateUrl: "./edit-product-dialog.component.html",
  styleUrls: ["./edit-product-dialog.component.scss"],
})
export class EditProductDialogComponent {
  productData: Products;

  constructor(
    public dialogRef: MatDialogRef<EditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Products },
  ) {
    this.productData = { ...data.product };
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.productData.nombre.trim() && this.productData.categoria.trim()) {
      this.dialogRef.close(this.productData);
    } else {
      console.warn("Nombre y categoría son requeridos para guardar.");
    }
  }
}
