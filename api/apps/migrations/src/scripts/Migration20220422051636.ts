import { Migration } from '@mikro-orm/migrations';

export class Migration20220422051636 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `risk_assessment` (`uuid` varchar(36) not null, `created_at` datetime not null, `updated_at` datetime not null, `sanction` varchar(3) null, `rating` varchar(6) null, `apply` varchar(3) null,`aml` varchar(3) null,`sanctioned_jurisdiction` varchar(3) null,`high_risk_jurisdiction` varchar(3) null,`third_party` varchar(3) null,`understood` varchar(3) null,`material_connection` varchar(3) null,`sensitive_activity` varchar(3) null,`volume` varchar(3) null,`transactions` varchar(3) null,`knowledge` varchar(3) null, `pep` varchar(3) null,`adverse_information` varchar(3) null,`risk_rating` varchar(8) null,`completed_by` varchar(36) null, `completion_date` datetime null, `director` varchar(36) null, `approval_date` datetime null, PRIMARY KEY (`uuid`)) default character set utf8mb4 engine = InnoDB;',
    );
  }
  async down(): Promise<void> {
    this.addSql('drop table `risk_assessment`;');
  }
}
