import { Component, OnInit } from '@angular/core';
import { FooterComponent } from 'src/app/componentes/footer/footer.component';
import { HeaderComponent } from 'src/app/componentes/header/header.component';
@Component({
  standalone:true,
  imports: [HeaderComponent,FooterComponent],
  selector: 'app-politica-privacidad',

  templateUrl: './politica-privacidad.component.html',
  styleUrls: ['./politica-privacidad.component.css']
})
export class PoliticaPrivacidadComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
