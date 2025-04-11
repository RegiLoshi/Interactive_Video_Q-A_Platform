-- AlterTable
CREATE SEQUENCE user_user_id_seq;
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'RESPONDER',
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "password" SET DEFAULT '',
ALTER COLUMN "user_id" SET DEFAULT nextval('user_user_id_seq');
ALTER SEQUENCE user_user_id_seq OWNED BY "User"."user_id";
