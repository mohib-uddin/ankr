import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertyUpdt1774956782550 implements MigrationInterface {
    name = 'PropertyUpdt1774956782550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "property" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "property" ADD "state" character varying`);
        await queryRunner.query(`ALTER TABLE "property" ADD "zipCode" character varying`);
        await queryRunner.query(`ALTER TABLE "property" ADD "currentStatus" character varying DEFAULT 'Acquisition'`);
        await queryRunner.query(`ALTER TABLE "property" ADD "grossSqFt" integer`);
        await queryRunner.query(`ALTER TABLE "property" ADD "units_doors" integer`);
        await queryRunner.query(`ALTER TABLE "property" ADD "yearBuilt" integer`);
        await queryRunner.query(`ALTER TABLE "property" ADD "lotSizeAcres" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "property" ADD "zoning" text`);
        await queryRunner.query(`ALTER TABLE "property" ADD "images" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "zoning"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "lotSizeAcres"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "yearBuilt"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "units_doors"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "grossSqFt"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "currentStatus"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "zipCode"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "name"`);
    }

}
