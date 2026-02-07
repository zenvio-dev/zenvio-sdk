import axios, { AxiosInstance } from 'axios';
import { ZenvioConfig, SendParams, SendResponse, MessageType } from '@zenvio/core';

export * from '@zenvio/core';

export class Zenvio {
    private client: AxiosInstance;
    private config: ZenvioConfig;

    /**
     * WhatsApp-specific methods
     */
    public whatsapp = {
        /**
         * Sends a WhatsApp message
         * @param phoneId The ID of the phone instance to send from
         * @param params Message parameters
         */
        send: async <T extends MessageType>(
            phoneId: string,
            params: SendParams<T>
        ): Promise<SendResponse> => {
            try {
                const response = await this.client.post<SendResponse>(
                    `/whatsapp/${phoneId}/messages`,
                    params
                );
                return response.data;
            } catch (error: any) {
                return this.handleError(error);
            }
        },

        /**
         * Shortcut to send a simple WhatsApp text message
         * @param phoneId The ID of the phone instance to send from
         * @param to Recipient phone number or array of numbers
         * @param text The text message content
         */
        sendText: async (
            phoneId: string,
            to: string | string[],
            text: string
        ): Promise<SendResponse> => {
            return this.whatsapp.send(phoneId, {
                to: Array.isArray(to) ? to : [to],
                type: 'text',
                payload: { text },
            });
        },
    };

    constructor(config: ZenvioConfig) {
        this.config = {
            baseUrl: 'https://api.zenvio.com/v1',
            ...config,
        };

        this.client = axios.create({
            baseURL: this.config.baseUrl,
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
    }

    private handleError(error: any): SendResponse {
        if (axios.isAxiosError(error)) {
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

export default Zenvio;
