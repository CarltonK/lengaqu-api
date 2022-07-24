import LogService from './log_service';

export default class StoreService extends LogService {

    async storeLiveCheck(id: string) {
        return id;
    }
}