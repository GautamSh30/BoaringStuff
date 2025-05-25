import { ConsumerInfo, JsMsg, NatsConnection } from "nats";
export declare abstract class Listener {
    private nc;
    private js;
    private jsm;
    abstract name: string;
    abstract durableName: string;
    abstract onMessage(m: JsMsg): void;
    constructor(nc: NatsConnection);
    init(): Promise<void>;
    createConsumer(): Promise<ConsumerInfo>;
    listen(): Promise<void>;
}
