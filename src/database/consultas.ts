import { type ResultSetHeader } from "mysql2"

import { type IRecurso, db, type IRoadmapEsquema, type ICategoriaSubNivel } from "./dbMySQL";
import { type ICategoria, type IRol, type User } from "./dbMySQL";
import { generateId } from "lucia";
import { type IRoadmapComponentePrioridad } from "./dbMySQL";
import { ER_DUP_ENTRY } from 'mysql-error-keys'
import type { RowDataPacket } from "mysql2";




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



export const insertCategoriaEtiqueta = async (categoria: string, etiqueta: number): Promise<number | undefined> => {
    const connection = await db.getConnection();
    try {
        let query: string;
        let result: ResultSetHeader;


        query = `INSERT INTO categoria_etiqueta (idNombre, idEtiqueta) VALUES (?, ?)`;
        [result] = await connection.execute<ResultSetHeader>(query, [categoria, etiqueta]);


        return result.insertId;
    } catch (error) {
        console.error('Error adding relacion categoria-etiqueta:', error);
    } finally {
        connection.release();
    }
};





export const insertEtiquetaConocimientoBase = async (valorEtiqueta: string) => {
    const connection = await db.getConnection();
    try {
        const query: string = `INSERT INTO etiqueta (tipo, valorEtiqueta) VALUES ('Conocimiento del Roadmap', ?)`;
        const [result] = await connection.execute<ResultSetHeader>(query, [valorEtiqueta]);

        return result.insertId; // Devuelve el ID de la etiqueta insertada
    } catch (error) {
        console.error('Error adding etiqueta Conocimiento Base:', error);
        throw error; // Lanza el error para manejarlo fuera
    } finally {
        connection.release(); // Asegura liberar la conexión
    }
};

export const existsEtiquetaConocimientoBase = async (valorEtiqueta: string): Promise<boolean> => {
    const connection = await db.getConnection();
    try {
        const query: string = `SELECT COUNT(*) as count FROM etiqueta WHERE tipo = 'Conocimiento del Roadmap' AND valorEtiqueta = ?`;
        const [rows] = await connection.execute<RowDataPacket[]>(query, [valorEtiqueta]);
        const count = rows[0].count;
        return count > 0; // Devuelve true si existe al menos una coincidencia
    } catch (error) {
        console.error('Error checking if etiqueta Conocimiento Base exists:', error);
        throw error; // Lanza el error para manejarlo fuera
    } finally {
        connection.release(); // Asegura liberar la conexión
    }
};

export const getEtiquetaId = async (valorEtiqueta: string): Promise<number> => {
    const connection = await db.getConnection();
    try {
        const query = `SELECT idEtiqueta FROM etiqueta WHERE tipo = 'Conocimiento del Roadmap' AND valorEtiqueta = ?`;
        const [rows] = await connection.execute<RowDataPacket[]>(query, [valorEtiqueta]);
        return rows[0]?.idEtiqueta || null; // Devuelve el idEtiqueta o null si no existe
    } catch (error) {
        console.error('Error al obtener el idEtiqueta:', error);
        throw error;
    } finally {
        connection.release();
    }
};



export const insertEsquemaRoadmapEtiqueta = async (idEsquema: string, idEtiqueta: number) => {
    const connection = await db.getConnection();
    try {
        const query: string = `INSERT INTO esquemaroadmap_etiqueta (idEsquema, idEtiqueta) VALUES (?, ?)`;
        const [result] = await connection.execute<ResultSetHeader>(query, [idEsquema, idEtiqueta]);

        return result.insertId; // Devuelve el ID generado si corresponde
    } catch (error) {
        console.error('Error adding esquema-roadmap-etiqueta relation:', error);
        throw error; // Lanza el error para manejarlo fuera
    } finally {
        connection.release(); // Asegura liberar la conexión
    }
};

/*
export const getRoadmapsByEtiqueta = async (valorEtiqueta: string) => {
    const connection = await db.getConnection();
    try {
        const query = `
            SELECT er.idRoadmap
            FROM esquemaroadmap er
            INNER JOIN esquemaroadmap_etiqueta ere ON er.idRoadmap = ere.idEsquema
            INNER JOIN etiqueta e ON ere.idEtiqueta = e.idEtiqueta
            WHERE e.tipo = 'Conocimiento Base' AND e.valorEtiqueta = ?;
        `;
        const [rows] = await connection.execute(query, [valorEtiqueta]);
        return rows; // Devuelve los roadmaps encontrados
    } catch (error) {
        console.error('Error fetching roadmaps by etiqueta:', error);
        throw error; // Maneja el error en el nivel superior
    } finally {
        connection.release();
    }
};
*/

export const getElementoReutilizable = async (valorEtiqueta: string) => {
    const connection = await db.getConnection(); // Obtener la conexión a la base de datos
    try {
        const query = `
            SELECT er.idRoadmap
            FROM elementoreutilizable er
            INNER JOIN etiqueta e ON er.etiqueta = e.idEtiqueta
            WHERE e.tipo = 'Conocimiento del Roadmap' AND e.valorEtiqueta = ?;
        `;
        const [rows] = await connection.execute(query, [valorEtiqueta]);
        return rows; // Devuelve los resultados encontrados
    } catch (error) {
        console.error("Error fetching idRoadmap by conocimiento base:", error);
        throw error; // Maneja el error en el nivel superior
    } finally {
        connection.release(); // Liberar la conexión a la base de datos
    }
};






export const insertRelacionRoadmapCategoria = async (roadmap: string, categoria: string, prioridad?: number) => {
    const connection = await db.getConnection();
    try {
        let query: string;
        let result: ResultSetHeader; // Change the type annotation to ResultSetHeader
        if (prioridad) {
            query = `INSERT INTO roadmap_categoria (idRoadmap, componenteCategoria, prioridad) VALUES ('${roadmap}', '${categoria}', '${prioridad}')`;
            [result] = await connection.execute<ResultSetHeader>(query, [roadmap, categoria, prioridad]);
        } else {
            query = `INSERT INTO roadmap_categoria  (idRoadmap, componenteCategoria) VALUES ('${roadmap}', '${categoria}')`;
            [result] = await connection.execute<ResultSetHeader>(query, [roadmap, categoria]);
        }

        return result.insertId;
    } catch (error) {
        console.error('Error adding relacion roadmap-categoria:', error);
    } finally {
        connection.release();
    }
}

export const insertNuevoRoadmap = async (
    roadmap: string,
    descripcion: string,
    relatedRoadmap: string | null
): Promise<number | null> => {
    const connection = await db.getConnection();
    try {
        const query = `
            INSERT INTO esquemaroadmap (idRoadmap, description, relatedRoadmap)
            VALUES (?, ?, ?)
        `;
        const [result]: any = await connection.execute(query, [
            roadmap,
            descripcion,
            relatedRoadmap,
        ]);
        console.log("Roadmap insertado correctamente:", roadmap);
        console.log("Resultado de la consulta:", result);
        return result.insertId || null;
    } catch (error) {
        console.error("Error al insertar el nuevo roadmap:", error instanceof Error ? error.message : error);
        throw error;
    } finally {
        connection.release();
    }
};




