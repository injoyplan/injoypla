import { Component, OnInit } from '@angular/core';
import { FooterComponent } from 'src/app/componentes/footer/footer.component';
import { HeaderComponent } from 'src/app/componentes/header/header.component';
@Component({
  standalone:true,
  imports: [HeaderComponent,FooterComponent],
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.css']
})
export class TerminosCondicionesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
