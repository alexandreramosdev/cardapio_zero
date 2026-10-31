-- DropIndex
DROP INDEX "public"."Category_restaurantId_idx";

-- CreateIndex
CREATE INDEX "Category_restaurantId_sortOrder_idx" ON "public"."Category"("restaurantId", "sortOrder");
