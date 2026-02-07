"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
// Simple dummy API for demonstration
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/v1/whatsapp/:phoneId/messages', (req, res) => {
    const { phoneId } = req.params;
    const { to, type, payload } = req.body;
    if (!phoneId || !to || !type || !payload) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    // Basic validation based on our rules
    if (type === 'text' && !payload.text) {
        return res.status(400).json({ success: false, error: 'Text payload requires text field' });
    }
    res.json({ success: true, messageId: 'api-msg-999' });
});
describe('Backend API Contract', () => {
    it('should accept a valid request', async () => {
        const response = await (0, supertest_1.default)(app)
            .post('/v1/whatsapp/phone-123/messages')
            .send({
            to: ['5511999999999'],
            type: 'text',
            payload: { text: 'Hello' }
        });
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.messageId).toBe('api-msg-999');
    });
    it('should reject invalid payload for text type', async () => {
        const response = await (0, supertest_1.default)(app)
            .post('/v1/whatsapp/phone-123/messages')
            .send({
            to: ['5511999999999'],
            type: 'text',
            payload: { url: 'http://missing-text' }
        });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });
});
