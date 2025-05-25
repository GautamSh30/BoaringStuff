import { NatsConnection } from "nats";
export declare abstract class Publisher {
    abstract name: string;
    abstract subject: string[];
    private nc;
    private js;
    private jsm;
    constructor(nc: NatsConnection);
    init(): Promise<void>;
    createStream(): Promise<import("nats").StreamInfo | undefined>;
    publish(publishId: string, data: any): Promise<void>;
}
