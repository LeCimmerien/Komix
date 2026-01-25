CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"passwordHash" text NOT NULL,
	"createdAt" date DEFAULT now(),
	"deletedAt" date
);
