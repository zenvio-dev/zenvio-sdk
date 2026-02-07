from typing import List, Optional, Dict, Any, Union, Literal, TypedDict

# 1) MESSAGE TYPES
MessageType = Literal[
    'text',
    'image',
    'document',
    'audio',
    'video',
    'buttons',
    'list',
    'template'
]

# 2) INDIVIDUAL PAYLOADS

class TextPayload(TypedDict):
    text: str

class MediaPayload(TypedDict, total=False):
    url: str
    caption: str
    filename: str

class Button(TypedDict):
    id: str
    label: str

class ButtonsPayload(TypedDict):
    body: str
    buttons: List[Button]

class ListPayload(TypedDict, total=False):
    body: str
    title: str
    sections: List[Any]

class TemplatePayload(TypedDict, total=False):
    key: str           # e.g., "order_on_route"
    language: str      # e.g., "en_US"
    variables: List[str]

# 3) MAP: type (external) -> corresponding payload
# Note: In Python, we use these for type hinting purposes

MessagePayload = Union[
    TextPayload,
    MediaPayload,
    ButtonsPayload,
    ListPayload,
    TemplatePayload
]

# 4) FINAL SEND CONTRACT

class ScheduleParams(TypedDict, total=False):
    sendAt: str    # ISO-8601
    timezone: str  # e.g., "America/Sao_Paulo"

class OptionsParams(TypedDict, total=False):
    priority: Literal['low', 'normal', 'high']
    retryOnFail: bool
    maxRetries: int

class WebhookParams(TypedDict, total=False):
    url: str
    events: List[str]

class SendParams(TypedDict, total=False):
    to: List[str]
    type: MessageType
    payload: MessagePayload
    schedule: ScheduleParams
    metadata: Dict[str, Any]
    options: OptionsParams
    webhook: WebhookParams

class SendResponse(TypedDict, total=False):
    success: bool
    messageId: str
    jobId: str
    error: str
