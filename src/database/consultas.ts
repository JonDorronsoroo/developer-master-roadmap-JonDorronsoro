import { type ResultSetHeader} from "mysql2"

import { type IRecurso, db, type IRoadmapEsquema, type ICategoriaSubNivel } from "./dbMySQL";
import { type ICategoria , type IRol,type User} from "./dbMySQL";
import { generateId } from "lucia";
import {type IRoadmapComponentePrioridad}   from "./dbMySQL";
import {ER_DUP_ENTRY} from 'mysql-error-keys'



export interface MyErrorEvent {
    code: number;
    message: string;
}

export class ProblemaBD extends Error {
    constructor(message: string | undefined) {
        super(message);
        this.name = 'DatabaseException';
        
    }
}
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  INSERT INTO BD %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   /**  export const inserUsuario= async (email: string, password: string) => {
            const connection = await db.getConnection();
            try {
                const query = `INSERT INTO Usuario (email, password) VALUES ('${email}', '${password}')`;
                const [result] = await connection.execute<ResultSetHeader>(query, [email, password]);
                return result.insertId;
            } catch (error) {
                console.error('Error adding user:', error);

            }finally {
                connection.release();
            }
    }*/
    export const insertRelacionRoadmapCategoria = async (roadmap: string, categoria: string, prioridad?: number) => {
        const connection = await db.getConnection();
        try {
            let query: string;
            let result: ResultSetHeader; // Change the type annotation to ResultSetHeader
            if(prioridad){
                 query = `INSERT INTO Roadmap_categoria (idRoadmap, componenteCategoria, prioridad) VALUES ('${roadmap}', '${categoria}', '${prioridad}')`;
                [result] = await connection.execute<ResultSetHeader>(query, [roadmap, categoria, prioridad]);
            }else{
                query = `INSERT INTO Roadmap_categoria  (idRoadmap, componenteCategoria) VALUES ('${roadmap}', '${categoria}')`;
                [result] = await connection.execute<ResultSetHeader>(query, [roadmap, categoria]);
            }
    
            return result.insertId;
        } catch (error) {
            console.error('Error adding relacion roadmap-categoria:', error);
        }finally {
            connection.release();
        }
    }

    export const insertNuevoRoadmap = async (roadmap: string, descripcion: string, relatedRoadmap?:string) => {
        const connection = await db.getConnection();
        try {
            let result: ResultSetHeader; 
            let query: string;
            if(relatedRoadmap){
                query = `INSERT INTO EsquemaRoadmap (idRoadmap,  description, relatedRoadmap) VALUES ('${roadmap}', '${descripcion}', '${relatedRoadmap}')`;
                [result] = await connection.execute<ResultSetHeader>(query, [roadmap,  descripcion, relatedRoadmap]);
            }else{
                query = `INSERT INTO EsquemaRoadmap (idRoadmap,description) VALUES ('${roadmap}', '${descripcion}')`;
                [result] = await connection.execute<ResultSetHeader>(query, [roadmap,   descripcion]);

            }
            
            
            
            return result.insertId
        } catch (error) {
            console.error('Error adding a new roadmap', error);
        }finally {
            connection.release();
        }
    }


export const insertResource = async (titulo:string, enlaceFichero:string,interno:boolean,descripcion:string | null,n_Dificultad:string | null,tipo:string | null,formato:string | null,idioma:string | null,deInteres:number | null ) => {
    const connection = await db.getConnection();
    const internoExterno = interno ? 1 : 0;
    const dificultad = n_Dificultad ? `'${n_Dificultad}'` : null;
    const tipoRecurso = tipo ? `'${tipo}'` : null;
    const formatoRecurso = formato ? `'${formato}'` : null;
    const idiomaRecurso = idioma ? `'${idioma}'` : null;
    const deInteresRecurso = deInteres ? `'${deInteres}'` : null;

    try {
        
        const query = `INSERT INTO Recurso (titulo, enlaceFichero,interno,descripcion,n_dificultad,tipo,formato,idioma,deInteres) VALUES ('${titulo}', '${enlaceFichero}','${internoExterno}','${descripcion}',${dificultad},${tipoRecurso},${formatoRecurso},${idiomaRecurso},${deInteresRecurso})`;
        const [result] = await connection.execute<ResultSetHeader>(query, [titulo, enlaceFichero, internoExterno,descripcion, dificultad, tipoRecurso, formatoRecurso,idiomaRecurso,deInteres]);
        
        return result.insertId;
    } catch (error) {
        const errorDuplicate: MyErrorEvent = {
                code: 11062,
                message: ER_DUP_ENTRY
                
        };
        throw errorDuplicate
        }finally {
        connection.release();
        }

}


