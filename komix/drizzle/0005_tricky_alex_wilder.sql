CREATE TYPE "public"."category" AS ENUM('horreur', 'action', 'humour', 'sf', 'thriller', 'fantastique');--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "category" "category" NOT NULL;