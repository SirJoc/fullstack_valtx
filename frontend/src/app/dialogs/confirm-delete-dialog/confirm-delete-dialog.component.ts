import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface ConfirmDeleteDialogData {
  title?: string;
  message: string;
  itemType?: string;
  itemName?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

@Component({
  selector: "app-confirm-delete-dialog",
  templateUrl: "./confirm-delete-dialog.component.html",
  styleUrls: ["./confirm-delete-dialog.component.scss"],
})
export class ConfirmDeleteDialogComponent {
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteDialogData,
  ) {
    this.title = data.title || "Eliminar";
    this.message = data.itemName
      ? `Estás seguro de que quiere eliminar el producto "${data.itemName}"?.`
      : data.message;
    this.confirmButtonText = data.confirmButtonText || "Eliminar";
    this.cancelButtonText = data.cancelButtonText || "Cancelar";
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }
}
