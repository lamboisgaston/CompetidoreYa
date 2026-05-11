import { Router } from "express";
import { login, register } from "../modules/auth/auth.controller.js";
import { getCities, postCity } from "../modules/cities/city.controller.js";
import { getCompetitorProfile, putCompetitorProfile } from "../modules/competitor-profiles/competitor-profile.controller.js";
import { patchMatchResult } from "../modules/matches/match.controller.js";
import { postRegistration } from "../modules/registrations/registration.controller.js";
import { getSportCategories, postSportCategory } from "../modules/sport-categories/sport-category.controller.js";
import { getSports, postSport } from "../modules/sports/sport.controller.js";
import { getTournamentCategories, postTournamentCategory } from "../modules/tournament-categories/tournament-category.controller.js";
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

router.get("/cities", getCities);
router.post("/cities", postCity);
router.get("/sports", getSports);
router.post("/sports", postSport);
router.get("/sport-categories", getSportCategories);
router.post("/sport-categories", postSportCategory);
router.get("/tournament-categories", getTournamentCategories);
router.post("/tournament-categories", postTournamentCategory);
router.get("/competitor-profile", getCompetitorProfile);
router.put("/competitor-profile", putCompetitorProfile);
