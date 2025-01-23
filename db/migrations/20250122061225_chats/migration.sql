-- CreateTable
CREATE TABLE "history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "part" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "history_id" INTEGER NOT NULL,
    CONSTRAINT "part_history_id_fkey" FOREIGN KEY ("history_id") REFERENCES "history" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
