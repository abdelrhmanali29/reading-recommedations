import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1731629075690 implements MigrationInterface {
	name = 'CreateTables1731629075690';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "books" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "numOfPages" integer NOT NULL, CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "reading_intervals" ("id" SERIAL NOT NULL, "startPage" integer NOT NULL, "endPage" integer NOT NULL, "userId" integer, "bookId" integer, CONSTRAINT "PK_e88685b4093b050e5cbd43c20de" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')`,
		);
		await queryRunner.query(
			`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "reading_intervals" ADD CONSTRAINT "FK_c63c4ec53d5612e3dde0a675cec" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "reading_intervals" ADD CONSTRAINT "FK_bc307fce3f3bd70891a866f1ad4" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "reading_intervals" DROP CONSTRAINT "FK_bc307fce3f3bd70891a866f1ad4"`,
		);
		await queryRunner.query(
			`ALTER TABLE "reading_intervals" DROP CONSTRAINT "FK_c63c4ec53d5612e3dde0a675cec"`,
		);
		await queryRunner.query(`DROP TABLE "users"`);
		await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
		await queryRunner.query(`DROP TABLE "reading_intervals"`);
		await queryRunner.query(`DROP TABLE "books"`);
	}
}
