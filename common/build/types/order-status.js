"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Created"] = "created";
    OrderStatus["AwaitingPayment"] = "awaiting:payment";
    OrderStatus["Cancelled"] = "cancelled";
    OrderStatus["Completed"] = "completed";
})(OrderStatus || (OrderStatus = {}));
exports.default = OrderStatus;