export const insertElementoReutilizable = async (idDelRoadmap: string, idEtiqueta: number) => {
    const connection = await db.getConnection();
    try {
        // Verificar si el idDelRoadmap existe en la tabla EsquemaRoadmap
        const [existingRoadmap] = await connection.query(
            `SELECT idRoadmap FROM esquemaroadmap WHERE idRoadmap = ?`,
            [idDelRoadmap]
        );
        if (!existingRoadmap || !Array.isArray(existingRoadmap) || existingRoadmap.length === 0) {
            throw new Error(`El idRoadmap '${idDelRoadmap}' no existe en la tabla EsquemaRoadmap.`);
        }

        // Verificar si el idEtiqueta existe en la tabla Etiqueta
        const [existingEtiqueta] = await connection.query(
            `SELECT idEtiqueta FROM etiqueta WHERE idEtiqueta = ?`,
            [idEtiqueta]
        );
        if (!existingEtiqueta || !Array.isArray(existingEtiqueta) || existingEtiqueta.length === 0) {
            throw new Error(`El idEtiqueta '${idEtiqueta}' no existe en la tabla Etiqueta.`);
        }

        // Insertar el nuevo elemento reutilizable
        const query = `INSERT INTO elementoreutilizable (idRoadmap, etiqueta) VALUES (?, ?)`;
        const [result] = await connection.execute<ResultSetHeader>(query, [idDelRoadmap, idEtiqueta]);

        // Recuperar el idElementoReutilizable insertado
        const idElementoReutilizable = result.insertId;

        return idElementoReutilizable; // Devuelve el ID del nuevo registro
    } catch (error) {
        console.error('Error al insertar un nuevo elemento reutilizable:', error);
        throw error; // Propagar el error para manejarlo en el cliente
    } finally {
        connection.release(); // Liberar la conexión
    }
};


export async function insertStep(
    numeroStep: string,
    idRoadmap: string,
    idCategoria: string | null,
    idElemento: string | null
): Promise<void> {
    const connection = await db.getConnection();

    try {
        // Validación lógica: Un Step debe ser o una categoría o un elemento reutilizable, no ambos.
        if ((idCategoria && idElemento) || (!idCategoria && !idElemento)) {
            throw new Error(
                "Un Step debe ser o una categoría o un elemento reutilizable, no ambos ni ninguno."
            );
        }

        const safeNumeroStep = numeroStep ?? null;
        const safeIdRoadmap = idRoadmap ?? null;
        const safeIdCategoria = idCategoria ?? null;
        const safeIdElemento = idElemento ?? null;

        const query = `
            INSERT INTO step (numeroStep, idRoadmap, idCategoria, idElemento)
            VALUES (?, ?, ?, ?)
        `;
        await connection.execute(query, [safeNumeroStep, safeIdRoadmap, safeIdCategoria, safeIdElemento]);
        console.log(
            `Step insertado: numeroStep=${safeNumeroStep}, idRoadmap=${safeIdRoadmap}, idCategoria=${safeIdCategoria}, idElemento=${safeIdElemento}`
        );
    } catch (error) {
        console.error("Error al insertar el step:", error);
        throw error;
    } finally {
        connection.release();
    }
}








export const insertResource = async (titulo: string, enlaceFichero: string, interno: boolean, descripcion: string | null, n_Dificultad: string | null, tipo: string | null, formato: string | null, idioma: string | null, deInteres: number | null) => {
    const connection = await db.getConnection();
    const internoExterno = interno ? 1 : 0;
    const dificultad = n_Dificultad ? `'${n_Dificultad}'` : null;
    const tipoRecurso = tipo ? `'${tipo}'` : null;
    const formatoRecurso = formato ? `'${formato}'` : null;
    const idiomaRecurso = idioma ? `'${idioma}'` : null;
    const deInteresRecurso = deInteres ? `'${deInteres}'` : null;

    try {

        const query = `INSERT INTO recurso (titulo, enlaceFichero,interno,descripcion,n_dificultad,tipo,formato,idioma,deInteres) VALUES ('${titulo}', '${enlaceFichero}','${internoExterno}','${descripcion}',${dificultad},${tipoRecurso},${formatoRecurso},${idiomaRecurso},${deInteresRecurso})`;
        const [result] = await connection.execute<ResultSetHeader>(query, [titulo, enlaceFichero, internoExterno, descripcion, dificultad, tipoRecurso, formatoRecurso, idiomaRecurso, deInteres]);

        return result.insertId;
    } catch (error) {
        const errorDuplicate: MyErrorEvent = {
            code: 11062,
            message: ER_DUP_ENTRY

        };
        throw errorDuplicate
    } finally {
        connection.release();
    }

}


export const insertRelacionRecursoCategoria = async (idRecurso: number, idNombre: string) => {
    const connection = await db.getConnection();
    try {

        const query = `INSERT INTO recurso_categoria (idRecurso, idNombre) VALUES ('${idRecurso}', '${idNombre}')`;
        const [result] = await connection.execute<ResultSetHeader>(query, [idRecurso, idNombre]);

        return result.insertId;

    } catch (error) {
        console.error('Error adding resource:', error);
    } finally {
        connection.release();
    }

}

export const insertCategoria = async (nombre: string, descripcion: string, superior: string,) => {
    const connection = await db.getConnection();
    try {

        const query = `INSERT INTO categoria (idNombre, descripcion, categoriaSuperior) VALUES ('${nombre}','${descripcion}', '${superior}')`;
        const [result] = await connection.execute<ResultSetHeader>(query, [nombre, descripcion, superior]);

        return nombre;
    } catch (error) {
        const errorDuplicate: MyErrorEvent = {
            code: 11062,
            message: ER_DUP_ENTRY

        };
        throw errorDuplicate
    } finally {
        connection.release();
    }
}

export const insertCategoriaRol = async (categoria: string, rol: string) => {
    const connection = await db.getConnection();
    try {

        const query = `INSERT INTO categoria_rol (idCategoria, idRol) VALUES ('${categoria}','${rol}')`;
        const [result] = await connection.execute<ResultSetHeader>(query, [categoria, rol]);

        return result;
    } catch (error) {
        const errorDuplicate: MyErrorEvent = {
            code: 11062,
            message: ER_DUP_ENTRY

        };
        throw errorDuplicate
    } finally {
        connection.release();
    }
}

export const insertUsuario = async (id: string, username: string, password: string) => {
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
    } finally {
        connection.release();
    }
}

export const insertAdmin = async (id: string, username: string, password: string, admin: 1) => {
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
    } finally {
        connection.release();
    }
}

export const insertMentor = async (id: string, username: string, password: string, mentor: 1) => {
    const connection = await db.getConnection();
    try {
        const query = `INSERT INTO user (id, username, password, mentor) VALUES ('${id}', '${username}', '${password}', '${mentor}')`;
        const [result] = await connection.execute<ResultSetHeader>(query, [id, username, password, mentor]);

        return result;
    } catch (error) {
        const errorDuplicate: MyErrorEvent = {
            code: 11062,
            message: "ER_DUP_ENTRY",
        };
        throw errorDuplicate;
    } finally {
        connection.release();
    }
};




export const insertOpinionExterno = async (user: string, idRecurso: number, fecha: String, valoracionGlobal: number, dificultad: number, topTema: string, problematico: number, n_beneficioso: number,
    recomendado: number, tiempo: number, resolutivo: number, problema: string, extra: string
) => {
    const connection = await db.getConnection();
    try {
        const idOpinion = generateId(10);
        const query = `INSERT INTO opinion_externo (idOpinion, user,idRecurso, fecha, valoracion, dificultad, 
        topTema, problematico, n_beneficioso, recomendado, tiempoNecesario, resolutivo, problema, extra) 
        VALUES ('${idOpinion}','${user}', '${idRecurso}','${fecha}','${valoracionGlobal}', '${dificultad}', '${topTema}','${problematico}', '${n_beneficioso}', 
        '${recomendado}', '${tiempo}','${resolutivo}', '${problema}', '${extra}')`;
        const [result] = await connection.execute<ResultSetHeader>(query, [idOpinion, user, idRecurso, fecha, valoracionGlobal, dificultad, topTema, problematico, n_beneficioso,
            recomendado, tiempo, resolutivo, problema, extra
        ]);

        return result;
    } catch (error) {
        console.log(error)
        throw new ProblemaBD('Fallo en insertar la opinion')
    } finally {
        connection.release();
    }
}

