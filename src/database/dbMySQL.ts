import mysql from 'mysql2/promise';
import { type RowDataPacket } from "mysql2"



export enum Dificultad {
  Principiante = 'Principiante',
  Intermedio = 'Intermedio',
  Avanzado = 'Avanzado',

}
export enum Formato {
  PDF = 'PDF',
  Video = 'Video',
  Imagen = 'Imagen',
  Presentacion = 'Presentacion',
  Otro = 'Otro'

}
export enum Tipo {
  DePago = 'Curso de pago',
  Gratuito = 'Curso gratuito',
  Webinar = 'Webinar',
  Libro = 'Libro',
  Guia = 'Guia',
  Tutorial = 'Tutorial',
  Documentacion = 'Documentacion',
  Articulo = 'Articulo',
  Otro = 'Otro'

}

export interface IRoadmapEsquema extends RowDataPacket {
  idRoadmap: string
  description: string
  relatedRoadmap: string
}

export interface IRol extends RowDataPacket {
  idRol: string
  experiencia: string
}



export interface IRecurso extends RowDataPacket {
  idRecurso?: number
  titulo: string
  enlaceFichero: string
  interno: boolean
  descripcion: string | null;
  n_Dificultad: Dificultad | null;
  tipo: Tipo | null;
  formato: Formato | null;
  idioma: string | null;
  deInteres: number | null;
}

export interface ICategoria extends RowDataPacket {
  idNombre: string
  descripcion: string
  categoriaSuperior: string

}

export interface IRelacionRecursoCategoria extends RowDataPacket {
  idRecurso: number
  idNombre: string

}

export interface IRoadmapComponentePrioridad extends RowDataPacket {
  idRoadmap: number
  componenteCategoria: string
  prioriadad?: number

}


export interface ICategoriaSubNivel extends RowDataPacket {
  componenteCategoria: string
  categoriaSuperior: string
}

export interface User extends RowDataPacket {
  id: string
  username: string
  password: string
  admin: boolean
  mentor: boolean
}
export const prerender = false;

const connectionConfig = {
  host: '172.20.133.21',
  //host: 'localhost',
  user: 'roadmap',
  password: 'roadmap',
  database: 'roadmap-v2',
  //database: 'roadmapcompleto',
  //port: 3307,
  port: 3306

};


/*

const connectionPropia = {
  host: '172.20.133.21',
  user: 'root',
  password: 'root',
  database: 'roadmap3',
  port: 3306

};

*/






export const pool = mysql.createPool(connectionConfig);



export { pool as db }
