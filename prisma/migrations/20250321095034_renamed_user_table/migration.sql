/*
  Warnings:

  - You are about to drop the `exelsys_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "exelsys_users";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "external_id" INTEGER,
    "employee_code" TEXT,
    "name_prefix" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "initials" TEXT,
    "email" TEXT,
    "job_title" TEXT,
    "gender" TEXT,
    "birth_date" TIMESTAMP(3),
    "status" TEXT,
    "employment_date" TIMESTAMP(3),
    "termination_date" TIMESTAMP(3),
    "termination_reason_code" TEXT,
    "department_code" TEXT,
    "department" TEXT,
    "department_location" TEXT,
    "parent_department_code" TEXT,
    "parent_department_name" TEXT,
    "location" TEXT,
    "location_code" TEXT,
    "location_id" TEXT,
    "address_line1" TEXT,
    "address_line2" TEXT,
    "address_line3" TEXT,
    "city" TEXT,
    "post_code" TEXT,
    "district_province" TEXT,
    "country_iso_code" TEXT,
    "country" TEXT,
    "phone_no" TEXT,
    "phone_no2" TEXT,
    "mobile_phone" TEXT,
    "work_email" TEXT,
    "social_security_no" TEXT,
    "identity_card_no" TEXT,
    "identity_card_place_of_issue" TEXT,
    "passport_no" TEXT,
    "passport_expiry_date" TIMESTAMP(3),
    "national_insurance_no" TEXT,
    "employee_grade_code" TEXT,
    "employee_grade" TEXT,
    "employee_job_description_code" TEXT,
    "employee_job_description" TEXT,
    "employee_contract_type" TEXT,
    "employee_contract_type_code" TEXT,
    "contract_expiry_date" TIMESTAMP(3),
    "position_code" TEXT,
    "employee_manager" TEXT,
    "employee_manager_code" TEXT,
    "payroll_no" TEXT,
    "payroll_company_no" TEXT,
    "bank_name" TEXT,
    "bank_account_no" TEXT,
    "iban" TEXT,
    "swift" TEXT,
    "currency_id" TEXT,
    "tax_code" TEXT,
    "years_of_service" INTEGER,
    "age" INTEGER,
    "picture_id" TEXT,
    "work_permit_type" TEXT,
    "work_permit_expiry_date" TIMESTAMP(3),
    "work_permit_reference" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_employee_code_key" ON "User"("employee_code");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_employee_code_idx" ON "User"("employee_code");
