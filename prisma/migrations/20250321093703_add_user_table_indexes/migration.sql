/*
  Warnings:

  - A unique constraint covering the columns `[employee_code]` on the table `exelsys_users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "exelsys_users_employee_code_key" ON "exelsys_users"("employee_code");

-- CreateIndex
CREATE INDEX "exelsys_users_email_idx" ON "exelsys_users"("email");

-- CreateIndex
CREATE INDEX "exelsys_users_employee_code_idx" ON "exelsys_users"("employee_code");
