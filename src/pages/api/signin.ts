import type { APIContext } from "astro";
import { getUsuario } from "../../database/consultas";
import { Argon2id } from "oslo/password";
import { lucia } from "../../auth.ts";

export async function POST(context: APIContext): Promise<Response> {
    const formData = await context.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (typeof username !== "string") {
        return new Response(
            JSON.stringify({ error: "Usuario no válido" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    if (typeof password !== "string") {
        return new Response(
            JSON.stringify({ error: "Contraseña no válida" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const foundUser = await getUsuario(username);
    if (!foundUser) {
        return new Response(
            JSON.stringify({ error: "Nombre de usuario o contraseña incorrecto" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    if (!foundUser.password) {
        return new Response(
            JSON.stringify({ error: "Estás registrado con otro método" }),
            { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const validPassword = await new Argon2id().verify(foundUser.password, password);
    if (!validPassword) {
        return new Response(
            JSON.stringify({ error: "Nombre de usuario o contraseña incorrecto" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    // Crear la sesión del usuario
    const session = await lucia.createSession(foundUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    // Incluir el rol del usuario en la respuesta para el frontend
    return new Response(
        JSON.stringify({
            message: "Inicio de sesión exitoso",
            role: foundUser.mentor ? "mentor" : "usuario",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}