-- AlterTable
ALTER TABLE "File" ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "parentFolderId" INTEGER;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
