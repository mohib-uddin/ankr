import { MigrationInterface, QueryRunner } from "typeorm";

export class Package1774970470026 implements MigrationInterface {
    name = 'Package1774970470026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "package_template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" text, "items" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_a32d3c047465942cc347bb5f49a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_package" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "profileId" uuid NOT NULL, "templateId" uuid, "documents" jsonb NOT NULL DEFAULT '[]', "securityCode" character varying, "sharedLink" character varying, "expiresAt" TIMESTAMP, "status" character varying NOT NULL DEFAULT 'Draft', CONSTRAINT "UQ_043afbf065e096447e66c8558e5" UNIQUE ("sharedLink"), CONSTRAINT "PK_252c8e6dd1cf58954b8cdcd1984" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_package" ADD CONSTRAINT "FK_dd6ae2d1c4bbcc9858a8170eafe" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_package" DROP CONSTRAINT "FK_dd6ae2d1c4bbcc9858a8170eafe"`);
        await queryRunner.query(`DROP TABLE "user_package"`);
        await queryRunner.query(`DROP TABLE "package_template"`);
    }

}