export const insertRelacionRecursoCategoria = async (idRecurso: number, idNombre: string) => {
    const connection = await db.getConnection();
    try{
        
        const query = `INSERT INTO Recurso_categoria (idRecurso, idNombre) VALUES ('${idRecurso}', '${idNombre}')`;
        const [result] = await connection.execute<ResultSetHeader>(query, [idRecurso, idNombre]);
        
        return result.insertId;

    } catch (error) {
        console.error('Error adding resource:', error);
    }finally {
        connection.release();
    }

}

export const insertCategoria = async (nombre: string, descripcion:string, superior:string,) => {
    const connection = await db.getConnection();
    try {

        const query = `INSERT INTO Categoria (idNombre, descripcion, categoriaSuperior) VALUES ('${nombre}','${descripcion}', '${superior}')`;
        const [result] = await connection.execute<ResultSetHeader>(query, [nombre, descripcion,superior]);
        
        return nombre;
    } catch (error) {
        const errorDuplicate: MyErrorEvent = {
                code: 11062,
                message: ER_DUP_ENTRY
                
        };
        throw errorDuplicate
        }finally {
        connection.release();
    }
    }

    export const insertCategoriaRol = async (categoria:string, rol:string) => {
        const connection = await db.getConnection();
        try {
    
            const query = `INSERT INTO Categoria_rol (idCategoria, idRol) VALUES ('${categoria}','${rol}')`;
            const [result] = await connection.execute<ResultSetHeader>(query, [categoria, rol]);
            
            return result;
        } catch (error) {
            const errorDuplicate: MyErrorEvent = {
                    code: 11062,
                    message: ER_DUP_ENTRY
                    
            };
            throw errorDuplicate
            }finally {
            connection.release();
        }
        }

    export const insertUsuario = async (id:string, username:string,password:string) => {
        const connection = await db.getConnection();
        try {
            
            const query = `INSERT INTO user (id, username, password) VALUES ('${id}','${username}', '${password}')`;
            const [result] = await connection.execute<ResultSetHeader>(query, [id, username, password]);
            
            return result;
        } catch (error) {
            const errorDuplicate: MyErrorEvent = {
                code: 11062,
                message: ER_DUP_ENTRY
                
        };
        throw errorDuplicate
    }finally {
        connection.release();
    }
}

export const insertAdmin = async (id:string, username:string,password:string, admin:1) => {
    const connection = await db.getConnection();
    try {
        
        const query = `INSERT INTO user (id, username, password, admin) VALUES ('${id}','${username}', '${password}', '${admin}')`;
        const [result] = await connection.execute<ResultSetHeader>(query, [id, username, password]);
        
        return result;
    } catch (error) {
        const errorDuplicate: MyErrorEvent = {
            code: 11062,
            message: ER_DUP_ENTRY
            
    };
    throw errorDuplicate
}finally {
    connection.release();
}
}



export const insertOpinionExterno = async (user: string, idRecurso:number, fecha:String, valoracionGlobal:number, dificultad:number, topTema:string, problematico:number, n_beneficioso:number,
    recomendado:number, tiempo:number, resolutivo:number, problema:string, extra: string
) => {
    const connection = await db.getConnection();
    try {
        const idOpinion = generateId(10);
        const query = `INSERT INTO Opinion_externo (idOpinion, user,idRecurso, fecha, valoracion, dificultad, 
        topTema, problematico, n_beneficioso, recomendado, tiempoNecesario, resolutivo, problema, extra) 
        VALUES ('${idOpinion}','${user}', '${idRecurso}','${fecha}','${valoracionGlobal}', '${dificultad}', '${topTema}','${problematico}', '${n_beneficioso}', 
        '${recomendado}', '${tiempo}','${resolutivo}', '${problema}', '${extra}')`;
        const [result] = await connection.execute<ResultSetHeader>(query, [idOpinion, user, idRecurso, fecha, valoracionGlobal, dificultad, topTema, problematico, n_beneficioso,
            recomendado, tiempo, resolutivo, problema, extra
        ]);
        
        return result;
    } catch (error){
        console.log(error)
        throw new ProblemaBD('Fallo en insertar la opinion')
}finally {
    connection.release();
}
}
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  GET FROM BD %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export const getCategoriasDeXroadmapSegunZrol= async(roadmap:string, rol:string)=>{
    const connection = await db.getConnection();

    try{
        const query = `SELECT * FROM Categoria JOIN Roadmap_categoria ON Categoria.idNombre=Roadmap_categoria.componenteCategoria
        WHERE Roadmap_categoria.idRoadmap = '${roadmap}' 
        AND Categoria.idNombre IN (
            SELECT idCategoria
            FROM Categoria_rol 
            WHERE Categoria_rol.idRol='${rol}'
        ) `;
        const [rows] = await connection.execute<ICategoria[]>(query,[roadmap, rol])
        console.log('Metodo de la clase de consultas X roadmap rol Y prueba')
        console.log(rows)
        return rows;

    }catch(error) {
        console.log('Error al obtener user', error)
    }finally{
        connection.release();
    }
}

