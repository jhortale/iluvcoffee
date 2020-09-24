import {MigrationInterface, QueryRunner} from "typeorm";

export class CoffeeRefactor1600910498959 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
          `ALTER TABLE "coffee" RENAME COLUMN "name" TO "title"`,
        );
      }
      
      public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
          `ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"`,
        );
      }

}
