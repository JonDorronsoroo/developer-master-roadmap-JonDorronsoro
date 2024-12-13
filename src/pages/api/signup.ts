import type { APIContext } from "astro";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { insertUsuario, insertAdmin, insertMentor } from "../../database/consultas";

export async function POST(context: APIContext): Promise<Response> {
    // Leemos los datos del formulario
    const formData = await context.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    const admin = formData.get("admin") === "on" ? 1 : 0; // Si está marcado, será 1
    const mentor = formData.get("mentor") === "on" ? 1 : 0; // Si está marcado, será 1

    // Validamos los datos (que estén completos y correctos)
    if (!username || !password) {
        return new Response(
            JSON.stringify({ message: "El usuario o la contraseña son necesarios" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    if (typeof username !== "string" || username.length < 4) {
        return new Response(
            JSON.stringify({
                message: "El usuario debe ser una cadena de caracteres y tener longitud mayor a 4",
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    if (typeof password !== "string" || password.length < 4) {
        return new Response(
            JSON.stringify({
                message: "La contraseña debe tener más de 4 caracteres",
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const userId = generateId(15);
    const hashPassword = await new Argon2id().hash(password);

    try {
        if (admin) {
            // Insertamos usuario como administrador
            await insertAdmin(userId, username, hashPassword, 1);
        } else if (mentor) {
            // Insertamos usuario como mentor
            await insertMentor(userId, username, hashPassword, 1);
        } else {
            // Insertamos usuario normal
            await insertUsuario(userId, username, hashPassword);
        }

        // Redirigimos tras la creación exitosa del usuario
        return context.redirect("/addBD/escogerObjeto");
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Ya existe un usuario con ese username";
        return new Response(
            JSON.stringify({ message: "Ya existe un usuario con ese username", error: errorMessage }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