export const getUsuario = async(username:string)=>{
    const connection = await db.getConnection();

    try{
        const query = `SELECT * FROM user 
        WHERE user.username='${username}'`
        const [rows]= await connection.execute<User[]>(query,[username])
        return rows[0] || [];
    }catch(error) {
        console.log('Error al obtener user', error)
    }finally{
        connection.release();
    }

}


//Obtener los recursos según categoría
export const getResourcesByCategory = async (categoria: string) => {
    const connection = await db.getConnection();
    try {
        
        const query = `SELECT * FROM Recurso_categoria 
            INNER JOIN Recurso ON Recurso_categoria.idRecurso = Recurso.idRecurso 
            WHERE Recurso_categoria.idNombre = '${categoria}'`;
        const [rows] = await connection.execute<IRecurso[]>(query, [categoria]);
        
        return rows || [];
    } catch (error) {
        console.error('Error getting resources by category:', error);
    }finally {
        connection.release();
    }
}


export const getRecursoById = async (idRecurso: number) => {
    const connection = await db.getConnection();
    try {
        
        const query = `SELECT * FROM Recurso WHERE idRecurso = '${idRecurso}'`;
        const [rows] = await connection.execute<IRecurso[]>(query, [idRecurso]);
        
        return rows[0];
    } catch (error) {
        console.error('Error getting resource:', error);
    }finally {
        connection.release();
    }

}

export const getRecursoIdByTitle = async (title: string) => {
    const connection = await db.getConnection();
    try {
        
        const query = `SELECT idRecurso FROM Recurso WHERE titulo = '${title}'`;
        const [rows] = await connection.execute<IRecurso[]>(query, [title]);
        
        return rows[0].idRecurso;
    } catch (error) {
        console.error('Error getting resource:', error);
    }finally {
        connection.release();
    }

}

export const getRecursoSegunTitulo = async (title: string) => {
    const connection = await db.getConnection();
    try {
        
        const query = `SELECT idRecurso FROM Recurso WHERE titulo = '${title}'`;
        const [rows] = await connection.execute<IRecurso[]>(query, [title]);
        
        return rows[0];
    } catch (error) {
        console.error('Error getting resource:', error);
    }finally {
        connection.release();
    }

}

export const getAllRecursos = async () => {
    const connection = await db.getConnection();
    try {
        
        const query = `SELECT * FROM Recurso`;
        const [rows] = await connection.execute<IRecurso[]>(query);
        
        return rows || [];
    } catch (error) {
        console.error('Error getting resources:', error);
    }finally {
        connection.release();
    }


}
export const getResourcesByDificultad = async (dificultad: string) => {
    const connection = await db.getConnection();
    try {
        
        const query = `SELECT * FROM Recurso WHERE n_Dificultad = '${dificultad}'`;
        const [rows] = await connection.execute<IRecurso[]>(query, [dificultad]);
        
        
        return rows || [];
    } catch (error) {
        console.error('Error getting resources by dificultad:', error);
    }finally {
        connection.release();
    }
}

export const getResourcesByTipo = async (tipo: string) => {
    const connection = await db.getConnection();
    try {
        
        const query = `SELECT * FROM Recurso WHERE Tipo = '${tipo}'`;
        const [rows] = await connection.execute<IRecurso[]>(query, [tipo]);
        
        
        return rows || [];
    } catch (error) {
        console.error('Error getting resources by tipo:', error);
    }finally {
        connection.release();
    }
}

/**
 * Este método compronda los markdowns
 * @param categoria 
 * Devolverá el primer resultado de la consulta
 */
