import { Component, Input } from '@angular/core';
import { CommonModule, NgIf, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.modules';
import { RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule,FormsModule,SharedModule,NgOptimizedImage,RouterLink,NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  @Input() isActivePerfil:any=false;
  @Input() isActive:any=false;
  @Input() isActiveEventos:any=false;

  public usuario ="";
  public constructor(private cookieService: CookieService,){
    const _current = this.cookieService.get('_currentUser');
    const _parseCurrent = (_current && JSON.parse(this.cookieService.get('_currentUser'))) ?
    JSON.parse(this.cookieService.get('_currentUser')) : null;

    if (_parseCurrent) {

      this.usuario =  _parseCurrent.sub

    } else {
      this.usuario = "";
    }
  }
}