export const insertEtiqueta = async (tipo: string, valor: string) => {
    const connection = await db.getConnection();

    try {
        // Verificar si la etiqueta ya existe
        const checkQuery = `SELECT COUNT(*) AS count FROM etiqueta WHERE tipo = '${tipo}' AND valorEtiqueta = '${valor}'`;
        const [rows]: any = await connection.execute(checkQuery);

        if (rows[0].count > 0) {
            throw new Error("Etiqueta duplicada");
        }

        // Insertar la etiqueta si no es duplicada
        const query = `INSERT INTO etiqueta (tipo, valorEtiqueta) VALUES ('${tipo}', '${valor}')`;
        const [result]: any = await connection.execute(query);

        return result.insertId;
    } catch (error) {
        console.error("Error al insertar la etiqueta:", error);
        throw error;
    } finally {
        connection.release();
    }
};

export const assignRoadmap = async (
    idRoadmap: string,
    usernameNewcomer: string,
    idMentor: string
) => {
    const connection = await db.getConnection();
    try {
        const query = `
            INSERT INTO roadmapasignado 
            (idRoadmap, idNewcomer, idMentor, fechaAsignado, porcentajeCompletado, stepActual)
            VALUES (?, ?, ?, NOW(), 0.00, 1)
        `;
        const [result] = await connection.execute(query, [
            idRoadmap,
            usernameNewcomer,
            idMentor,
        ]);

        console.log("Resultado de la consulta:", result); // Para depuración
        return result; // Devuelve el resultado
    } catch (error) {
        console.error("Error al asignar el roadmap:", error);
        throw error;
    } finally {
        connection.release();
    }
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  GET FROM BD %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getEtiquetaIdPorTipoYValor = async (tipo: string, valorEtiqueta: number) => {
    const connection = await db.getConnection();
    try {
        const query = `SELECT idEtiqueta FROM etiqueta WHERE CONCAT(tipo, ': ', valorEtiqueta) = ?`;
        const [rows] = await connection.execute(query, [`${tipo}: ${valorEtiqueta}`]);

        console.log('Resultado de la consulta:', rows); // Depuración

        if (Array.isArray(rows) && rows.length > 0) {
            const result = rows[0];
            console.log('Primer resultado:', result); // Verificar contenido del primer elemento

            if (result && 'idEtiqueta' in result) {
                return result.idEtiqueta; // Retornar idEtiqueta si existe
            } else {
                console.error('La propiedad idEtiqueta no se encuentra en el resultado.');
                return null;
            }
        } else {
            console.warn('La consulta no devolvió resultados.');
            return null;
        }
    } catch (error) {
        console.error('Error obteniendo idEtiqueta por tipo y valor:', error);
        return null;
    } finally {
        connection.release();
    }
};



export const getEtiquetasByRoadmapId = async (idRoadmap: string) => {
    const connection = await db.getConnection();

    try {
        const query = `
            SELECT e.valorEtiqueta, e.tipo
            FROM esquemaroadmap er
            JOIN esquemaroadmap_etiqueta ere ON er.idRoadmap = ere.idEsquema
            JOIN etiqueta e ON ere.idEtiqueta = e.idEtiqueta
            WHERE er.idRoadmap = ?
        `;

        // Ejecutar la consulta
        const [rows] = await connection.execute(query, [idRoadmap]);
        console.log("Resultado de la consulta:", rows);

        // Validar que rows no esté vacío
        if (!Array.isArray(rows) || rows.length === 0) {
            console.log(`No se encontraron etiquetas para el roadmap con ID: ${idRoadmap}`);
            return null;
        }

        console.log(`Etiquetas encontradas: ${JSON.stringify(rows)}`);
        return rows; // Retorna las etiquetas encontradas

    } catch (error) {
        console.error('Error al obtener las etiquetas del roadmap:', error);
        throw error;
    } finally {
        // Liberar la conexión a la base de datos
        connection.release();
    }
};


export async function getMaxVersionByRoadmap(idRoadmap: string) {
    const query = `
        SELECT 
            MAX(version) AS max_version
        FROM 
            esquemaroadmap
        WHERE 
            idRoadmap = ?; -- Usa correctamente el marcador de posición
    `;

    let connection;
    try {
        // Obtener conexión con la base de datos
        connection = await db.getConnection();

        // Ejecutar la consulta con el parámetro idRoadmap
        const [rows]: any = await connection.execute(query, [idRoadmap]);

        // Verificar si hay resultados
        if (rows.length === 0) {
            throw new Error(`No se encontró ningún roadmap con idRoadmap: ${idRoadmap}`);
        }

        // Retornar el resultado
        return rows[0]?.max_version || null; // Devuelve la versión máxima o null si no hay datos
    } catch (error) {
        console.error(`Error en getMaxVersionByRoadmap para idRoadmap: ${idRoadmap}`, error);
        throw error; // Re-lanzar el error para manejarlo en el nivel superior
    } finally {
        // Liberar la conexión
        if (connection) {
            connection.release();
        }
    }
}


export const getUserIdByUsername = async (username: string) => {
    const connection = await db.getConnection();

    try {
        const query = `
            SELECT id
            FROM user
            WHERE username = ?
        `;

        // Ejecutar la consulta
        const [rows] = await connection.execute(query, [username]);
        console.log("Resultado de la consulta:", rows);

        // Validar que rows no esté vacío
        if (!Array.isArray(rows) || rows.length === 0) {
            console.log(`No se encontró ningún usuario con el username: ${username}`);
            return null;
        }

        console.log(`Usuario encontrado: ${JSON.stringify(rows[0])}`);
        return rows[0]; // Retorna el primer resultado de la consulta

    } catch (error) {
        console.error('Error al obtener el ID del usuario por username:', error);
        throw error;
    } finally {
        // Liberar la conexión a la base de datos
        connection.release();
    }
};


export const getUltimaVersionRoadmap = async (roadmapId: string) => {
    const connection = await db.getConnection();

    try {
        const query = `
            SELECT MAX(version) as version
            FROM esquemaroadmap
            WHERE idRoadmap = ?
        `;

        // Ejecutar la consulta
        const [rows] = await connection.execute(query, [roadmapId]);

        // Asegurar que `rows` tiene el formato esperado
        if (Array.isArray(rows) && rows.length > 0) {
            const version = rows[0] || 0; // Obtener la versión o 0
            return version;
        }

        // Si no hay filas, devolver 0
        return 0;

    } catch (error) {
        console.error('Error al obtener la última versión del roadmap:', error);
        return 0;  // Devolver 0 en caso de error
    } finally {
        connection.release();  // Liberar la conexión
    }
};



/*
export const getCategoriasDeRoadmap = async (roadmap: string) => {
    const connection = await db.getConnection();

    try {
        const query = `
            SELECT DISTINCT Categoria.idNombre, Categoria.nombre
            FROM Categoria
            JOIN Roadmap_categoria ON Categoria.idNombre = Roadmap_categoria.componenteCategoria
            WHERE Roadmap_categoria.idRoadmap = ?
        `;

        const [rows] = await connection.execute<ICategoria[]>(query, [roadmap]);
        console.log('Categorias asociadas al roadmap:', rows);
        return rows;

    } catch (error) {
        console.error('Error al obtener las categorías del roadmap:', error);
        throw error;
    } finally {
        connection.release();
    }
};
*/

export const getRoadmapsAsignadosByMentor = async (idMentor: string) => {
    const connection = await db.getConnection();
    try {
        console.log("Iniciando consulta para roadmaps asignados del mentor:", idMentor);

        const query = `
            SELECT 
                ra.idRoadmapAsignado,
                ra.idRoadmap,
                er.idRoadmap AS nombreRoadmap,
                ra.idNewcomer,
                ra.fechaAsignado,
                ra.fechaCompletado,
                ra.porcentajeCompletado,
                ra.stepActual,
                ra.fechaUltimoAcceso
            FROM 
                roadmapasignado ra
            JOIN 
                esquemaroadmap er ON ra.idRoadmap = er.idRoadmap
            WHERE 
                ra.idMentor = ?;
        `;
        const [rows] = await connection.execute(query, [idMentor]);

        console.log("Resultados de la consulta para mentor:", rows);
        return rows;
    } catch (error) {
        console.error("Error en la consulta SQL para mentor:", error);
        throw error;
    } finally {
        connection.release();
    }
};



export const getRoadmapsAsignadosNewcomer = async (idNewcomer: string) => {
    const connection = await db.getConnection();
    try {
        const query = `
            SELECT 
                ra.idRoadmap,
                er.idRoadmap AS nombreRoadmap,
                ra.fechaAsignado,
                ra.fechaCompletado,
                ra.porcentajeCompletado,
                ra.stepActual,
                ra.fechaUltimoAcceso
            FROM 
                roadmapasignado ra
            JOIN 
                esquemaroadmap er ON ra.idRoadmap = er.idRoadmap
            JOIN 
                user u ON ra.idNewcomer = u.username
            WHERE 
                u.id = ?;
        `;
        const [rows] = await connection.execute(query, [idNewcomer]);
        return rows;
    } catch (error) {
        console.error("Error obteniendo roadmaps asignados:", error);
        throw error;
    } finally {
        connection.release();
    }
};




export const getCategoriasDeRoadmap = async (roadmapId: string) => {
    const connection = await db.getConnection();

    try {
        const query = `
            SELECT DISTINCT s.idCategoria
            FROM step s
            JOIN esquemaroadmap er ON s.idRoadmap = er.idRoadmap
            WHERE er.idRoadmap = ?
        `;

        const [rows] = await connection.execute(query, [roadmapId]);
        console.log('Categorías asociadas al roadmap:', rows);
        return rows;

    } catch (error) {
        console.error('Error al obtener las categorías del roadmap:', error);
        throw error;
    } finally {
        connection.release();
    }
};


//jon en aldaketak eta kontsultak 

export const getEtiquetas = async () => {
    const connection = await db.getConnection();
    try {
        const query = `SELECT * FROM etiqueta`;
        const [rows] = await connection.execute(query);

        return rows || [];
    } catch (error) {
        console.error('Error obteniendo todas las etiquetas:', error);
        return [];
    } finally {
        connection.release();
    }
};

export const eliminarEtiqueta = async (valorEtiqueta: string) => {
    if (typeof valorEtiqueta !== 'string') {
        throw new Error(`El valor proporcionado debe ser un string. Tipo recibido: ${typeof valorEtiqueta}`);
    }

    const connection = await db.getConnection();
    try {
        const query = `DELETE FROM Etiqueta WHERE valorEtiqueta = ?`;
        await connection.execute(query, [valorEtiqueta]); // Ejecuta la consulta

        console.log(`Etiqueta con valor "${valorEtiqueta}" eliminada correctamente.`);
    } catch (error) {
        console.error(`Error eliminando la etiqueta con valor "${valorEtiqueta}":`, error);
        throw error;
    } finally {
        connection.release(); // Asegura que la conexión se libere
    }
};






export const getEtiquetasRol = async () => {
    const connection = await db.getConnection();
    try {
        const query = `
            SELECT valorEtiqueta
            FROM etiqueta 
            WHERE tipo = 'rol' 
        `;
        const [rows] = await connection.execute(query);

        return rows || [];
    } catch (error) {
        console.error('Error getting etiquetas de tipo rol:', error);
        return [];
    } finally {
        connection.release();
    }
};




export async function getEtiquetasDificultad() {
    const connection = await db.getConnection();
    try {
        const query = `
            SELECT valorEtiqueta
            FROM etiqueta 
            WHERE tipo = 'Dificultad' ;
        `;
        const [rows] = await connection.execute(query);

        return rows || [];
    } catch (error) {
        console.error('Error getting etiquetas de tipo dificultad:', error);
        return [];
    } finally {
        connection.release();
    }

};

// Consulta para obtener las categorías de nivel 1 según el rol y la dificultad seleccionados

export const categoriasNivel1segunEtiquetas = async (
    roles: string[],
    dificultades: string[]
) => {
    console.log("Roles recibidos:", roles);
    console.log("Dificultades recibidas:", dificultades);

    const connection = await db.getConnection();
    try {
        // Construimos la consulta
        const query = `
            SELECT DISTINCT categoria.*
            FROM categoria
            INNER JOIN categoria_etiqueta AS ce_rol 
                ON categoria.idNombre = ce_rol.idNombre
            INNER JOIN etiqueta AS e_rol 
                ON ce_rol.idEtiqueta = e_rol.idEtiqueta 
                AND e_rol.tipo = 'rol' 
                AND e_rol.valorEtiqueta IN (${roles.map(() => "?").join(",")})
            INNER JOIN categoria_etiqueta AS ce_dif 
                ON categoria.idNombre = ce_dif.idNombre
            INNER JOIN etiqueta AS e_dif 
                ON ce_dif.idEtiqueta = e_dif.idEtiqueta 
                AND e_dif.tipo = 'dificultad' 
                AND e_dif.valorEtiqueta IN (${dificultades.map(() => "?").join(",")})
            WHERE categoria.categoriaSuperior = 'Global'
            ORDER BY categoria.idNombre ASC
        `;

        // Fusionamos los arrays de roles y dificultades para usarlos como parámetros
        const params = [...roles, ...dificultades];

        // Ejecutamos la consulta con los parámetros
        const [rows] = await connection.execute(query, params);

        return rows || [];
    } catch (error) {
        console.error(
            "Error obteniendo categorías según roles y dificultades:",
            error
        );
        return [];
    } finally {
        connection.release();
        console.log("Consulta finalizada");
    }
};
/*
export const categoriasNivel2segunEtiquetas = async (roles: string[], dificultades: string[], categoriasNivel1: string[]) => {
    console.log("Roles recibidos:", roles);
    console.log("Dificultades recibidas:", dificultades);
    console.log("Categorías de nivel 1 recibidas:", categoriasNivel1);

    const connection = await db.getConnection();
    try {
        const query = `
            SELECT DISTINCT categoria.*
            FROM categoria
            INNER JOIN categoria_etiqueta AS ce_rol 
                ON categoria.idNombre = ce_rol.idNombre
            INNER JOIN etiqueta AS e_rol 
                ON ce_rol.idEtiqueta = e_rol.idEtiqueta 
                AND e_rol.tipo = 'rol' 
                AND e_rol.valorEtiqueta IN (${roles.map(() => "?").join(",")})
            INNER JOIN categoria_etiqueta AS ce_dif 
                ON categoria.idNombre = ce_dif.idNombre
            INNER JOIN etiqueta AS e_dif 
                ON ce_dif.idEtiqueta = e_dif.idEtiqueta 
                AND e_dif.tipo = 'dificultad' 
                AND e_dif.valorEtiqueta IN (${dificultades.map(() => "?").join(",")})
            WHERE categoria.categoriaSuperior IN (${categoriasNivel1.map(() => "?").join(",")})
            ORDER BY categoria.idNombre ASC;
        `;

        const params = [...roles, ...dificultades, ...categoriasNivel1];
        console.log("Parámetros utilizados:", params);

        const [rows] = await connection.execute(query, params);

        console.log("Resultados obtenidos:", rows);
        return rows || [];
    } catch (error) {
        console.error("Error obteniendo categorías de nivel 2 según rol, dificultad y nivel 1:", error);
        return [];
    } finally {
        connection.release();
        console.log("Consulta completada");
    }
};
*/
export const categoriasNivel2segunEtiquetas = async (
    roles: string[],
    dificultades: string[],
    categoriaNivel1: string // Una sola categoría de nivel 1
) => {
    console.log("Roles recibidos:", roles);
    console.log("Dificultades recibidas:", dificultades);
    console.log("Categoría de nivel 1 recibida:", categoriaNivel1);

    // Validar que los parámetros no estén vacíos
    if (roles.length === 0 || dificultades.length === 0 || !categoriaNivel1) {
        console.warn("Uno o más parámetros están vacíos. No se puede ejecutar la consulta.");
        return [];
    }

    const connection = await db.getConnection();
    try {
        const query = `
            SELECT DISTINCT categoria.*
            FROM categoria
            INNER JOIN categoria_etiqueta AS ce_rol 
                ON categoria.idNombre = ce_rol.idNombre
            INNER JOIN etiqueta AS e_rol 
                ON ce_rol.idEtiqueta = e_rol.idEtiqueta 
                AND e_rol.tipo = 'rol' 
                AND e_rol.valorEtiqueta IN (${roles.map(() => "?").join(",")})
            INNER JOIN categoria_etiqueta AS ce_dif 
                ON categoria.idNombre = ce_dif.idNombre
            INNER JOIN etiqueta AS e_dif 
                ON ce_dif.idEtiqueta = e_dif.idEtiqueta 
                AND e_dif.tipo = 'dificultad' 
                AND e_dif.valorEtiqueta IN (${dificultades.map(() => "?").join(",")})
            WHERE categoria.categoriaSuperior = ? -- Una sola categoría de nivel 1
            ORDER BY categoria.idNombre ASC;
        `;

        // Parámetros de la consulta
        const params = [...roles, ...dificultades, categoriaNivel1];
        console.log("Parámetros utilizados:", params);

        // Ejecutar la consulta
        const [rows] = await connection.execute(query, params);

        console.log("Resultados obtenidos:", rows);
        return rows || [];
    } catch (error) {
        console.error(
            "Error obteniendo categorías de nivel 2 según rol, dificultad y categoría de nivel 1:",
            error
        );
        throw new Error("Error al obtener las categorías de nivel 2.");
    } finally {
        connection.release();
        console.log("Conexión liberada.");
    }
};
export const categoriasNivel3segunEtiquetas = async (
    roles: string[],
    dificultades: string[],
    categoriaNivel2: string // Una sola categoría de nivel 2
) => {
    console.log("Roles recibidos:", roles);
    console.log("Dificultades recibidas:", dificultades);
    console.log("Categoría de nivel 2 recibida:", categoriaNivel2);

    // Validar que los parámetros no estén vacíos
    if (roles.length === 0 || dificultades.length === 0 || !categoriaNivel2) {
        console.warn("Uno o más parámetros están vacíos. No se puede ejecutar la consulta.");
        return [];
    }

    const connection = await db.getConnection();
    try {
        const query = `
            SELECT DISTINCT categoria.*
            FROM categoria
            INNER JOIN categoria_etiqueta AS ce_rol 
                ON categoria.idNombre = ce_rol.idNombre
            INNER JOIN etiqueta AS e_rol 
                ON ce_rol.idEtiqueta = e_rol.idEtiqueta 
                AND e_rol.tipo = 'rol' 
                AND e_rol.valorEtiqueta IN (${roles.map(() => "?").join(",")})
            INNER JOIN categoria_etiqueta AS ce_dif 
                ON categoria.idNombre = ce_dif.idNombre
            INNER JOIN etiqueta AS e_dif 
                ON ce_dif.idEtiqueta = e_dif.idEtiqueta 
                AND e_dif.tipo = 'dificultad' 
                AND e_dif.valorEtiqueta IN (${dificultades.map(() => "?").join(",")})
            WHERE categoria.categoriaSuperior = ? -- Una sola categoría de nivel 2
            ORDER BY categoria.idNombre ASC;
        `;

        // Parámetros de la consulta
        const params = [...roles, ...dificultades, categoriaNivel2];
        console.log("Parámetros utilizados:", params);

        // Ejecutar la consulta
        const [rows] = await connection.execute(query, params);

        console.log("Resultados obtenidos:", rows);
        return rows || [];
    } catch (error) {
        console.error(
            "Error obteniendo categorías de nivel 3 según rol, dificultad y categoría de nivel 2:",
            error
        );
        throw new Error("Error al obtener las categorías de nivel 3.");
    } finally {
        connection.release();
        console.log("Conexión liberada.");
    }
};

export const categoriasNivel3PorPadre = async (
    categoriaNivel2Padre: string // Una sola categoría de nivel 2
) => {
    console.log("Categoría de nivel 2 recibida:", categoriaNivel2Padre);

    // Validar que el parámetro no esté vacío
    if (!categoriaNivel2Padre) {
        console.warn("El parámetro de categoría de nivel 2 está vacío. No se puede ejecutar la consulta.");
        return [];
    }

    const connection = await db.getConnection();
    try {
        const query = `
            SELECT DISTINCT categoria.*
            FROM categoria
            WHERE categoria.categoriaSuperior = ? -- Una sola categoría de nivel 2
            ORDER BY categoria.idNombre ASC;
        `;

        // Parámetro de la consulta
        const params = [categoriaNivel2Padre];
        console.log("Parámetro utilizado:", params);

        // Ejecutar la consulta
        const [rows] = await connection.execute(query, params);

        console.log("Resultados obtenidos:", rows);
        return rows || [];
    } catch (error) {
        console.error(
            "Error obteniendo categorías de nivel 3 según la categoría padre:",
            error
        );
        throw new Error("Error al obtener las categorías de nivel 3.");
    } finally {
        connection.release();
        console.log("Conexión liberada.");
    }
};


export const categoriasNivel2PorPadre = async (
    categoriaNivel1Padre: string // Una sola categoría de nivel 1
) => {
    console.log("Categoría de nivel 1 recibida:", categoriaNivel1Padre);

    // Validar que el parámetro no esté vacío
    if (!categoriaNivel1Padre) {
        console.warn("El parámetro de categoría de nivel 1 está vacío. No se puede ejecutar la consulta.");
        return [];
    }

    const connection = await db.getConnection();
    try {
        const query = `
            SELECT DISTINCT categoria.*
            FROM categoria
            WHERE categoria.categoriaSuperior = ? -- Una sola categoría de nivel 1
            ORDER BY categoria.idNombre ASC;
        `;

        // Parámetro de la consulta
        const params = [categoriaNivel1Padre];
        console.log("Parámetro utilizado:", params);

        // Ejecutar la consulta
        const [rows] = await connection.execute(query, params);

        console.log("Resultados obtenidos:", rows);
        return rows || [];
    } catch (error) {
        console.error(
            "Error obteniendo categorías de nivel 2 según la categoría padre:",
            error
        );
        throw new Error("Error al obtener las categorías de nivel 2.");
    } finally {
        connection.release();
        console.log("Conexión liberada.");
    }
};






export const getCategoriasDeXroadmapSegunZrol = async (roadmap: string, rol: string) => {
    const connection = await db.getConnection();

    try {
        const query = `SELECT * FROM categoria JOIN roadmap_categoria ON categoria.idNombre=roadmap_categoria.componenteCategoria
        WHERE roadmap_categoria.idRoadmap = '${roadmap}' 
        AND categoria.idNombre IN (
            SELECT idCategoria
            FROM categoria_rol 
            WHERE categoria_rol.idRol='${rol}'
        ) `;
        const [rows] = await connection.execute<ICategoria[]>(query, [roadmap, rol])
        console.log('Metodo de la clase de consultas X roadmap rol Y prueba')
        console.log(rows)
        return rows;

    } catch (error) {
        console.log('Error al obtener user', error)
    } finally {
        connection.release();
    }
}

export const getUsuario = async (username: string) => {
    const connection = await db.getConnection();

    try {
        // Query para obtener el usuario con los campos requeridos
        const query = `
            SELECT id, username, password, admin, mentor 
            FROM user 
            WHERE username = ? LIMIT 1
        `;
        const [rows] = await connection.execute<User[]>(query, [username]);

        if (rows.length > 0) {
            const user = rows[0];
            console.log("Usuario encontrado:", user); // Log para depurar
            return user; // Retorna el usuario encontrado
        }

        console.log("Usuario no encontrado para username:", username);
        return null;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error al obtener usuario:", error.message);
        } else {
            console.error("Error al obtener usuario:", error); // Registrar el objeto completo si no es una instancia de Error
        }
        return null;
    }

};