export const getCategoriaInformacionRoadmap = async (categoria:string) => {
    const connection = await db.getConnection();
    try {
        
        const query = `SELECT * FROM Categoria WHERE idNombre = '${categoria}'`;
        const [rows] = await connection.execute<ICategoria[]>(query, [categoria]);
        
        return rows[0];
    } catch (error) {
        console.error('Error getting categoria:', error);
    }finally {
        connection.release();
    }
}

export const getAllCategorias = async () => {
    const connection = await db.getConnection();
    try {
        
        const query = `SELECT * FROM Categoria`;
        const [rows] = await connection.execute<ICategoria[]>(query);
        
        return rows || [];
    } catch (error) {
        console.error('Error getting categoria:', error);
    }finally {
        connection.release();
    }
}


export const getComponentesCategoriaPrimerNivel = async (roadmap: string) => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT * FROM Roadmap_categoria INNER JOIN Categoria ON componenteCategoria=idNombre WHERE idRoadmap = '${roadmap}'
        AND Categoria.categoriaSuperior='Global' ORDER BY prioridad ASC`;
        const [rows] = await connection.execute<IRoadmapComponentePrioridad[]>(query, [roadmap]);

        return rows || [];
    } catch (error) {
        console.error('Error getting categoria:', error);
    }finally {
        connection.release();
    }
}

export const getCategoriaPrimerNivelGENERAL = async() =>{
    const connection = await db.getConnection();
    try {
        
        const query = `SELECT * FROM Categoria WHERE Categoria.categoriaSuperior='Global' ORDER BY idNombre ASC`;
        const [rows] = await connection.execute<ICategoria[]>(query);
        
        return rows || [];
    } catch (error) {
        console.error('Error getting categoria:', error);
    }finally {
        connection.release();
    }
}

export const getComponentesCategoriaSegundoNivel = async (roadmap: string) => {
    const connection = await db.getConnection();
    try {
        const query = `SELECT Roadmap_categoria.componenteCategoria, Categoria.categoriaSuperior
        FROM Roadmap_categoria
        JOIN Categoria
        ON Roadmap_categoria.componenteCategoria = Categoria.idNombre
        WHERE Roadmap_categoria.idRoadmap = '${roadmap}'
        AND Categoria.categoriaSuperior IN (
            SELECT idNombre
            FROM Categoria
            WHERE Categoria.categoriaSuperior = 'Global'
        )
        ORDER BY prioridad ASC;`;
        const [rows] = await connection.execute<ICategoriaSubNivel[]>(query, [roadmap]);
        console.log(rows)

        return rows || [];
    } catch (error) {
        console.error('Error getting categoria:', error);
    }finally {
        connection.release();
    }
}


export const getCategoriaSegundoNivelGENERAL = async() =>{
    const connection = await db.getConnection();
    try {
        
        const query = `SELECT * FROM Categoria WHERE Categoria.categoriaSuperior IN (
            SELECT idNombre 
            FROM Categoria 
            WHERE Categoria.categoriaSuperior = 'Global'
        ) 
        ORDER BY idNombre ASC;`;
        const [rows] = await connection.execute<ICategoria[]>(query);
        
        return rows || [];
    } catch (error) {
        console.error('Error getting categoria:', error);
    }finally {
        connection.release();
    }
}

export const getComponentesCategoriaTercerNivel = async (roadmap:string, padre:string)=>{
    const connection = await db.getConnection();
    try {
        const query =  `SELECT  Roadmap_categoria.componenteCategoria, Categoria.categoriaSuperior
        FROM Roadmap_categoria  JOIN Categoria
        ON Roadmap_categoria.componenteCategoria = Categoria.idNombre
        WHERE Roadmap_categoria.idRoadmap = '${roadmap}'
        AND Categoria.categoriaSuperior IN (
            SELECT idNombre
            FROM Categoria
            WHERE Categoria.categoriaSuperior = '${padre}'
        )
        ORDER BY prioridad ASC;`;
        const [rows] = await connection.execute<ICategoriaSubNivel[]>(query, [roadmap, padre]);
        console.log(rows)
        return rows || [];
    } catch (error) {
        console.error('Error getting categoria:', error);
    }finally {
        connection.release();
    }
}

export const getCategoriaTercerNivelGENERAL = async() =>{
    const connection = await db.getConnection();
    try {
        
        const query = `SELECT * FROM Categoria WHERE Categoria.categoriaSuperior IN (
            SELECT idNombre 
            FROM Categoria 
            WHERE Categoria.categoriaSuperior <> 'Global' AND
            Categoria.categoriaSuperior IN ( SELECT idNombre
                FROM Categoria 
                WHERE Categoria.categoriaSuperior = 'Global'
        ) )
        ORDER BY idNombre ASC;`;
        const [rows] = await connection.execute<ICategoria[]>(query);
        
        return rows || [];
    } catch (error) {
        console.error('Error getting categoria:', error);
    }finally {
        connection.release();
    }
}

export const getAllRoles = async () =>{
    const connection = await db.getConnection();
    try {
        
        const query = `SELECT * FROM Rol`;
        const [rows] = await connection.execute<IRol[]>(query);
        
        return rows || [];
    } catch (error) {
        console.error('Error getting roadmap:', error);
    }finally {
        connection.release();
    }

}



export const getRoadmapAlmacenados = async () => {
    const connection = await db.getConnection();
    try {
        
        const query = `SELECT * FROM EsquemaRoadmap`;
        const [rows] = await connection.execute<IRoadmapEsquema[]>(query);
        
        return rows || [];
    } catch (error) {
        console.error('Error getting roadmap:', error);
    }finally {
        connection.release();
    }

}

export const getRoadmapById = async (roadmap: string) => {
    const connection = await db.getConnection();
    try {
        
        const query = `SELECT * FROM EsquemaRoadmap WHERE idRoadmap = '${roadmap}'`;
     
        const [rows] = await connection.execute<IRoadmapEsquema[]>(query, [roadmap]);
        return rows[0];
    } catch (error) {
        console.error('Error getting roadmap:', error);
    }finally {
        connection.release();
    }

}



export const getJsonDeRoadmap = async (roadmap: string) => {
    const connection = await db.getConnection();
    try {
        
        const query = `Select jsonRoadmap FROM EsquemaRoadmap WHERE idRoadmap='${roadmap}'`;
        const [result] = await connection.execute<IRoadmapEsquema[]>(query, [roadmap]);
        
        return result[0];
    } catch (error) {
        console.error('Error obtaining json esquelo', error);
    }finally {
        connection.release();
    }

}


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  UPDATE BD %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export const updateCategoriaNombreDescripcion = async (idNombre: string, nuevoNombre: string, nuevaDescripcion:string) => {
        const connection = await db.getConnection();
        try {
            
            const query = `UPDATE Categoria SET idNombre='${nuevoNombre}', descripcion = '${nuevaDescripcion}' WHERE idNombre = '${idNombre}'`;
            const [result] = await connection.execute<ResultSetHeader>(query, [nuevoNombre, nuevaDescripcion, idNombre]);
            return result.affectedRows;
        } catch (error) {
            console.error('Error updating categoria:', error);
        }finally {
            connection.release();
        }
    }
    

    export const updateRecurso = async (id: number, nuevoTitulo: string, nuevoEnlace: string, nuevaDescripcion:string) => {
        const connection = await db.getConnection();
        try {
            
            const query = `UPDATE Recurso SET titulo='${nuevoTitulo}', enlaceFichero='${nuevoEnlace}',descripcion = '${nuevaDescripcion}' WHERE idRecurso = '${id}'`;
            const [result] = await connection.execute<ResultSetHeader>(query, [nuevoTitulo,nuevoEnlace, nuevaDescripcion, id]);
            return result.affectedRows;
        } catch (error) {
            console.error('Error updating categoria:', error);
        }finally {
            connection.release();
        }
    }
    

    export const updateUserPassWordYRol = async (username:string, password: string, rol:string)=>{
        const connection = await db.getConnection();
            const query = `UPDATE User SET password='${password}', rol='${rol}' WHERE username='${username}'`;
            const [result] = await connection.execute<ResultSetHeader>(query, [password, rol, username]);
            return result.affectedRows;

        

    }


    export const updateUserPassWord = async (username:string,password: string)=>{
        const connection = await db.getConnection();
            const query = `UPDATE User SET password='${password}' WHERE username='${username}'`;
            const [result] = await connection.execute<ResultSetHeader>(query, [password,  username]);
            return result.affectedRows;

    }

    
    export const updateUserRol = async (username:string,rol: string)=>{
        const connection = await db.getConnection();
            const query = `UPDATE user SET  rol='${rol}' WHERE username='${username}'`;
            const [result] = await connection.execute<ResultSetHeader>(query, [ rol, username]);
            return result.affectedRows;


    }

    export const updateUserAdminPoder = async (username:string,admin: number)=>{
        const connection = await db.getConnection();

            const query = `UPDATE user SET admin='${admin}' WHERE username='${username}'`;
            const [result] = await connection.execute<ResultSetHeader>(query, [admin, username]);
            return result.affectedRows;


    }