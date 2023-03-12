import { environment } from "src/environments/environment";

const base_url = environment.endpointLocalImg;

export class Usuario{
  constructor(
   public nombre : string ,
   public Apellido : string ,
   public Direccion?:  string ,
   public email?:string ,
   public telefono?: string ,
   public imagenPerfil?:  string ,
   public google?:  Boolean,
   public genero?:  string,
   public f_nacimiento?:  string,
   public TipoDocumento?: string,
   public NroDocumento?: string,
   public terminoCondiciones?:  Boolean,
   public politica?:   Boolean,
   public notifNewsletter?:  Boolean
  ){}

  get ImagenURl(){
    debugger;
    if(this.imagenPerfil != 'perfil.png') {
      return `${base_url}/src/assets/img/${this.imagenPerfil}`;
    } else {
      return  `${base_url}/src/assets/img/no-profile-picture-icon.png`;
    }
  }
}
