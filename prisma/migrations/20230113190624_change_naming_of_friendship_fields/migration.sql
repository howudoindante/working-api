/*
  Warnings:

  - You are about to drop the column `firstUserId` on the `Friendship` table. All the data in the column will be lost.
  - You are about to drop the column `secondUserId` on the `Friendship` table. All the data in the column will be lost.
  - Added the required column `recipientId` to the `Friendship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Friendship` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Friendship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "friendshipStatusId" INTEGER NOT NULL,
    CONSTRAINT "Friendship_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Friendship_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Friendship_friendshipStatusId_fkey" FOREIGN KEY ("friendshipStatusId") REFERENCES "FriendshipStatuses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Friendship" ("friendshipStatusId", "id") SELECT "friendshipStatusId", "id" FROM "Friendship";
DROP TABLE "Friendship";
ALTER TABLE "new_Friendship" RENAME TO "Friendship";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
