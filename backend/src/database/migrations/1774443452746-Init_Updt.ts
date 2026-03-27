import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUpdt1774443452746 implements MigrationInterface {
    name = 'InitUpdt1774443452746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "statementUrl"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "mortgageStatementUrl"`);
        await queryRunner.query(`ALTER TABLE "business_entity" DROP COLUMN "operatingAgreementUrl"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP COLUMN "brokerageStatementUrl"`);
        await queryRunner.query(`ALTER TABLE "liability" DROP COLUMN "statementUrl"`);
        await queryRunner.query(`ALTER TABLE "income" DROP COLUMN "taxReturnUrl"`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "accountType" SET DEFAULT 'Checking Account'`);
        await queryRunner.query(`ALTER TABLE "property" ALTER COLUMN "propertyType" SET DEFAULT 'Single Family'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" ALTER COLUMN "propertyType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "accountType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "income" ADD "taxReturnUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "liability" ADD "statementUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "asset" ADD "brokerageStatementUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "business_entity" ADD "operatingAgreementUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "property" ADD "mortgageStatementUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "account" ADD "statementUrl" character varying`);
    }

}
