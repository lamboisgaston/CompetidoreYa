-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ORGANIZADOR', 'COMPETIDOR', 'ARBITRO');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('LOGIN', 'CREATE_TOURNAMENT', 'UPDATE_TOURNAMENT', 'DELETE_TOURNAMENT', 'REGISTER_COMPETITOR', 'REPORT_MATCH_RESULT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "competitorId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "refereeId" TEXT NOT NULL,
    "result" TEXT,
    "playedAt" TIMESTAMP(3),

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "targetId" TEXT,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SportCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentCategory" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "sportCategoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TournamentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "sportCategoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetitorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_competitorId_tournamentId_key" ON "Registration"("competitorId", "tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sport_name_key" ON "Sport"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SportCategory_sportId_name_key" ON "SportCategory"("sportId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentCategory_tournamentId_sportCategoryId_key" ON "TournamentCategory"("tournamentId", "sportCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitorProfile_userId_key" ON "CompetitorProfile"("userId");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportCategory" ADD CONSTRAINT "SportCategory_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentCategory" ADD CONSTRAINT "TournamentCategory_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentCategory" ADD CONSTRAINT "TournamentCategory_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentCategory" ADD CONSTRAINT "TournamentCategory_sportCategoryId_fkey" FOREIGN KEY ("sportCategoryId") REFERENCES "SportCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorProfile" ADD CONSTRAINT "CompetitorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorProfile" ADD CONSTRAINT "CompetitorProfile_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorProfile" ADD CONSTRAINT "CompetitorProfile_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorProfile" ADD CONSTRAINT "CompetitorProfile_sportCategoryId_fkey" FOREIGN KEY ("sportCategoryId") REFERENCES "SportCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

