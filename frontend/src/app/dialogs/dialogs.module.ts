import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddImageDialogComponent } from "./add-image-dialog/add-image-dialog.component";
import { EditProductDialogComponent } from "./edit-product-dialog/edit-product-dialog.component";
import { ListImagesDialogComponent } from "./list-images-dialog/list-images-dialog.component";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
import { ConfirmDeleteDialogComponent } from "./confirm-delete-dialog/confirm-delete-dialog.component";
import { AddProductDialogComponent } from "./add-product-dialog/add-product-dialog.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
@NgModule({
  declarations: [
    EditProductDialogComponent,
    AddImageDialogComponent,
    ListImagesDialogComponent,
    ConfirmDeleteDialogComponent,
    AddProductDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
})
export class DialogsModule {}
