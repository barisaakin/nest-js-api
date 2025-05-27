-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "companyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_pages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "reportId" INTEGER NOT NULL,

    CONSTRAINT "report_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_fields" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "align" TEXT NOT NULL DEFAULT 'start',
    "bold" BOOLEAN NOT NULL DEFAULT false,
    "italic" BOOLEAN NOT NULL DEFAULT false,
    "underline" BOOLEAN NOT NULL DEFAULT false,
    "value" TEXT,
    "bgColor" TEXT DEFAULT '',
    "fontColor" TEXT DEFAULT '',
    "fontSize" INTEGER NOT NULL DEFAULT 16,
    "height" TEXT DEFAULT '',
    "width" TEXT DEFAULT '',
    "margin" TEXT DEFAULT '',
    "pageId" INTEGER NOT NULL,

    CONSTRAINT "report_fields_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_pages" ADD CONSTRAINT "report_pages_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_fields" ADD CONSTRAINT "report_fields_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "report_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
