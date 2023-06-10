import { Component, OnInit } from '@angular/core';
import { FooterComponent } from 'src/app/componentes/footer/footer.component';
import { HeaderComponent } from 'src/app/componentes/header/header.component';
@Component({
  standalone:true,
  imports: [HeaderComponent,FooterComponent],
  selector: 'app-pregunta-frecuente',
  templateUrl: './pregunta-frecuente.component.html',
  styleUrls: ['./pregunta-frecuente.component.css']
})
export class PreguntaFrecuenteComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.categoriaPreguntas(0);
  }
  categoriaPreguntas(dato){

  }
}
