import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Products, Images } from "src/app/core/models/products.model"; // Adjust path

@Component({
  selector: "app-list-images-dialog",
  templateUrl: "./list-images-dialog.component.html",
  styleUrls: ["./list-images-dialog.component.scss"],
})
export class ListImagesDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ListImagesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Products },
  ) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }

  deleteImage(imageId: string): void {
    console.log("Delete image:", imageId, "for product:", this.data.product.id);
  }
}