export const getUsersByRole = async (isMentor: boolean) => {
    const connection = await db.getConnection();
    try {
        // Determina el valor de la columna mentor según el rol solicitado
        const mentorValue = isMentor ? 1 : 0;

        // Construye la consulta
        const query = `
            SELECT id, username 
            FROM user 
            WHERE mentor = '${mentorValue}';
        `;

        const [rows] = await connection.execute(query);

        return rows; // Devuelve los usuarios encontrados
    } catch (error) {
        console.error("Error al obtener usuarios por rol:", error);
        throw error; // Re-lanza el error
    } finally {
        connection.release(); // Asegura liberar la conexión
    }
};


//Obtener los recursos según categoría
export const getResourcesByCategory = async (categoria: string) => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT * FROM recurso_categoria 
            INNER JOIN recurso ON recurso_categoria.idRecurso = recurso.idRecurso 
            WHERE recurso_categoria.idNombre = '${categoria}'`;
        const [rows] = await connection.execute<IRecurso[]>(query, [categoria]);

        return rows || [];
    } catch (error) {
        console.error('Error getting resources by category:', error);
    } finally {
        connection.release();
    }
}


export const getRecursoById = async (idRecurso: number) => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT * FROM recurso WHERE idRecurso = '${idRecurso}'`;
        const [rows] = await connection.execute<IRecurso[]>(query, [idRecurso]);

        return rows[0];
    } catch (error) {
        console.error('Error getting resource:', error);
    } finally {
        connection.release();
    }

}

