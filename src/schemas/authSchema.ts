import { z } from "zod";

// Schema pour Login
export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Mot de passe doit contenir au moins 6 caractères"),
});