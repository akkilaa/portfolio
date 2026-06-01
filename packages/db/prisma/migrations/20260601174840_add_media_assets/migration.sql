-- CreateTable
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "checksum" TEXT NOT NULL,
    "blur_data_url" TEXT,
    "alt" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_key_key" ON "media_assets"("key");

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_checksum_key" ON "media_assets"("checksum");
