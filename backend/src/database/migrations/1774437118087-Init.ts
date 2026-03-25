import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1774437118087 implements MigrationInterface {
    name = 'Init1774437118087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "isVerified" boolean NOT NULL DEFAULT false, "verificationCode" character varying NOT NULL DEFAULT '', "isPassCodeValid" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "picture" character varying, "roleId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "key" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_128d7c8c9af53479d0b9e00eb58" UNIQUE ("key"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL DEFAULT 'Investor', "userId" uuid NOT NULL, CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "investor_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fullLegalName" character varying NOT NULL, "primaryAddress" text NOT NULL, "phone" character varying NOT NULL, "ssn" character varying NOT NULL, "isGuarantor" boolean NOT NULL DEFAULT false, "hasLegalActions" boolean NOT NULL DEFAULT false, "hasFiledBankruptcy" boolean NOT NULL DEFAULT false, "isObligatedForSupport" boolean NOT NULL DEFAULT false, "hasPledgedAssets" boolean NOT NULL DEFAULT false, "hasForeclosures" boolean NOT NULL DEFAULT false, "isPartyToLawsuit" boolean NOT NULL DEFAULT false, "profileId" uuid NOT NULL, CONSTRAINT "REL_028b1666281f5dc060794c1f2c" UNIQUE ("profileId"), CONSTRAINT "PK_2e3d9faeadd8200932f7015f8fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "institution" character varying NOT NULL, "accountType" character varying NOT NULL, "currentBalance" numeric(12,2) NOT NULL, "statementUrl" character varying, "profileId" uuid NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "business_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "entityName" character varying NOT NULL, "ownershipPercentage" integer NOT NULL DEFAULT '100', "estimatedValue" numeric(15,2) NOT NULL, "operatingAgreementUrl" character varying, "profileId" uuid NOT NULL, CONSTRAINT "PK_611b70452c113fb6e68942bef03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "asset" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "publicInvestmentsTotal" numeric(15,2) NOT NULL DEFAULT '0', "privateInvestments" numeric(15,2) NOT NULL DEFAULT '0', "otherAssets" numeric(15,2) NOT NULL DEFAULT '0', "brokerageStatementUrl" character varying, "profileId" uuid NOT NULL, CONSTRAINT "REL_a1c29aca8faf68586073acf664" UNIQUE ("profileId"), CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "liability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "creditCardsTotal" numeric(12,2) NOT NULL DEFAULT '0', "personalLoans" numeric(12,2) NOT NULL DEFAULT '0', "otherDebt" numeric(12,2) NOT NULL DEFAULT '0', "linkedAsset" character varying DEFAULT 'None', "statementUrl" character varying, "profileId" uuid NOT NULL, CONSTRAINT "REL_e218fa2200d3618b7c80b670f7" UNIQUE ("profileId"), CONSTRAINT "PK_42689000082a60d1e150017ef63" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "income" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "primaryIncome" numeric(15,2) NOT NULL DEFAULT '0', "rentalIncome" numeric(15,2) NOT NULL DEFAULT '0', "otherIncome" numeric(15,2) NOT NULL DEFAULT '0', "taxReturnUrl" character varying, "profileId" uuid NOT NULL, CONSTRAINT "REL_f009d6690ccd5f4dd8d5e19d76" UNIQUE ("profileId"), CONSTRAINT "PK_29a10f17b97568f70cee8586d58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "address" text NOT NULL, "propertyType" character varying NOT NULL, "estimatedValue" numeric(15,2) NOT NULL, "loanBalance" numeric(15,2) NOT NULL, "monthlyRent" numeric(12,2) NOT NULL, "interestRate" numeric(5,2), "monthlyPayment" numeric(12,2), "lender" character varying, "maturityDate" date, "ownershipPercentage" integer NOT NULL DEFAULT '100', "mortgageStatementUrl" character varying, "profileId" uuid NOT NULL, CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "other_asset" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "publicInvestmentsTotal" numeric(15,2) NOT NULL DEFAULT '0', "privateInvestments" numeric(15,2) NOT NULL DEFAULT '0', "otherAssets" numeric(15,2) NOT NULL DEFAULT '0', "brokerageStatementUrl" character varying, "userId" uuid NOT NULL, CONSTRAINT "PK_9902f77954fd9dc16acba6c3801" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "investor_profile" ADD CONSTRAINT "FK_028b1666281f5dc060794c1f2c9" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_ff102ecfd2f4b5a7edf239dd025" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "business_entity" ADD CONSTRAINT "FK_a4b5da767306cb7f6189c570c9e" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_a1c29aca8faf68586073acf664b" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "liability" ADD CONSTRAINT "FK_e218fa2200d3618b7c80b670f76" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "income" ADD CONSTRAINT "FK_f009d6690ccd5f4dd8d5e19d765" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_d95e2fba15f2355e66d74c36ddf" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "other_asset" ADD CONSTRAINT "FK_c33c6b26da5b1af70fc62a44a14" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "other_asset" DROP CONSTRAINT "FK_c33c6b26da5b1af70fc62a44a14"`);
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_d95e2fba15f2355e66d74c36ddf"`);
        await queryRunner.query(`ALTER TABLE "income" DROP CONSTRAINT "FK_f009d6690ccd5f4dd8d5e19d765"`);
        await queryRunner.query(`ALTER TABLE "liability" DROP CONSTRAINT "FK_e218fa2200d3618b7c80b670f76"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_a1c29aca8faf68586073acf664b"`);
        await queryRunner.query(`ALTER TABLE "business_entity" DROP CONSTRAINT "FK_a4b5da767306cb7f6189c570c9e"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_ff102ecfd2f4b5a7edf239dd025"`);
        await queryRunner.query(`ALTER TABLE "investor_profile" DROP CONSTRAINT "FK_028b1666281f5dc060794c1f2c9"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`DROP TABLE "other_asset"`);
        await queryRunner.query(`DROP TABLE "property"`);
        await queryRunner.query(`DROP TABLE "income"`);
        await queryRunner.query(`DROP TABLE "liability"`);
        await queryRunner.query(`DROP TABLE "asset"`);
        await queryRunner.query(`DROP TABLE "business_entity"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "investor_profile"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
