import { environment } from "src/environments/environment";
import { favorito } from "./Favoritos.model";

const base_url = environment.endpointLocalImg;

export class FechaEvento{
  constructor(
  
    public estado?:  string,
    public favorito?  :favorito | undefined,
    public idUsuario?:  string,
    public HoraFinal?: string,
    public HoraInicio?: String,
    public FechaInicio?:  Date,
    public Monto?: string,
    public NombreLocal?:string,
    public url?:string,
    public urlFuente?:string,
    public titulo?:string,
    public evento?: string ,
    public idfecha?:  string    
  ){}

}
