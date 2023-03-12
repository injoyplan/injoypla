import { CommonModule, NgIf, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.modules';

@Component({
  standalone:true,
  imports: [CommonModule,FormsModule,SharedModule,NgOptimizedImage,RouterLink,NgIf],
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

}
