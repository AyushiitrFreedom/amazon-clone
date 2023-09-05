CREATE TABLE IF NOT EXISTS "message" (
	"message_id" text PRIMARY KEY NOT NULL,
	"sender_id" text,
	"recipient_id" text,
	"message" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"order_id" text PRIMARY KEY NOT NULL,
	"product_id" text,
	"buyer_id" text,
	"is_bought" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"product_id" text PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"price" integer,
	"seller_id" text NOT NULL,
	"imageUrl" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "buyers" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"isSeller" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_buyers_id_fk" FOREIGN KEY ("sender_id") REFERENCES "buyers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_recipient_id_buyers_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "buyers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_buyer_id_buyers_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "buyers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_buyers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "buyers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
