-- CreateTable
CREATE TABLE "Password_Reset_Token" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "hashed_token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Password_Reset_Token_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Password_Reset_Token" ADD CONSTRAINT "Password_Reset_Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
