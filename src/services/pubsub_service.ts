import { PubSub } from '@google-cloud/pubsub'
import HttpException from '../helpers/exceptions';
import { logger } from '../middlewares/logger';

export default class PubSubService {
    private pubsubClient: PubSub;

    constructor() {
        this.pubsubClient = new PubSub();
    }

    async publishMessage(data: Record<string, any>): Promise<string> {
        // Convert JSON to Buffer
        try {
            const dataBuffer: any = Buffer.from(JSON.stringify(data));
            const [messageId] = await this.pubsubClient.topic('cloud-events').publish(dataBuffer);
            logger('PubSub').info(`Message published`);
            return messageId;
        } catch (error: any) {
            logger('PubSub').error(`${error.message}`);
            throw new HttpException(400, `${error.message}`);
        }
    }
}