export const getRecursoIdByTitle = async (title: string) => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT idRecurso FROM recurso WHERE titulo = '${title}'`;
        const [rows] = await connection.execute<IRecurso[]>(query, [title]);

        return rows[0].idRecurso;
    } catch (error) {
        console.error('Error getting resource:', error);
    } finally {
        connection.release();
    }

}

export const getRecursoSegunTitulo = async (title: string) => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT idRecurso FROM recurso WHERE titulo = '${title}'`;
        const [rows] = await connection.execute<IRecurso[]>(query, [title]);

        return rows[0];
    } catch (error) {
        console.error('Error getting resource:', error);
    } finally {
        connection.release();
    }

}

export const getAllRecursos = async () => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT * FROM recurso`;
        const [rows] = await connection.execute<IRecurso[]>(query);

        return rows || [];
    } catch (error) {
        console.error('Error getting resources:', error);
    } finally {
        connection.release();
    }


}
export const getResourcesByDificultad = async (dificultad: string) => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT * FROM recurso WHERE n_Dificultad = '${dificultad}'`;
        const [rows] = await connection.execute<IRecurso[]>(query, [dificultad]);


        return rows || [];
    } catch (error) {
        console.error('Error getting resources by dificultad:', error);
    } finally {
        connection.release();
    }
}

