import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  exports: [HeaderComponent],
})
export class ComponentsModule {}
