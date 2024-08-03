import { EntityRepository } from '@mikro-orm/knex';
import { Session } from '../model/session.entity';
import { User } from '@luxbank/tools-models';

export class SessionsRepository extends EntityRepository<Session> {
    async createSession(data: any, user?: User | undefined): Promise<Session> {
        const result = new Session();
        result.ip = data.ip;
        result.username = data.username;
        result.type = data.type;
        result.userAgent = data.userAgent;
        result.fingerprint = data.fingerprint;
        return result;
    }
}
