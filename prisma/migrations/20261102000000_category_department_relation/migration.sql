-- AlterTable: coluna ausente na migration inicial (nullable para preencher linhas existentes)
ALTER TABLE "Category" ADD COLUMN "departmentId" TEXT;

-- Categorias existentes são associadas ao primeiro departamento; sem departamento, são removidas
UPDATE "Category" SET "departmentId" = (SELECT "id" FROM "Department" ORDER BY "createdAt" LIMIT 1);
DELETE FROM "Category" WHERE "departmentId" IS NULL AND NOT EXISTS (SELECT 1 FROM "Ticket" WHERE "Ticket"."categoryId" = "Category"."id");

ALTER TABLE "Category" ALTER COLUMN "departmentId" SET NOT NULL;

-- DropIndex
DROP INDEX "Category_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Category_departmentId_name_key" ON "Category"("departmentId", "name");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
