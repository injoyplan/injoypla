import { Component, OnInit } from '@angular/core';
import { FooterComponent } from 'src/app/componentes/footer/footer.component';
import { HeaderComponent } from 'src/app/componentes/header/header.component';
@Component({
  standalone:true,
  selector: 'app-acerca-nosotros',
  templateUrl: './acerca-nosotros.component.html',
  imports: [HeaderComponent,FooterComponent],
  styleUrls: ['./acerca-nosotros.component.css']
})
export class AcercaNosotrosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
