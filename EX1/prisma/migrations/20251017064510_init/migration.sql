-- CreateTable
CREATE TABLE "ExamScore" (
    "id" SERIAL NOT NULL,
    "studentCode" TEXT NOT NULL,
    "fullName" TEXT,
    "province" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "subjectScores" JSONB NOT NULL,
    "totalScore" DOUBLE PRECISION,
    "sourceUrl" TEXT,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamScore_studentCode_province_year_key" ON "ExamScore"("studentCode", "province", "year");
