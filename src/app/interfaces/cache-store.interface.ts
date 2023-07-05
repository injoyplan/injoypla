
export interface CacheStore {

  byFiltro:BusquedaEvento;
}

export interface BusquedaEvento {
    evento: string;
    categoria: string;
    FechaDesde: string;
    HoraDesde: string;
    ubicacion: string;
    page:number;
    pageSize:number;
    busqueda:string;
}
