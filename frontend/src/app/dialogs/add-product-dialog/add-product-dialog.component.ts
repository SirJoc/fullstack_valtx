import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

export interface NewProductData {
  nombre: string;
  categoria: string;
}

@Component({
  selector: "app-add-product-dialog",
  templateUrl: "./add-product-dialog.component.html",
  styleUrls: ["./add-product-dialog.component.scss"],
})
export class AddProductDialogComponent {
  newProduct: NewProductData = {
    nombre: "",
    categoria: "",
  };

  constructor(public dialogRef: MatDialogRef<AddProductDialogComponent>) {}

  onSaveClick(): void {
    if (this.newProduct.nombre.trim() && this.newProduct.categoria.trim()) {
      this.dialogRef.close(this.newProduct);
    } else {
      console.warn("Nombre y categoría son requeridos.");
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
