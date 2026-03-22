-- AddColumn: subscriptions.translation_pages_limit
ALTER TABLE "subscriptions" ADD COLUMN "translation_pages_limit" INTEGER;

-- AddColumn: subscriptions.character_limit
ALTER TABLE "subscriptions" ADD COLUMN "character_limit" INTEGER;

-- Set default 100 pages limit for FREE plan
UPDATE "subscriptions" SET "translation_pages_limit" = 100 WHERE plan = 'FREE';

-- AlterTable: term_inverted_index type alignment
ALTER TABLE "term_inverted_index"
  DROP CONSTRAINT "term_inverted_index_glossary_id_fkey";

ALTER TABLE "term_inverted_index"
  ALTER COLUMN "created_at" SET NOT NULL,
  ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3) USING created_at::TIMESTAMP(3),
  ALTER COLUMN "updated_at" SET NOT NULL,
  ALTER COLUMN "updated_at" DROP DEFAULT,
  ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3) USING updated_at::TIMESTAMP(3);

ALTER TABLE "term_inverted_index"
  ADD CONSTRAINT "term_inverted_index_glossary_id_fkey"
  FOREIGN KEY ("glossary_id") REFERENCES "glossaries"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER INDEX IF EXISTS "unique_glossary_token"
  RENAME TO "term_inverted_index_glossary_id_token_key";

-- NOTE: GIN indexes managed manually (Prisma does not support GIN)
-- idx_inverted_term_ids_gin and idx_inverted_token_gin rebuilt outside Prisma
