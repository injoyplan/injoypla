import { Component, OnInit } from '@angular/core';
import { FooterComponent } from 'src/app/componentes/footer/footer.component';
import { HeaderComponent } from 'src/app/componentes/header/header.component';
@Component({
  standalone:true,
  imports: [HeaderComponent,FooterComponent],
  selector: 'app-contactanos',
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.css']
})
export class ContactanosComponent implements OnInit {
  public correo = {
    nombreCompleto:'',
    CorreoContacto:'',
    TelefonContacto:'',
    MotivoDelMensaje:'',
    Descripcion:''

  }
  constructor() { }

  ngOnInit(): void {
  }
  enviarCorreo(){

  }
}
