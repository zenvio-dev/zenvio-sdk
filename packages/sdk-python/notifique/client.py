"""
Cliente Notifique — WhatsApp, SMS, Email, Push e envio por template (messages).
Alinhado à API v1 (api.notifique.dev).
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Union
from urllib.parse import quote, urlparse

import requests

from .types import (
    CancelPushResponse,
    CreateEmailDomainRequest,
    CreateEmailDomainResponse,
    EmailCancelResponse,
    EmailSendParams,
    EmailSendResponse,
    EmailStatusResponse,
    GetEmailDomainResponse,
    ListEmailDomainsResponse,
    MessagesSendParams,
    MessagesSendResponse,
    PushAppCreateRequest,
    PushAppListResponse,
    PushAppSingleResponse,
    PushAppUpdateRequest,
    PushDeviceListResponse,
    PushDeviceRegisterRequest,
    PushDeviceSingleResponse,
    PushMessageListResponse,
    PushMessageSingleResponse,
    SendPushParams,
    SendPushResponse,
    SmsCancelResponse,
    SmsSendParams,
    SmsSendResponse,
    SmsStatusResponse,
    VerifyEmailDomainResponse,
    WhatsAppCreateInstanceParams,
    WhatsAppCreateInstanceResponse,
    WhatsAppInstanceActionResponse,
    WhatsAppInstanceListParams,
    WhatsAppInstanceListResponse,
    WhatsAppInstanceQrResponse,
    WhatsAppListMessagesParams,
    WhatsAppListMessagesResponse,
    WhatsAppMessageActionResponse,
    WhatsAppMessageStatus,
    WhatsAppSendParams,
    WhatsAppSendResponse,
)


class NotifiqueApiError(Exception):
    """Raised for Notifique API errors (4xx / 5xx).

    Attributes:
        status_code: HTTP status code returned by the API.
        response_data: Parsed JSON response body, if available.
    """

    def __init__(
        self,
        message: str,
        status_code: int,
        *,
        response_data: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.response_data = response_data or {}


# ---------------------------------------------------------------------------
# Key-remapping helpers (no unnecessary copies)
# ---------------------------------------------------------------------------

_EMAIL_KEY_MAP: Dict[str, str] = {"from_address": "from"}
_MESSAGES_KEY_MAP: Dict[str, str] = {"from_address": "from", "instance_id": "instanceId"}


def _remap_keys(params: Dict[str, Any], key_map: Dict[str, str]) -> Dict[str, Any]:
    """Return *params* with keys renamed per *key_map*.

    Only allocates a new dict when a rename is actually needed; otherwise
    returns the original object unchanged.
    """
    if not any(k in params for k in key_map):
        return params
    return {key_map.get(k, k): v for k, v in params.items()}


# ---------------------------------------------------------------------------
# Namespace classes
# ---------------------------------------------------------------------------


class WhatsAppNamespace:
    """Wraps POST/GET/DELETE/PATCH /v1/whatsapp/messages and /v1/whatsapp/instances."""

    def __init__(self, client: Notifique) -> None:
        self._client = client

    def send(
        self,
        instance_id: str,
        params: Union[WhatsAppSendParams, Dict[str, Any]],
    ) -> Any:
        """POST /v1/whatsapp/messages — Send one or more messages (1–100 recipients).

        Args:
            instance_id: WhatsApp instance ID (added to the request body as ``instanceId``).
            params: Message parameters. ``to``, ``type``, and ``payload`` are required.
        """
        body = dict(params)
        body["instanceId"] = instance_id
        return self._client._request("POST", "/whatsapp/messages", json=body)

    def send_text(
        self,
        instance_id: str,
        to: Union[str, List[str]],
        text: str,
    ) -> Any:
        """Shortcut: send a text message (``payload.message``).

        Args:
            instance_id: WhatsApp instance ID.
            to: E.164 phone number or list of numbers (1–100).
            text: Message text.
        """
        destinations = [to] if isinstance(to, str) else list(to)
        return self.send(
            instance_id,
            {"to": destinations, "type": "text", "payload": {"message": text}},
        )

    def list_messages(
        self,
        params: Optional[Union[WhatsAppListMessagesParams, Dict[str, str]]] = None,
    ) -> WhatsAppListMessagesResponse:
        """GET /v1/whatsapp/messages — List messages with pagination."""
        return self._client._request("GET", "/whatsapp/messages", params=params or {})

    def get_message(self, message_id: str) -> Any:
        """GET /v1/whatsapp/messages/:messageId — Message status (returns ``success``/``data`` envelope)."""
        return self._client._request("GET", f"/whatsapp/messages/{self._client._path_segment(message_id)}")

    def delete_message(self, message_id: str) -> WhatsAppMessageActionResponse:
        """DELETE /v1/whatsapp/messages/:messageId — Delete message for everyone."""
        return self._client._request("DELETE", f"/whatsapp/messages/{self._client._path_segment(message_id)}")

    def edit_message(self, message_id: str, text: str) -> WhatsAppMessageActionResponse:
        """PATCH /v1/whatsapp/messages/:messageId/edit — Edit message text."""
        return self._client._request(
            "PATCH", f"/whatsapp/messages/{self._client._path_segment(message_id)}/edit", json={"text": text}
        )

    def cancel_message(self, message_id: str) -> WhatsAppMessageActionResponse:
        """POST /v1/whatsapp/messages/:messageId/cancel — Cancel scheduled message."""
        return self._client._request("POST", f"/whatsapp/messages/{self._client._path_segment(message_id)}/cancel")

    def list_instances(
        self,
        params: Optional[Union[WhatsAppInstanceListParams, Dict[str, str]]] = None,
    ) -> WhatsAppInstanceListResponse:
        """GET /v1/whatsapp/instances — List instances."""
        return self._client._request("GET", "/whatsapp/instances", params=params or {})

    def get_instance(self, instance_id: str) -> Dict[str, Any]:
        """GET /v1/whatsapp/instances/:id."""
        return self._client._request("GET", f"/whatsapp/instances/{self._client._path_segment(instance_id)}")

    def get_instance_qr(self, instance_id: str) -> WhatsAppInstanceQrResponse:
        """GET /v1/whatsapp/instances/:id/qr — Current QR code."""
        return self._client._request("GET", f"/whatsapp/instances/{self._client._path_segment(instance_id)}/qr")

    def create_instance(
        self,
        params: Union[WhatsAppCreateInstanceParams, Dict[str, str]],
    ) -> WhatsAppCreateInstanceResponse:
        """POST /v1/whatsapp/instances — Create instance (returns QR / status)."""
        return self._client._request("POST", "/whatsapp/instances", json=params)

    def disconnect_instance(self, instance_id: str) -> WhatsAppInstanceActionResponse:
        """POST /v1/whatsapp/instances/:id/disconnect."""
        return self._client._request(
            "POST", f"/whatsapp/instances/{self._client._path_segment(instance_id)}/disconnect"
        )

    def delete_instance(self, instance_id: str) -> WhatsAppInstanceActionResponse:
        """DELETE /v1/whatsapp/instances/:id (instance must not be ACTIVE)."""
        return self._client._request("DELETE", f"/whatsapp/instances/{self._client._path_segment(instance_id)}")


class SmsNamespace:
    """Wraps POST /v1/sms/messages, GET /v1/sms/messages/:id, POST cancel."""

    def __init__(self, client: Notifique) -> None:
        self._client = client

    def send(self, params: Union[SmsSendParams, Dict[str, Any]]) -> SmsSendResponse:
        """POST /v1/sms/messages — Send one or more SMS (1–100 numbers)."""
        return self._client._request("POST", "/sms/messages", json=params)

    def get(self, sms_id: str) -> SmsStatusResponse:
        """GET /v1/sms/messages/:id — SMS status."""
        return self._client._request("GET", f"/sms/messages/{self._client._path_segment(sms_id)}")

    def cancel(self, sms_id: str) -> SmsCancelResponse:
        """POST /v1/sms/messages/:id/cancel — Cancel scheduled SMS (status SCHEDULED)."""
        return self._client._request("POST", f"/sms/messages/{self._client._path_segment(sms_id)}/cancel")


class EmailNamespace:
    """Wraps POST /v1/email/messages, GET status, POST cancel, and email domains."""

    def __init__(self, client: Notifique) -> None:
        self._client = client
        self.domains = EmailDomainsNamespace(client)

    def send(
        self,
        params: Union[EmailSendParams, Dict[str, Any]],
    ) -> EmailSendResponse:
        """POST /v1/email/messages — Send email(s).

        Use ``from`` as the sender key.  The alias ``from_address`` is also
        accepted and will be translated automatically.
        """
        return self._client._request(
            "POST", "/email/messages", json=_remap_keys(dict(params), _EMAIL_KEY_MAP)
        )

    def get(self, email_id: str) -> EmailStatusResponse:
        """GET /v1/email/messages/:id — Email status."""
        return self._client._request("GET", f"/email/messages/{self._client._path_segment(email_id)}")

    def cancel(self, email_id: str) -> EmailCancelResponse:
        """POST /v1/email/messages/:id/cancel — Cancel scheduled email."""
        return self._client._request("POST", f"/email/messages/{self._client._path_segment(email_id)}/cancel")


class EmailDomainsNamespace:
    """Wraps GET/POST /v1/email/domains, GET /:id, POST /:id/verify."""

    def __init__(self, client: Notifique) -> None:
        self._client = client

    def list(self) -> ListEmailDomainsResponse:
        """GET /v1/email/domains — List email domains."""
        return self._client._request("GET", "/email/domains")

    def create(
        self,
        params: Union[CreateEmailDomainRequest, Dict[str, str]],
    ) -> CreateEmailDomainResponse:
        """POST /v1/email/domains — Register domain for verification."""
        return self._client._request("POST", "/email/domains", json=params)

    def get(self, domain_id: str) -> GetEmailDomainResponse:
        """GET /v1/email/domains/:id."""
        return self._client._request("GET", f"/email/domains/{self._client._path_segment(domain_id)}")

    def verify(self, domain_id: str) -> VerifyEmailDomainResponse:
        """POST /v1/email/domains/:id/verify — Verify domain (DNS check)."""
        return self._client._request("POST", f"/email/domains/{self._client._path_segment(domain_id)}/verify")


class MessagesNamespace:
    """Wraps POST /v1/templates/send — multi-channel template send."""

    def __init__(self, client: Notifique) -> None:
        self._client = client

    def send(
        self,
        params: Union[MessagesSendParams, Dict[str, Any]],
    ) -> MessagesSendResponse:
        """POST /v1/templates/send — Send via template across channels (whatsapp, sms, email).

        Use ``from_address`` or ``from`` for the email sender; use ``instance_id`` or
        ``instanceId`` for the WhatsApp instance.
        """
        return self._client._request(
            "POST", "/templates/send", json=_remap_keys(dict(params), _MESSAGES_KEY_MAP)
        )


class PushAppsNamespace:
    """Wraps GET/POST /v1/push/apps, GET/PUT/DELETE /v1/push/apps/:id."""

    def __init__(self, client: Notifique) -> None:
        self._client = client

    def list(self, params: Optional[Dict[str, Any]] = None) -> PushAppListResponse:
        """GET /v1/push/apps."""
        return self._client._request("GET", "/push/apps", params=params or {})

    def get(self, app_id: str) -> PushAppSingleResponse:
        """GET /v1/push/apps/:id."""
        return self._client._request("GET", f"/push/apps/{self._client._path_segment(app_id)}")

    def create(
        self,
        params: Union[PushAppCreateRequest, Dict[str, str]],
    ) -> PushAppSingleResponse:
        """POST /v1/push/apps."""
        return self._client._request("POST", "/push/apps", json=params)

    def update(
        self,
        app_id: str,
        params: Union[PushAppUpdateRequest, Dict[str, Any]],
    ) -> PushAppSingleResponse:
        """PUT /v1/push/apps/:id."""
        return self._client._request("PUT", f"/push/apps/{self._client._path_segment(app_id)}", json=params)

    def delete(self, app_id: str) -> Dict[str, Any]:
        """DELETE /v1/push/apps/:id."""
        return self._client._request("DELETE", f"/push/apps/{self._client._path_segment(app_id)}")


class PushDevicesNamespace:
    """Wraps POST/GET /v1/push/devices, GET/DELETE /v1/push/devices/:id."""

    def __init__(self, client: Notifique) -> None:
        self._client = client

    def register(
        self,
        params: Union[PushDeviceRegisterRequest, Dict[str, Any]],
    ) -> PushDeviceSingleResponse:
        """POST /v1/push/devices — Register a device/subscription."""
        return self._client._request("POST", "/push/devices", json=params)

    def list(self, params: Optional[Dict[str, Any]] = None) -> PushDeviceListResponse:
        """GET /v1/push/devices."""
        return self._client._request("GET", "/push/devices", params=params or {})

    def get(self, device_id: str) -> PushDeviceSingleResponse:
        """GET /v1/push/devices/:id."""
        return self._client._request("GET", f"/push/devices/{self._client._path_segment(device_id)}")

    def delete(self, device_id: str) -> Dict[str, Any]:
        """DELETE /v1/push/devices/:id."""
        return self._client._request("DELETE", f"/push/devices/{self._client._path_segment(device_id)}")


class PushMessagesNamespace:
    """Wraps POST/GET /v1/push/messages, GET /:id, POST /:id/cancel."""

    def __init__(self, client: Notifique) -> None:
        self._client = client

    def send(
        self,
        params: Union[SendPushParams, Dict[str, Any]],
    ) -> SendPushResponse:
        """POST /v1/push/messages — Send push notifications."""
        return self._client._request("POST", "/push/messages", json=params)

    def list(self, params: Optional[Dict[str, Any]] = None) -> PushMessageListResponse:
        """GET /v1/push/messages."""
        return self._client._request("GET", "/push/messages", params=params or {})

    def get(self, message_id: str) -> PushMessageSingleResponse:
        """GET /v1/push/messages/:id."""
        return self._client._request("GET", f"/push/messages/{self._client._path_segment(message_id)}")

    def cancel(self, message_id: str) -> CancelPushResponse:
        """POST /v1/push/messages/:id/cancel."""
        return self._client._request("POST", f"/push/messages/{self._client._path_segment(message_id)}/cancel")


class PushNamespace:
    """Push API: apps, devices, messages sub-namespaces."""

    def __init__(self, client: Notifique) -> None:
        self.apps = PushAppsNamespace(client)
        self.devices = PushDevicesNamespace(client)
        self.messages = PushMessagesNamespace(client)


# ---------------------------------------------------------------------------
# Main client
# ---------------------------------------------------------------------------


class Notifique:
    """Official Notifique Python client.

    Example::

        from notifique import Notifique

        client = Notifique(api_key="your-api-key")
        client.whatsapp.send_text("instance-id", "5511999999999", "Hello!")

    Namespaces:
        - ``whatsapp``: send, list, status, edit, delete, cancel, instances, QR
        - ``sms``: send, get, cancel
        - ``email``: send, get, cancel; ``email.domains``: list, create, get, verify
        - ``push``: ``push.apps``, ``push.devices``, ``push.messages``
        - ``messages``: multi-channel template send

    Args:
        api_key: Notifique API key. Must be a non-empty string.
        base_url: API base URL. Defaults to ``https://api.notifique.dev/v1``.
        timeout: Request timeout in seconds. Defaults to 30.

    Raises:
        ValueError: If ``api_key`` is empty or not a string.
    """

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.notifique.dev/v1",
        timeout: int = 30,
    ) -> None:
        if not isinstance(api_key, str) or not api_key.strip():
            raise ValueError("api_key must be a non-empty string")
        parsed = urlparse(base_url)
        if parsed.scheme != "https" or not parsed.netloc:
            raise ValueError("base_url must be an absolute HTTPS URL")
        self._base_url = base_url.rstrip("/")
        self._timeout = timeout
        self._session = requests.Session()
        self._session.headers.update(
            {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "Notifique-Python-SDK/0.2.0",
            }
        )
        self.whatsapp = WhatsAppNamespace(self)
        self.sms = SmsNamespace(self)
        self.email = EmailNamespace(self)
        self.messages = MessagesNamespace(self)
        self.push = PushNamespace(self)

    @staticmethod
    def _path_segment(value: str) -> str:
        return quote(str(value), safe="")

    def close(self) -> None:
        self._session.close()

    def __enter__(self) -> "Notifique":
        return self

    def __exit__(self, exc_type: Any, exc: Any, tb: Any) -> None:
        self.close()

    def _request(
        self,
        method: str,
        path: str,
        **kwargs: Any,
    ) -> Any:
        url = f"{self._base_url}{path}"
        kwargs.setdefault("timeout", self._timeout)
        response = self._session.request(method, url, **kwargs)
        if not response.ok:
            try:
                data: Any = response.json()
            except Exception:
                data = {}
            if isinstance(data, dict):
                msg: str = data.get("message") if isinstance(data.get("message"), str) else (response.reason or str(response.status_code))  # type: ignore[assignment]
                details = data.get("details") if isinstance(data.get("details"), list) else None
                if details:
                    parts = [
                        f"{d.get('field', '')}: {d.get('message', '')}".strip()
                        for d in details
                        if isinstance(d, dict)
                    ]
                    if parts:
                        msg = f"{msg} ({'; '.join(parts)})"
            else:
                msg = response.reason or str(response.status_code)
                data = {}
            raise NotifiqueApiError(msg, response.status_code, response_data=data if isinstance(data, dict) else None)
        return response.json()
