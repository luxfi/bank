import { Injectable, Logger } from '@nestjs/common';
import { SessionsRepository } from './repository/sessions.repository';
import { Session } from './model/session.entity';
import { User } from '@luxbank/tools-models';

@Injectable()
export class SessionsService {
    private logger: Logger = new Logger(SessionsService.name);

    constructor(private readonly sessionsRepository: SessionsRepository) { }

    async create(data: any, user?: User | undefined): Promise<Session | null> {
        console.log(`data: `, data);
        const session = await this.sessionsRepository.createSession(data, user);
        console.log(`session: `, session);
        this.sessionsRepository.getEntityManager().persistAndFlush(session);
        console.log(`after persist session: `, session);
        return session;
    }
}