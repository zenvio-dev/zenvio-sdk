"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const src_1 = require("../src");
jest.mock('axios');
const mockedAxios = axios_1.default;
describe('Node.js SDK', () => {
    let zenvio;
    beforeEach(() => {
        mockedAxios.create.mockReturnValue(mockedAxios);
        mockedAxios.isAxiosError.mockImplementation((payload) => !!payload?.isAxiosError);
        zenvio = new src_1.Zenvio({ apiKey: 'test-api-key' });
    });
    it('should send a whatsapp message correctly', async () => {
        const mockResponse = { data: { success: true, messageId: 'msg-123' } };
        mockedAxios.post.mockResolvedValueOnce(mockResponse);
        const result = await zenvio.whatsapp.send('phone-abc', {
            to: ['5511999999999'],
            type: 'text',
            payload: { text: 'Test message' }
        });
        expect(mockedAxios.post).toHaveBeenCalledWith('/whatsapp/phone-abc/messages', expect.objectContaining({
            type: 'text',
            payload: { text: 'Test message' }
        }));
        expect(result.success).toBe(true);
        expect(result.messageId).toBe('msg-123');
    });
    it('should send a simple text message via sendText shortcut', async () => {
        const mockResponse = { data: { success: true, messageId: 'msg-shortcut' } };
        mockedAxios.post.mockResolvedValueOnce(mockResponse);
        const result = await zenvio.whatsapp.sendText('phone-abc', '5511999999999', 'Shortcut test');
        expect(mockedAxios.post).toHaveBeenCalledWith('/whatsapp/phone-abc/messages', expect.objectContaining({
            to: ['5511999999999'],
            type: 'text',
            payload: { text: 'Shortcut test' }
        }));
        expect(result.success).toBe(true);
        expect(result.messageId).toBe('msg-shortcut');
    });
    it('should handle API errors gracefully', async () => {
        mockedAxios.post.mockRejectedValueOnce({
            isAxiosError: true,
            response: { data: { message: 'Invalid API Key' } }
        });
        const result = await zenvio.whatsapp.send('phone-abc', {
            to: ['5511999999999'],
            type: 'text',
            payload: { text: 'Test' }
        });
        expect(result.success).toBe(false);
        expect(result.error).toBe('Invalid API Key');
    });
});