export const getResourcesByTipo = async (tipo: string) => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT * FROM recurso WHERE Tipo = '${tipo}'`;
        const [rows] = await connection.execute<IRecurso[]>(query, [tipo]);


        return rows || [];
    } catch (error) {
        console.error('Error getting resources by tipo:', error);
    } finally {
        connection.release();
    }
}

/**
 * Este método compronda los markdowns
 * @param categoria 
 * Devolverá el primer resultado de la consulta
 */
export const getCategoriaInformacionRoadmap = async (categoria: string) => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT * FROM categoria WHERE idNombre = '${categoria}'`;
        const [rows] = await connection.execute<ICategoria[]>(query, [categoria]);

        return rows[0];
    } catch (error) {
        console.error('Error getting categoria:', error);
    } finally {
        connection.release();
    }
}

export const getAllCategorias = async () => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT * FROM categoria`;
        const [rows] = await connection.execute<ICategoria[]>(query);

        return rows || [];
    } catch (error) {
        console.error('Error getting categoria:', error);
    } finally {
        connection.release();
    }
}

/*
export const getComponentesCategoriaPrimerNivel = async (roadmap: string) => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT * FROM Roadmap_categoria INNER JOIN Categoria ON componenteCategoria=idNombre WHERE idRoadmap = '${roadmap}'
        AND Categoria.categoriaSuperior='Global' ORDER BY prioridad ASC`;
        const [rows] = await connection.execute<IRoadmapComponentePrioridad[]>(query, [roadmap]);

        return rows || [];
    } catch (error) {
        console.error('Error getting categoria:', error);
    } finally {
        connection.release();
    }
}
    */

/*
export const getComponentesCategoriaPrimerNivel = async (roadmap: string) => {
    const connection = await db.getConnection();
    try {
        const query = `
            SELECT 
                s.idRoadmap,
                s.idCategoria AS componenteCategoria
            FROM 
                step s
            JOIN 
                categoria c
            ON 
                s.idCategoria = c.idNombre
            WHERE 
                s.idRoadmap = ?
                AND c.categoriaSuperior = 'global'
            ORDER BY 
                s.numeroStep;
        `;

        const [rows] = await connection.execute<IRoadmapComponentePrioridad[]>(query, [roadmap]);

        return rows || [];
    } catch (error) {
        console.error('Error getting categorias de primer nivel:', error);
        throw error;
    } finally {
        connection.release();
    }
};
*/
export const getComponentesCategoriaPrimerNivel = async (roadmap: string) => {
    const connection = await db.getConnection();
    try {
        // Consulta para categorías directas del roadmap
        const queryDirectCategories = `
            SELECT 
                s.numeroStep AS orden,
                s.idRoadmap,
                s.idCategoria AS componenteCategoria
            FROM 
                step s
            JOIN 
                categoria c
            ON 
                s.idCategoria = c.idNombre
            WHERE 
                s.idRoadmap = ?
                AND c.categoriaSuperior = 'global'
            ORDER BY 
                s.numeroStep;
        `;

        // Consulta para categorías de nivel 1 de los elementos reutilizables
        const queryReusableCategories = `
            SELECT 
                s.numeroStep AS orden, -- El orden del step del elemento reutilizable en el roadmap principal
                sc.idRoadmap,
                sc.idCategoria AS componenteCategoria
            FROM 
                step s
            JOIN 
                step sc
            ON 
                s.idElemento = sc.idRoadmap
            JOIN 
                categoria c
            ON 
                sc.idCategoria = c.idNombre
            WHERE 
                s.idRoadmap = ?
                AND c.categoriaSuperior = 'global'
            ORDER BY 
                s.numeroStep, sc.numeroStep;
        `;

        // Ejecutar ambas consultas
        const [directCategories] = await connection.execute<IRoadmapComponentePrioridad[]>(queryDirectCategories, [roadmap]);
        const [reusableCategories] = await connection.execute<IRoadmapComponentePrioridad[]>(queryReusableCategories, [roadmap]);

        // Combinar resultados y ordenar globalmente por número de step
        const combinedResults = [...directCategories, ...reusableCategories].sort((a, b) => a.orden - b.orden);

        return combinedResults || [];
    } catch (error) {
        console.error('Error getting categorias de primer nivel:', error);
        throw error;
    } finally {
        connection.release();
    }
};

