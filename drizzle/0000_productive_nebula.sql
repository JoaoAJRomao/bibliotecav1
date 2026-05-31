ALTER TABLE "users" ADD COLUMN "role" varchar(50) DEFAULT 'user' NOT NULL;
--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "quantity" integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "loans_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"book_id" integer NOT NULL,
	"borrowed_at" timestamp DEFAULT now() NOT NULL,
	"returned_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "loans_user_id_idx" ON "loans" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "loans_book_id_returned_idx" ON "loans" USING btree ("book_id","returned_at");