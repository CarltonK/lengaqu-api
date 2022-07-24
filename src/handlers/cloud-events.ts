import HttpException from '../helpers/exceptions';
import { logger } from '../middlewares/logger';
import PubSubService from '../services/pubsub_service';

export default class CloudEventsHandler {
    private data: Record<string, any> = {};
    private pubSubService: PubSubService;
    private events: Array<string>;

    constructor(events: any = null) {
        this.events = events;
        this.pubSubService = new PubSubService();
    }

    public addData(event: string, data: Record<string, any>): void {
        try {
            Object.assign(this.data, data);
        } catch (err) {
            logger('CLOUD-EVENTS').error(`${err}`);
        }
    }

    async fire(events: Array<string> = []): Promise<void> {
        const cloudEvents = Array.isArray(events) && events.length > 0 ? events : this.events;

        try {
            // Publish to PubSub
            await this.pubSubService.publishMessage({
                events: cloudEvents,
                data: this.data,
                timestamp: new Date(),
            });
        } catch (error: any) {
            logger('CLOUD-EVENTS').error(`${error}`);
            throw new HttpException(400, `${error.message}`);
        }
    }

    /*
     * const cloudEventsHelper = new CloudEventsHandler(['EVENT_NAME_IN_SMALL_CAPS']);
     * cloudEventsHelper.addData('EVENT_NAME_IN_SMALL_CAPS', {});
     * cloudEventsHelper.fire(undefined);
     */
}