export const getComponentesCategoriaPrimerNivelSoloRoadmap = async (roadmap: string) => {
    const connection = await db.getConnection();
    try {
        // Consulta para categorías directas del roadmap
        const queryDirectCategories = `
            SELECT 
                s.numeroStep AS orden,
                s.idRoadmap,
                s.idCategoria AS componenteCategoria
            FROM 
                step s
            JOIN 
                categoria c
            ON 
                s.idCategoria = c.idNombre
            WHERE 
                s.idRoadmap = ?
                AND c.categoriaSuperior = 'global'
            ORDER BY 
                s.numeroStep;
        `;

        // Ejecutar la consulta
        const [directCategories] = await connection.execute<IRoadmapComponentePrioridad[]>(queryDirectCategories, [roadmap]);

        return directCategories || [];
    } catch (error) {
        console.error('Error getting direct categorias de primer nivel:', error);
        throw error;
    } finally {
        connection.release();
    }
};




export const getCategoriaPrimerNivelGENERAL = async () => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT * FROM categoria WHERE Categoria.categoriaSuperior='Global' ORDER BY idNombre ASC`;
        const [rows] = await connection.execute<ICategoria[]>(query);

        return rows || [];
    } catch (error) {
        console.error('Error getting categoria:', error);
    } finally {
        connection.release();
    }
}

/*
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
    } finally {
        connection.release();
    }
}
    */
/*

export const getComponentesCategoriaSegundoNivel = async (roadmap: string) => {
 const connection = await db.getConnection();
 try {
     const query = `
         SELECT 
             s.idCategoria AS componenteCategoria,
             c.categoriaSuperior
         FROM 
             step s
         JOIN 
             categoria c
         ON 
             s.idCategoria = c.idNombre
         WHERE 
             s.idRoadmap = ?
             AND c.categoriaSuperior IN (
                 SELECT idNombre
                 FROM categoria
                 WHERE categoriaSuperior = 'global'
             )
             AND c.categoriaSuperior != 'global';
     `;

     const [rows] = await connection.execute<ICategoriaSubNivel[]>(query, [roadmap]);

     console.log('Categorias de segundo nivel:', rows);

     return rows || [];
 } catch (error) {
     console.error('Error getting categorias de segundo nivel:', error);
     throw error;
 } finally {
     connection.release();
 }
};

*/

export const getComponentesCategoriaSegundoNivel = async (roadmap: string) => {
    const connection = await db.getConnection();
    try {
        // Consulta para categorías de segundo nivel directamente asociadas al roadmap
        const queryDirectCategories = `
            SELECT 
                s.idCategoria AS componenteCategoria,
                c.categoriaSuperior,
                s.numeroStep AS orden
            FROM 
                step s
            JOIN 
                categoria c
            ON 
                s.idCategoria = c.idNombre
            WHERE 
                s.idRoadmap = ?
                AND c.categoriaSuperior IN (
                    SELECT idNombre
                    FROM categoria
                    WHERE categoriaSuperior = 'global'
                )
                AND c.categoriaSuperior != 'global';
        `;

        // Consulta para categorías de segundo nivel de los elementos reutilizables
        const queryReusableCategories = `
            SELECT 
                sc.idCategoria AS componenteCategoria,
                c.categoriaSuperior,
                s.numeroStep AS orden
            FROM 
                step s
            JOIN 
                step sc
            ON 
                s.idElemento = sc.idRoadmap
            JOIN 
                categoria c
            ON 
                sc.idCategoria = c.idNombre
            WHERE 
                s.idRoadmap = ?
                AND c.categoriaSuperior IN (
                    SELECT idNombre
                    FROM categoria
                    WHERE categoriaSuperior = 'global'
                )
                AND c.categoriaSuperior != 'global';
        `;

        // Ejecutar ambas consultas
        const [directCategories] = await connection.execute<ICategoriaSubNivel[]>(queryDirectCategories, [roadmap]);
        const [reusableCategories] = await connection.execute<ICategoriaSubNivel[]>(queryReusableCategories, [roadmap]);

        // Combinar los resultados y ordenar globalmente por número de step
        const combinedResults = [...directCategories, ...reusableCategories].sort((a, b) => a.orden - b.orden);

        console.log('Categorias de segundo nivel:', combinedResults);

        return combinedResults || [];
    } catch (error) {
        console.error('Error getting categorias de segundo nivel:', error);
        throw error;
    } finally {
        connection.release();
    }
};





export const getCategoriaSegundoNivelGENERAL = async () => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT * FROM Categoria WHERE categoria.categoriaSuperior IN (
            SELECT idNombre 
            FROM categoria 
            WHERE categoria.categoriaSuperior = 'Global'
        ) 
        ORDER BY idNombre ASC;`;
        const [rows] = await connection.execute<ICategoria[]>(query);

        return rows || [];
    } catch (error) {
        console.error('Error getting categoria:', error);
    } finally {
        connection.release();
    }
}

/*
export const getComponentesCategoriaTercerNivel = async (roadmap: string, padre: string) => {
    const connection = await db.getConnection();
    try {
        const query = `SELECT  Roadmap_categoria.componenteCategoria, Categoria.categoriaSuperior
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
    } finally {
        connection.release();
    }
}
    */

/*

export const getComponentesCategoriaTercerNivel = async (roadmap: string, padre: string) => {
    const connection = await db.getConnection();
    try {
        const query = `
            SELECT 
                s.idCategoria AS componenteCategoria,
                c.categoriaSuperior
            FROM 
                step s
            JOIN 
                categoria c
            ON 
                s.idCategoria = c.idNombre
            WHERE 
                s.idRoadmap = ?
                AND c.categoriaSuperior IN (
                    SELECT idNombre
                    FROM categoria
                    WHERE categoriaSuperior = ?
                );
        `;

        const [rows] = await connection.execute<ICategoriaSubNivel[]>(query, [roadmap, padre]);

        console.log('Categorias de tercer nivel:', rows);

        return rows || [];
    } catch (error) {
        console.error('Error getting categorias de tercer nivel:', error);
        throw error;
    } finally {
        connection.release();
    }
};
*/

export const getComponentesCategoriaTercerNivel = async (roadmap: string, padre: string) => {
    const connection = await db.getConnection();
    try {
        // Consulta para categorías de tercer nivel directamente asociadas al roadmap
        const queryDirectCategories = `
            SELECT 
                s.idCategoria AS componenteCategoria,
                c.categoriaSuperior,
                s.numeroStep AS orden
            FROM 
                step s
            JOIN 
                categoria c
            ON 
                s.idCategoria = c.idNombre
            WHERE 
                s.idRoadmap = ?
                AND c.categoriaSuperior IN (
                    SELECT idNombre
                    FROM categoria
                    WHERE categoriaSuperior = ?
                );
        `;

        // Consulta para categorías de tercer nivel de los elementos reutilizables
        const queryReusableCategories = `
            SELECT 
                sc.idCategoria AS componenteCategoria,
                c.categoriaSuperior,
                s.numeroStep AS orden
            FROM 
                step s
            JOIN 
                step sc
            ON 
                s.idElemento = sc.idRoadmap
            JOIN 
                categoria c
            ON 
                sc.idCategoria = c.idNombre
            WHERE 
                s.idRoadmap = ?
                AND c.categoriaSuperior IN (
                    SELECT idNombre
                    FROM categoria
                    WHERE categoriaSuperior = ?
                );
        `;

        // Ejecutar ambas consultas
        const [directCategories] = await connection.execute<ICategoriaSubNivel[]>(queryDirectCategories, [roadmap, padre]);
        const [reusableCategories] = await connection.execute<ICategoriaSubNivel[]>(queryReusableCategories, [roadmap, padre]);

        // Combinar los resultados y ordenar globalmente por número de step
        const combinedResults = [...directCategories, ...reusableCategories].sort((a, b) => a.orden - b.orden);

        console.log('Categorias de tercer nivel:', combinedResults);

        return combinedResults || [];
    } catch (error) {
        console.error('Error getting categorias de tercer nivel:', error);
        throw error;
    } finally {
        connection.release();
    }
};




