CREATE TABLE "chapter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projectId" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"number" integer NOT NULL,
	"imagePath" text NOT NULL,
	"createdAt" date DEFAULT now(),
	"deletedAt" date
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author" uuid NOT NULL,
	"name" char NOT NULL,
	"description" text NOT NULL,
	"createdAt" date DEFAULT now(),
	"deletedAt" date
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"userId" uuid NOT NULL,
	"projectId" uuid NOT NULL,
	"subscribedAt" timestamp DEFAULT now(),
	CONSTRAINT "user_subscriptions_userId_projectId_pk" PRIMARY KEY("userId","projectId")
);
--> statement-breakpoint
DROP TABLE "session" CASCADE;--> statement-breakpoint
ALTER TABLE "chapter" ADD CONSTRAINT "chapter_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_author_user_id_fk" FOREIGN KEY ("author") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;