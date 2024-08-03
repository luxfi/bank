import { Migration } from '@mikro-orm/migrations';
import { v4 } from 'uuid';
import { hash } from 'bcryptjs';
import { UserRole } from '@luxbank/models';

export class Migration20240729142902 extends Migration {

  async up(): Promise<void> {
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const userId = v4();
    const AdminEmail = 'eleesha@cdaxforex.com';
    const AdminPassword = await hash('Summer24', 8);
    const firstname = 'Eleesha';
    const lastname = 'Preston';
    this.addSql(
      `insert into \"user\" (uuid, created_at, updated_at, username, password, firstname, lastname) 
        values ('${userId}', '${date}', '${date}', '${AdminEmail}', '${AdminPassword}', '${firstname}', '${lastname}');`
    );

    const accountId = v4();
    this.addSql(
      `insert into \"account\" (uuid, created_at, updated_at, is_approved, users_uuid) 
        values ('${accountId}', '${date}', '${date}', true, '${userId}');`
    );

    const clientId = v4();
    this.addSql(
      `insert into \"client\" (uuid, created_at, updated_at, account_uuid) 
        values ('${clientId}', '${date}', '${date}', '${accountId}');`
    );

    const userClientId = v4();
    this.addSql(
      `insert into \"user_clients\" (uuid, user_uuid, client_uuid) 
        values ('${userClientId}', '${userId}', '${clientId}');`
    );

    const userClientMetadataId = v4();
    const role = UserRole.SuperAdmin;
    this.addSql(
      `insert into \"user_clients_metadata\" (uuid, user_client_uuid, role) 
        values ('${userClientMetadataId}', '${userClientId}', '${role}');`
    );
  }

  async down(): Promise<void> {
  }
}
