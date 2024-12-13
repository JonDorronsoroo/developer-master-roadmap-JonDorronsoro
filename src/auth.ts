import { Lucia } from "lucia";
import { Mysql2Adapter } from "@lucia-auth/adapter-mysql";
import mysql from "mysql2/promise";
import { db } from "./database/dbMySQL";

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

// Actualiza DatabaseUserAttributes para incluir `mentor`
interface DatabaseUserAttributes {
	username: string;
	admin: number;
	rol: string | null;
	mentor: number; // Añade mentor aquí
}

const adapter = new Mysql2Adapter(db, {
	user: "user",
	session: "user_session"
});

export const lucia = new Lucia(adapter, {
	// Incluye `mentor` en los atributos del usuario
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
			admin: attributes.admin,
			rol: attributes.rol,
			mentor: attributes.mentor, // Añade esto
		};
	},

	sessionCookie: {
		attributes: {
			secure: import.meta.env.PROD,
		},
	},
});
