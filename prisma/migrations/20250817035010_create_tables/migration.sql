-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "public"."UserLevel" AS ENUM ('ADMIN', 'DEFAULT');

-- CreateEnum
CREATE TYPE "public"."AppCode" AS ENUM ('FINANCE', 'STOREROOM');

-- CreateEnum
CREATE TYPE "public"."AppLevel" AS ENUM ('READ', 'ADDCHANGE', 'DELETE');

-- CreateEnum
CREATE TYPE "public"."LoginTrackState" AS ENUM ('SUCCESS', 'FAILURE');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nick" TEXT,
    "phone" TEXT,
    "status" "public"."UserStatus" NOT NULL,
    "level" "public"."UserLevel" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_accesses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "app_code" "public"."AppCode" NOT NULL,
    "app_level" "public"."AppLevel" NOT NULL,

    CONSTRAINT "user_accesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."login_tracks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "state" "public"."LoginTrackState" NOT NULL,
    "device" TEXT,
    "addr" TEXT,
    "ocurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "control_sequence" INTEGER NOT NULL,

    CONSTRAINT "login_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."password_reset_hashes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "is_valid" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_reset_hashes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."user_accesses" ADD CONSTRAINT "user_accesses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."login_tracks" ADD CONSTRAINT "login_tracks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."password_reset_hashes" ADD CONSTRAINT "password_reset_hashes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
