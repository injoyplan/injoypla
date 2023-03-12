import { environment } from "src/environments/environment";

const base_url = environment.endpointLocalImg;

export class FechaEvento{
  constructor(
  
    public estado?:  string,
    public activado?:  boolean,
    public idUsuario?:  string,
    public HoraFin?: string,
    public HoraInicio?: String,
    public FechaInicio?:  Date,
    public precioxfechas?:   object,
    public evento?:  object,
    public _id ?: object
  ){}

}
