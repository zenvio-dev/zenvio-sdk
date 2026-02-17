"""
Tipos da API Zenvio — alinhados aos endpoints e ao SDK Node.
Uso: type hints e validação; todos os request/response estão tipados.
"""

from typing import Any, Dict, List, Literal, Optional, TypedDict, Union

# ---------------------------------------------------------------------------
# WhatsApp
# ---------------------------------------------------------------------------

WhatsAppMessageType = Literal[
    "text", "image", "video", "audio", "document", "location", "contact"
]

# Payloads por tipo (API usa message para text, media_url para mídia)
class TextPayload(TypedDict):
    message: str


class MediaPayload(TypedDict):
    media_url: str


class LocationPayload(TypedDict):
    latitude: float
    longitude: float


class ContactPayload(TypedDict):
    vcard: Union[str, Dict[str, Any]]


class WhatsAppSchedule(TypedDict, total=False):
    sendAt: str  # ISO 8601


class WhatsAppOptions(TypedDict, total=False):
    priority: Literal["high", "normal", "low"]
    maxRetries: int  # 0-5


# Params para POST /v1/whatsapp/send (instance_id no body)
class WhatsAppSendParams(TypedDict, total=False):
    instance_id: str
    to: List[str]
    type: WhatsAppMessageType
    payload: Union[TextPayload, MediaPayload, LocationPayload, ContactPayload]
    schedule: WhatsAppSchedule
    options: WhatsAppOptions


class WhatsAppSendResponse(TypedDict, total=False):
    message_ids: List[str]
    status: Literal["queued", "scheduled"]
    scheduled_at: Optional[str]


class WhatsAppMessageStatus(TypedDict, total=False):
    message_id: str
    to: str
    type: str
    status: str
    scheduled_at: Optional[str]
    sent_at: Optional[str]
    delivered_at: Optional[str]
    read_at: Optional[str]
    failed_at: Optional[str]
    error_message: Optional[str]
    external_id: Optional[str]
    created_at: str


class WhatsAppMessageActionResponse(TypedDict, total=False):
    success: bool
    message_ids: List[str]
    status: Literal["deleted", "edited", "cancelled"]


class WhatsAppInstance(TypedDict, total=False):
    id: str
    name: str
    phoneNumber: Optional[str]
    status: str
    createdAt: str
    updatedAt: str


class WhatsAppInstanceListParams(TypedDict, total=False):
    page: str
    limit: str
    status: str
    search: str


class WhatsAppInstanceListResponse(TypedDict, total=False):
    success: bool
    data: List[WhatsAppInstance]
    pagination: Dict[str, int]


class WhatsAppCreateInstanceParams(TypedDict):
    name: str


class WhatsAppCreateInstanceResponse(TypedDict, total=False):
    success: bool
    data: Dict[str, Any]  # instance + evolution


class WhatsAppInstanceActionResponse(TypedDict, total=False):
    success: bool
    data: Dict[str, str]
    message: str


# ---------------------------------------------------------------------------
# SMS
# ---------------------------------------------------------------------------

class SmsSchedule(TypedDict, total=False):
    sendAt: str


class SmsOptions(TypedDict, total=False):
    priority: Literal["high", "normal", "low"]


class SmsSendParams(TypedDict, total=False):
    to: List[str]
    message: str
    schedule: SmsSchedule
    options: SmsOptions


class SmsSendResponse(TypedDict, total=False):
    success: bool
    data: Dict[str, Any]  # status, count, sms_ids, scheduled_at?


class SmsStatus(TypedDict, total=False):
    sms_id: str
    to: str
    message: str
    status: str
    provider: Optional[str]
    external_id: Optional[str]
    sent_at: Optional[str]
    delivered_at: Optional[str]
    failed_at: Optional[str]
    scheduled_for: Optional[str]
    error_message: Optional[str]
    created_at: str


class SmsStatusResponse(TypedDict, total=False):
    success: bool
    data: SmsStatus


# ---------------------------------------------------------------------------
# Email
# ---------------------------------------------------------------------------

class EmailSchedule(TypedDict, total=False):
    sendAt: str


class EmailOptions(TypedDict, total=False):
    priority: Literal["high", "normal", "low"]


class EmailSendParams(TypedDict, total=False):
    """Use 'from_address' para o remetente (enviado como 'from' na API)."""
    from_address: str
    fromName: str
    to: List[str]
    subject: str
    text: str
    html: str
    schedule: EmailSchedule
    options: EmailOptions


class EmailSendResponse(TypedDict, total=False):
    success: bool
    data: Dict[str, Any]  # email_ids, status, count, scheduled_at?


class EmailStatus(TypedDict, total=False):
    id: str
    to: str
    from_: str
    fromName: Optional[str]
    subject: str
    status: str
    externalId: Optional[str]
    scheduledFor: Optional[str]
    sentAt: Optional[str]
    deliveredAt: Optional[str]
    failedAt: Optional[str]
    errorMessage: Optional[str]
    createdAt: str


class EmailStatusResponse(TypedDict, total=False):
    success: bool
    data: EmailStatus


class EmailCancelResponse(TypedDict, total=False):
    success: bool
    data: Dict[str, str]  # email_id, status


# ---------------------------------------------------------------------------
# Messages (template) — envio genérico multi-canal
# ---------------------------------------------------------------------------

TemplateChannel = Literal["whatsapp", "sms", "email"]


class MessagesSendParams(TypedDict, total=False):
    """Use 'from_address' para o remetente em canal email (enviado como 'from' na API)."""
    to: List[str]
    template: str
    variables: Dict[str, Union[str, int]]
    channels: List[TemplateChannel]
    instance_id: str
    from_address: str
    fromName: str


class MessagesSendResponse(TypedDict, total=False):
    success: bool
    data: Dict[str, Any]  # message_ids?, sms_ids?, email_ids?, status, count
