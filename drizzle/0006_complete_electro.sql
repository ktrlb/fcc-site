CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"bio" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"image_url" varchar(500),
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" varchar(10) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
