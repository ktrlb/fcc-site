CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"file_url" varchar(500) NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_size" varchar(20),
	"mime_type" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" varchar(10) DEFAULT '0',
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
