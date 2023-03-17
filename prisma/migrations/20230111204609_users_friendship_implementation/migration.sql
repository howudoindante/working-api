-- CreateTable
CREATE TABLE "FriendshipStatuses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstUserId" INTEGER NOT NULL,
    "secondUserId" INTEGER NOT NULL,
    "friendshipStatusId" INTEGER NOT NULL,
    CONSTRAINT "Friendship_firstUserId_fkey" FOREIGN KEY ("firstUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Friendship_secondUserId_fkey" FOREIGN KEY ("secondUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Friendship_friendshipStatusId_fkey" FOREIGN KEY ("friendshipStatusId") REFERENCES "FriendshipStatuses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FriendshipStatuses_id_key" ON "FriendshipStatuses"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FriendshipStatuses_name_key" ON "FriendshipStatuses"("name");
