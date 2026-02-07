/* =====================================================
   1) MESSAGE TYPES (The "type" field)
   ===================================================== */

export type MessageType =
    | 'text'
    | 'image'
    | 'document'
    | 'audio'
    | 'video'
    | 'buttons'
    | 'list'
    | 'template';

/* =====================================================
   2) INDIVIDUAL PAYLOADS
   ===================================================== */

// ---------- TEXT ----------
export interface TextPayload {
    text: string;
}

// ---------- MEDIA (image, document, audio, video) ----------
export interface MediaPayload {
    url: string;
    caption?: string;
    filename?: string;
}

// ---------- BUTTONS (interactive) ----------
export interface ButtonsPayload {
    body: string;
    buttons: Array<{
        id: string;
        label: string;
    }>;
}

// ---------- LIST (interactive) ----------
export interface ListPayload {
    body: string;
    title?: string;
    sections: any[]; // Specific shape can be refined later
}

// ---------- TEMPLATE (Designed for Meta/Evolution) ----------
export interface TemplatePayload {
    key: string;           // e.g., "order_on_route"
    language: string;      // e.g., "en_US"
    variables?: string[];  // e.g., ["John", "FedEx"]
}

/* =====================================================
   3) MAP: type (external) → corresponding payload
   ===================================================== */

export type MessagePayloadByType = {
    text: TextPayload;
    image: MediaPayload;
    document: MediaPayload;
    audio: MediaPayload;
    video: MediaPayload;
    buttons: ButtonsPayload;
    list: ListPayload;
    template: TemplatePayload;
};

/* =====================================================
   4) FINAL SEND CONTRACT
   ===================================================== */

export interface SendParams<T extends MessageType = MessageType> {
    /** Recipients (same content for all) */
    to: string[];

    /**
     * OUTER TYPE (SOURCE OF TRUTH)
     * → Determines WHICH payload is valid.
     */
    type: T;

    /**
     * PAYLOAD:
     * MUST correspond exactly to the `type` above.
     */
    payload: MessagePayloadByType[T];

    /** Optional scheduling */
    schedule?: {
        /** ISO-8601 format */
        sendAt: string;
        /** e.g., "America/Sao_Paulo" */
        timezone?: string;
    };

    /** Correlation / tracking data */
    metadata?: Record<string, any>;

    /** Processing options */
    options?: {
        priority?: 'low' | 'normal' | 'high';
        retryOnFail?: boolean;
        maxRetries?: number;
    };

    /**
     * Optional per-message webhook.
     * If omitted, uses the default Workspace webhook.
     */
    webhook?: {
        url: string;
        events?: string[];
    };
}

/* =====================================================
   5) EXPLICIT RULES (Encoded in Types)
   ===================================================== */

export interface ZenvioConfig {
    apiKey: string;
    baseUrl?: string;
}

export interface SendResponse {
    success: boolean;
    messageId?: string;
    jobId?: string;
    error?: string;
}