export const getCategoriaTercerNivelGENERAL = async () => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT * FROM categoria WHERE categoria.categoriaSuperior IN (
            SELECT idNombre 
            FROM categoria 
            WHERE categoria.categoriaSuperior <> 'Global' AND
            Categoria.categoriaSuperior IN ( SELECT idNombre
                FROM categoria 
                WHERE categoria.categoriaSuperior = 'Global'
        ) )
        ORDER BY idNombre ASC;`;
        const [rows] = await connection.execute<ICategoria[]>(query);

        return rows || [];
    } catch (error) {
        console.error('Error getting categoria:', error);
    } finally {
        connection.release();
    }
}

export const getAllRoles = async () => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT * FROM rol`;
        const [rows] = await connection.execute<IRol[]>(query);

        return rows || [];
    } catch (error) {
        console.error('Error getting roadmap:', error);
    } finally {
        connection.release();
    }

}



export const getRoadmapAlmacenados = async () => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT * FROM esquemaroadmap`;
        const [rows] = await connection.execute<IRoadmapEsquema[]>(query);

        return rows || [];
    } catch (error) {
        console.error('Error getting roadmap:', error);
    } finally {
        connection.release();
    }

}

export const getRoadmapById = async (roadmap: string) => {
    const connection = await db.getConnection();
    try {

        const query = `SELECT * FROM esquemaroadmap WHERE idRoadmap = '${roadmap}'`;

        const [rows] = await connection.execute<IRoadmapEsquema[]>(query, [roadmap]);
        return rows[0];
    } catch (error) {
        console.error('Error getting roadmap:', error);
    } finally {
        connection.release();
    }

}



export const getJsonDeRoadmap = async (roadmap: string) => {
    const connection = await db.getConnection();
    try {

        const query = `Select jsonRoadmap FROM esquemaroadmap WHERE idRoadmap='${roadmap}'`;
        const [result] = await connection.execute<IRoadmapEsquema[]>(query, [roadmap]);

        return result[0];
    } catch (error) {
        console.error('Error obtaining json esquelo', error);
    } finally {
        connection.release();
    }

}

export const getIdElementoReutilizable = async (idDelRoadmap: string): Promise<string | null> => {
    const connection = await db.getConnection();
    try {
        const query = `
            SELECT idElementoReutilizable
            FROM elementoReutilizable
            WHERE idRoadmap = ?;
        `;

        const [rows]: any[] = await connection.execute(query, [idDelRoadmap]);

        // Verifica si rows tiene datos
        if (!Array.isArray(rows) || rows.length === 0) {
            console.error(`No se encontró ningún elemento reutilizable para el idRoadmap: '${idDelRoadmap}'`);
            return null;
        }

        // Accede al campo idElementoReutilizable del primer resultado
        const idElementoReutilizable = rows[0]?.idElementoReutilizable;

        // Verifica si el campo existe
        if (!idElementoReutilizable) {
            throw new Error(
                `El campo idElementoReutilizable no está presente en el resultado para el idRoadmap: '${idDelRoadmap}'`
            );
        }

        return idElementoReutilizable; // Devuelve el ID del elemento reutilizable
    } catch (error) {
        console.error("Error al obtener idElementoReutilizable:", error);
        throw error;
    } finally {
        connection.release();
    }
};





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  UPDATE BD %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const updateStepProgressInDB = async (
    roadmapId: string,
    progressPercentage: number
) => {
    const connection = await db.getConnection();
    try {
        console.log("Iniciando actualización de progreso en la base de datos...");
        console.log("roadmapId recibido:", roadmapId);
        console.log("progressPercentage recibido:", progressPercentage);

        if (!roadmapId) {
            throw new Error("roadmapId es undefined o null");
        }

        // Validar el porcentaje
        if (typeof progressPercentage !== "number" || progressPercentage < 0 || progressPercentage > 100) {
            throw new Error("progressPercentage debe ser un número entre 0 y 100");
        }

        // Actualizar progreso en la tabla principal
        const result = await connection.execute(
            `UPDATE roadmapasignado 
             SET porcentajeCompletado = ?, 
                 fechaUltimoAcceso = NOW(),
                 fechaCompletado = IF(? = 100, NOW(), NULL)
             WHERE idRoadmap = ?`,
            [progressPercentage, progressPercentage, roadmapId]
        );

        console.log("Resultado de la actualización:", result);

        return progressPercentage === 100; // Devuelve true si el progreso está completado
    } catch (error) {
        console.error("Error en updateStepProgressInDB:", error);
        throw error;
    } finally {
        connection.release();
    }
};



export const updateCategoriaNombreDescripcion = async (idNombre: string, nuevoNombre: string, nuevaDescripcion: string) => {
    const connection = await db.getConnection();
    try {

        const query = `UPDATE categoria SET idNombre='${nuevoNombre}', descripcion = '${nuevaDescripcion}' WHERE idNombre = '${idNombre}'`;
        const [result] = await connection.execute<ResultSetHeader>(query, [nuevoNombre, nuevaDescripcion, idNombre]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error updating categoria:', error);
    } finally {
        connection.release();
    }
}


export const updateRecurso = async (id: number, nuevoTitulo: string, nuevoEnlace: string, nuevaDescripcion: string) => {
    const connection = await db.getConnection();
    try {

        const query = `UPDATE recurso SET titulo='${nuevoTitulo}', enlaceFichero='${nuevoEnlace}',descripcion = '${nuevaDescripcion}' WHERE idRecurso = '${id}'`;
        const [result] = await connection.execute<ResultSetHeader>(query, [nuevoTitulo, nuevoEnlace, nuevaDescripcion, id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error updating categoria:', error);
    } finally {
        connection.release();
    }
}


export const updateUserPassWordYRol = async (username: string, password: string, rol: string) => {
    const connection = await db.getConnection();
    const query = `UPDATE User SET password='${password}', rol='${rol}' WHERE username='${username}'`;
    const [result] = await connection.execute<ResultSetHeader>(query, [password, rol, username]);
    return result.affectedRows;



}


export const updateUserPassWord = async (username: string, password: string) => {
    const connection = await db.getConnection();
    const query = `UPDATE user SET password='${password}' WHERE username='${username}'`;
    const [result] = await connection.execute<ResultSetHeader>(query, [password, username]);
    return result.affectedRows;

}


export const updateUserRol = async (username: string, rol: string) => {
    const connection = await db.getConnection();
    const query = `UPDATE user SET  rol='${rol}' WHERE username='${username}'`;
    const [result] = await connection.execute<ResultSetHeader>(query, [rol, username]);
    return result.affectedRows;


}

export const updateUserAdminPoder = async (username: string, admin: number) => {
    const connection = await db.getConnection();

    const query = `UPDATE user SET admin='${admin}' WHERE username='${username}'`;
    const [result] = await connection.execute<ResultSetHeader>(query, [admin, username]);
    return result.affectedRows;


}


export const deleteEtiquetaById = async (id: number) => {
    const connection = await db.getConnection();

    try {
        const query = `DELETE FROM etiqueta WHERE id = ?`;
        await connection.execute(query, [id]);
    } catch (error) {
        console.error("Error al eliminar la etiqueta:", error);
        throw error;
    } finally {
        connection.release();
    }
};


