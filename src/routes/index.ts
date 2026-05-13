import { Router } from "express";
import { login, register, registerCompetitor, registerOrganizer, registerReferee } from "../modules/auth/auth.controller.js";
import { getCities, postCity } from "../modules/cities/city.controller.js";
import { getCountries } from "../modules/countries/country.controller.js";
import { getCompetitorProfile, putCompetitorProfile } from "../modules/competitor-profiles/competitor-profile.controller.js";
import { getAssignedMatches, patchMatchResult } from "../modules/matches/match.controller.js";
import { postRegistration } from "../modules/registrations/registration.controller.js";
import { getSportCategories, postSportCategory } from "../modules/sport-categories/sport-category.controller.js";
import { getSports, postSport } from "../modules/sports/sport.controller.js";
import { getTournamentCategories, postTournamentCategory } from "../modules/tournament-categories/tournament-category.controller.js";
import { getTournaments, postTournament } from "../modules/tournaments/tournament.controller.js";
import { requireAuth } from "../core/middleware/authentication.js";

export const router = Router();

router.post("/auth/register", register);
router.post("/auth/register/competitor", registerCompetitor);
router.post("/auth/register/organizer", registerOrganizer);
router.post("/auth/register/referee", registerReferee);
router.post("/auth/login", login);

// Lectura pública para catálogos base
router.get("/cities", getCities);
router.get("/countries", getCountries);
router.get("/sports", getSports);
router.get("/sport-categories", getSportCategories);

router.use(requireAuth);
router.get("/tournaments", getTournaments);
router.post("/tournaments", postTournament);
router.post("/registrations", postRegistration);
router.get("/matches/assigned", getAssignedMatches);
router.patch("/matches/:matchId/result", patchMatchResult);

router.post("/cities", postCity);
router.post("/sports", postSport);
router.post("/sport-categories", postSportCategory);
router.get("/tournament-categories", getTournamentCategories);
router.post("/tournament-categories", postTournamentCategory);
router.get("/competitor-profile", getCompetitorProfile);
router.put("/competitor-profile", putCompetitorProfile);
