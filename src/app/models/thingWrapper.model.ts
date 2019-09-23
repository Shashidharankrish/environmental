import { Thing } from './thing.model';

export class ThingWrapper {
    total: number;
    offset: number;
    limit: number;
    things: Thing[];
}
