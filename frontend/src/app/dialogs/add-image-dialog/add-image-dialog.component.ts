import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Products } from "src/app/core/models/products.model";
import { ProductService } from "src/app/core/services/products.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-add-image-dialog",
  templateUrl: "./add-image-dialog.component.html",
  styleUrls: ["./add-image-dialog.component.scss"],
})
export class AddImageDialogComponent {
  selectedFileName: string | null = null;
  selectedFile: File | null = null;
  isUploading: boolean = false;
  uploadError: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Products },
    private productService: ProductService,
    private snackBar: MatSnackBar,
  ) {}

  onCancelClick(): void {
    if (!this.isUploading) {
      this.dialogRef.close();
    }
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      this.selectedFileName = this.selectedFile.name;
      this.uploadError = null;
      console.log("Archivo seleccionado:", this.selectedFile);
    } else {
      this.selectedFile = null;
      this.selectedFileName = null;
    }
  }

  onUploadClick(): void {
    if (!this.selectedFile) {
      this.uploadError = "Por favor, selecciona un archivo primero.";
      return;
    }
    if (!this.data.product.id) {
      this.uploadError =
        "ID del producto no encontrado. No se puede subir la imagen.";
      return;
    }

    this.isUploading = true;
    this.uploadError = null;

    this.productService
      .uploadProductImage(this.data.product.id, this.selectedFile)
      .pipe(finalize(() => (this.isUploading = false)))
      .subscribe({
        next: (response) => {
          console.log("Respuesta del servidor de subida de imagen:", response);
          this.snackBar.open(
            `Imagen "${this.selectedFileName}" subida exitosamente!`,
            "Cerrar",
            {
              duration: 3000,
              panelClass: ["success-snackbar"],
            },
          );
          this.dialogRef.close({ uploaded: true, imageInfo: response });
        },
        error: (err) => {
          console.error("Error al subir la imagen:", err);
          this.uploadError =
            err.message || "Falló la subida de la imagen. Intenta de nuevo.";
          // this.snackBar.open(this.uploadError, "Cerrar", {
          //   duration: 5000,
          //   panelClass: ['error-snackbar']
          // });
        },
      });
  }
}
