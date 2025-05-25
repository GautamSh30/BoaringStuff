"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
const nats_1 = require("nats");
class Listener {
    constructor(nc) {
        this.nc = nc;
        this.js = nc.jetstream();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.jsm = yield this.nc.jetstreamManager();
        });
    }
    createConsumer() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jsm.consumers.info(this.name, this.durableName);
            }
            catch (e) {
                if (e.code === "404") {
                    return yield this.jsm.consumers.add(this.name, {
                        deliver_policy: nats_1.DeliverPolicy.All,
                        durable_name: this.durableName,
                        ack_policy: nats_1.AckPolicy.Explicit,
                    });
                }
                throw e;
            }
        });
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            yield this.init();
            const con = yield this.createConsumer();
            const c = yield this.js.consumers.get(this.name, con.name);
            const iter = yield c.fetch();
            try {
                try {
                    for (var _d = true, iter_1 = __asyncValues(iter), iter_1_1; iter_1_1 = yield iter_1.next(), _a = iter_1_1.done, !_a; _d = true) {
                        _c = iter_1_1.value;
                        _d = false;
                        const m = _c;
                        try {
                            this.onMessage(m);
                            m.ack();
                        }
                        catch (e) {
                            console.error("Error processing message:", e);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = iter_1.return)) yield _b.call(iter_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (e) {
                if (e.name === "AbortError") {
                    console.log("Listener stopped gracefully.");
                }
                else {
                    console.error("Error in message fetch loop:", e);
                }
            }
        });
    }
}
exports.Listener = Listener;
