import { Argon2id } from "oslo/password";

(async () => {
    const password = "Maisua"; // Contraseña que quieres hashear
    try {
        const hash = await new Argon2id().hash(password);
        console.log("Hash generado:", hash);
    } catch (error) {
        console.error("Error al generar el hash:", error);
    }
})();
