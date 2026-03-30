import { MigrationInterface, QueryRunner } from "typeorm";

export class Documents1774860936175 implements MigrationInterface {
    name = 'Documents1774860936175'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "document" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "category" character varying NOT NULL DEFAULT 'Identity', "linkedPropertyId" uuid, "tags" text, "notes" text, "filePath" character varying NOT NULL, "folderId" uuid, "profileId" uuid NOT NULL, CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "folder" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "parentFolderId" uuid, "profileId" uuid NOT NULL, CONSTRAINT "PK_6278a41a706740c94c02e288df8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_17d1bff64ad6915b50b7352ef2c" FOREIGN KEY ("linkedPropertyId") REFERENCES "property"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_76b187510eda9c862f9944808a8" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_81b47da8bc5c13da2d456003277" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "FK_804ea52f6729e3940498bd54d78" FOREIGN KEY ("parentFolderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "FK_3ef509a89a2e58e64d9e8c2d533" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "FK_3ef509a89a2e58e64d9e8c2d533"`);
        await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "FK_804ea52f6729e3940498bd54d78"`);
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_81b47da8bc5c13da2d456003277"`);
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_76b187510eda9c862f9944808a8"`);
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_17d1bff64ad6915b50b7352ef2c"`);
        await queryRunner.query(`DROP TABLE "folder"`);
        await queryRunner.query(`DROP TABLE "document"`);
    }

}
