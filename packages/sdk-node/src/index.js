"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zenvio = void 0;
const axios_1 = __importDefault(require("axios"));
__exportStar(require("@zenvio/core"), exports);
class Zenvio {
    client;
    config;
    /**
     * WhatsApp-specific methods
     */
    whatsapp = {
        /**
         * Sends a WhatsApp message
         * @param phoneId The ID of the phone instance to send from
         * @param params Message parameters
         */
        send: async (phoneId, params) => {
            try {
                const response = await this.client.post(`/whatsapp/${phoneId}/messages`, params);
                return response.data;
            }
            catch (error) {
                return this.handleError(error);
            }
        },
        /**
         * Shortcut to send a simple WhatsApp text message
         * @param phoneId The ID of the phone instance to send from
         * @param to Recipient phone number or array of numbers
         * @param text The text message content
         */
        sendText: async (phoneId, to, text) => {
            return this.whatsapp.send(phoneId, {
                to: Array.isArray(to) ? to : [to],
                type: 'text',
                payload: { text },
            });
        },
    };
    constructor(config) {
        this.config = {
            baseUrl: 'https://api.zenvio.com/v1',
            ...config,
        };
        this.client = axios_1.default.create({
            baseURL: this.config.baseUrl,
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
    }
    handleError(error) {
        if (axios_1.default.isAxiosError(error)) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
            };
        }
        return {
            success: false,
            error: error.message || 'Unknown error occurred',
        };
    }
}
exports.Zenvio = Zenvio;
exports.default = Zenvio;
