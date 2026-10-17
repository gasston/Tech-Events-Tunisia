CREATE TABLE "newsletter_subscribers" (
  "id"         uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email"      text UNIQUE NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
