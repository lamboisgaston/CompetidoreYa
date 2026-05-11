import { Router } from "express";
import { login, register } from "../modules/auth/auth.controller.js";
import { patchMatchResult } from "../modules/matches/match.controller.js";
import { postRegistration } from "../modules/registrations/registration.controller.js";
import { getTournaments, postTournament } from "../modules/tournaments/tournament.controller.js";
import { requireAuth } from "../core/middleware/authentication.js";

export const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

router.use(requireAuth);
router.get("/tournaments", getTournaments);
router.post("/tournaments", postTournament);
router.post("/registrations", postRegistration);
router.patch("/matches/:matchId/result", patchMatchResult);
