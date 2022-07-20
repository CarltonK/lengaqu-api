import LogEventsParameters from '../models/log_events';
import db from '../server';

export default class LogService {
    async createLog({ eventType, userId, desc, remarks }: LogEventsParameters): Promise<void> {
        await db.prisma.logEvents.create({ data: { eventType, userId, desc, remarks } });
    }
}