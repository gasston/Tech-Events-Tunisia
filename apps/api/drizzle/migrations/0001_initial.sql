CREATE TYPE "format" AS ENUM ('onsite', 'online', 'hybrid');
CREATE TYPE "moderation_status" AS ENUM ('pending', 'published', 'rejected');

CREATE TABLE "events" (
  "id"                uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug"              text UNIQUE NOT NULL,
  "title"             text NOT NULL,
  "description"       text NOT NULL,
  "organizer"         text NOT NULL,
  "organizer_logo"    text,
  "cover_image"       text,
  "start_date"        timestamptz NOT NULL,
  "end_date"          timestamptz,
  "format"            "format" NOT NULL,
  "city"              text,
  "address"           text,
  "latitude"          real,
  "longitude"         real,
  "online_url"        text,
  "target_audience"   jsonb NOT NULL DEFAULT '[]',
  "categories"        jsonb NOT NULL DEFAULT '[]',
  "registration_url"  text,
  "website_url"       text,
  "is_free"           boolean NOT NULL DEFAULT true,
  "price"             numeric(10, 2),
  "views"             integer NOT NULL DEFAULT 0,
  "moderation_status" "moderation_status" NOT NULL DEFAULT 'pending',
  "created_at"        timestamptz NOT NULL DEFAULT now(),
  "updated_at"        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "admins" (
  "id"            uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email"         text UNIQUE NOT NULL,
  "password_hash" text NOT NULL,
  "created_at"    timestamptz NOT NULL DEFAULT now()
);
