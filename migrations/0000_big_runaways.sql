CREATE TABLE "anonymous_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fingerprint" varchar(255) NOT NULL,
	"ipHash" varchar(255),
	"userAgent" text,
	"created_at" timestamp DEFAULT now(),
	"last_seen" timestamp DEFAULT now(),
	CONSTRAINT "anonymous_users_fingerprint_unique" UNIQUE("fingerprint")
);
--> statement-breakpoint
CREATE TABLE "blog_reactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_reactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"blogSlug" varchar(255) NOT NULL,
	"emoji" varchar(10) NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"content" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_reactions" ADD CONSTRAINT "blog_reactions_user_id_anonymous_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."anonymous_users"("id") ON DELETE no action ON UPDATE no action;
