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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
class Publisher {
    constructor(nc) {
        this.nc = nc;
        this.js = nc.jetstream();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.jsm = yield this.nc.jetstreamManager();
        });
    }
    createStream() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            try {
                return yield this.jsm.streams.info(this.name);
            }
            catch (e) {
                if (e.code === "404") {
                    return yield this.jsm.streams.add({
                        name: this.name,
                        subjects: this.subject
                    });
                }
            }
        });
    }
    publish(publishId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.createStream();
                yield this.js.publish(publishId, Buffer.from(JSON.stringify(data)));
            }
            catch (error) {
                console.error('Publishing error:', error);
                throw error;
            }
        });
    }
}
exports.Publisher = Publisher;
