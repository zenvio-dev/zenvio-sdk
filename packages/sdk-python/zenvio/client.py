"""
Cliente Zenvio — WhatsApp, SMS, Email e envio por template (messages).
Alinhado à API v1 e ao SDK Node.
"""

from typing import Any, Dict, List, Optional, Union

import requests

from .types import (
    WhatsAppCreateInstanceParams,
    WhatsAppCreateInstanceResponse,
    WhatsAppInstanceActionResponse,
    WhatsAppInstanceListParams,
    WhatsAppInstanceListResponse,
    WhatsAppMessageActionResponse,
    WhatsAppMessageStatus,
    WhatsAppSendParams,
    WhatsAppSendResponse,
    EmailCancelResponse,
    EmailSendParams,
    EmailSendResponse,
    EmailStatusResponse,
    MessagesSendParams,
    MessagesSendResponse,
    SmsSendParams,
    SmsSendResponse,
    SmsStatusResponse,
)


def _prepare_email_params(params: Dict[str, Any]) -> Dict[str, Any]:
    """Converte from_address -> from para a API."""
    out = dict(params)
    if "from_address" in out:
        out["from"] = out.pop("from_address")
    return out


def _prepare_messages_params(params: Dict[str, Any]) -> Dict[str, Any]:
    """Converte from_address -> from para a API."""
    out = dict(params)
    if "from_address" in out:
        out["from"] = out.pop("from_address")
    return out


class WhatsAppNamespace:
    """POST/GET/DELETE/PATCH /v1/whatsapp/... e /v1/whatsapp/instances/..."""

    def __init__(self, client: "Zenvio") -> None:
        self._client = client

    def send(
        self,
        instance_id: str,
        params: Union[WhatsAppSendParams, Dict[str, Any]],
    ) -> WhatsAppSendResponse:
        """POST /v1/whatsapp/send — Envia uma ou mais mensagens (1–100 destinatários)."""
        body = dict(params) if isinstance(params, dict) else dict(params)
        body["instance_id"] = instance_id
        return self._client._request("POST", "/whatsapp/send", json=body)

    def send_text(
        self,
        instance_id: str,
        to: Union[str, List[str]],
        text: str,
    ) -> WhatsAppSendResponse:
        """Atalho: envia mensagem de texto (payload.message)."""
        destinations = [to] if isinstance(to, str) else list(to)
        return self.send(
            instance_id,
            {
                "to": destinations,
                "type": "text",
                "payload": {"message": text},
            },
        )

    def get_message(self, message_id: str) -> WhatsAppMessageStatus:
        """GET /v1/whatsapp/:messageId — Status da mensagem."""
        return self._client._request("GET", f"/whatsapp/{message_id}")

    def delete_message(self, message_id: str) -> WhatsAppMessageActionResponse:
        """DELETE /v1/whatsapp/:messageId — Apagar para todos."""
        return self._client._request("DELETE", f"/whatsapp/{message_id}")

    def edit_message(self, message_id: str, text: str) -> WhatsAppMessageActionResponse:
        """PATCH /v1/whatsapp/:messageId/edit — Editar texto."""
        return self._client._request(
            "PATCH", f"/whatsapp/{message_id}/edit", json={"text": text}
        )

    def cancel_message(self, message_id: str) -> WhatsAppMessageActionResponse:
        """POST /v1/whatsapp/:messageId/cancel — Cancelar agendada."""
        return self._client._request("POST", f"/whatsapp/{message_id}/cancel")

    def list_instances(
        self,
        params: Optional[Union[WhatsAppInstanceListParams, Dict[str, str]]] = None,
    ) -> WhatsAppInstanceListResponse:
        """GET /v1/whatsapp/instances — Lista instâncias."""
        return self._client._request(
            "GET", "/whatsapp/instances", params=params or {}
        )

    def get_instance(self, instance_id: str) -> Dict[str, Any]:
        """GET /v1/whatsapp/instances/:id."""
        return self._client._request("GET", f"/whatsapp/instances/{instance_id}")

    def create_instance(
        self,
        params: Union[WhatsAppCreateInstanceParams, Dict[str, str]],
    ) -> WhatsAppCreateInstanceResponse:
        """POST /v1/whatsapp/instances — Cria instância (QR/status)."""
        return self._client._request("POST", "/whatsapp/instances", json=params)

    def disconnect_instance(self, instance_id: str) -> WhatsAppInstanceActionResponse:
        """POST /v1/whatsapp/instances/:id/disconnect."""
        return self._client._request(
            "POST", f"/whatsapp/instances/{instance_id}/disconnect"
        )

    def delete_instance(self, instance_id: str) -> WhatsAppInstanceActionResponse:
        """DELETE /v1/whatsapp/instances/:id (instância não pode estar ACTIVE)."""
        return self._client._request("DELETE", f"/whatsapp/instances/{instance_id}")


class SmsNamespace:
    """POST /v1/sms/send, GET /v1/sms/:id."""

    def __init__(self, client: "Zenvio") -> None:
        self._client = client

    def send(self, params: Union[SmsSendParams, Dict[str, Any]]) -> SmsSendResponse:
        """POST /v1/sms/send — Envia um ou mais SMS (1–100 números)."""
        return self._client._request("POST", "/sms/send", json=params)

    def get(self, sms_id: str) -> SmsStatusResponse:
        """GET /v1/sms/:id — Status do SMS."""
        return self._client._request("GET", f"/sms/{sms_id}")


class EmailNamespace:
    """POST /v1/email/send, GET /v1/email/:id, POST /v1/email/:id/cancel."""

    def __init__(self, client: "Zenvio") -> None:
        self._client = client

    def send(
        self,
        params: Union[EmailSendParams, Dict[str, Any]],
    ) -> EmailSendResponse:
        """POST /v1/email/send — Envia e-mail(s). Use from_address no dict."""
        return self._client._request(
            "POST", "/email/send", json=_prepare_email_params(dict(params))
        )

    def get(self, email_id: str) -> EmailStatusResponse:
        """GET /v1/email/:id — Status do e-mail."""
        return self._client._request("GET", f"/email/{email_id}")

    def cancel(self, email_id: str) -> EmailCancelResponse:
        """POST /v1/email/:id/cancel — Cancela e-mail agendado."""
        return self._client._request("POST", f"/email/{email_id}/cancel")


class MessagesNamespace:
    """POST /v1/templates/send — Envio genérico por template (whatsapp, sms, email)."""

    def __init__(self, client: "Zenvio") -> None:
        self._client = client

    def send(
        self,
        params: Union[MessagesSendParams, Dict[str, Any]],
    ) -> MessagesSendResponse:
        """Envia por template para os canais indicados. Use from_address se canal email."""
        return self._client._request(
            "POST", "/templates/send", json=_prepare_messages_params(dict(params))
        )


class Zenvio:
    """
    Cliente oficial Zenvio para Python.
    - whatsapp: envio, status, editar, apagar, cancelar, instâncias
    - sms: send, get
    - email: send, get, cancel
    - messages: send (template multi-canal)
    """

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.zenvio.com/v1",
    ) -> None:
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.whatsapp = WhatsAppNamespace(self)
        self.sms = SmsNamespace(self)
        self.email = EmailNamespace(self)
        self.messages = MessagesNamespace(self)

    def _request(
        self,
        method: str,
        path: str,
        **kwargs: Any,
    ) -> Any:
        url = f"{self.base_url}{path}"
        headers = kwargs.pop("headers", {})
        headers.update(
            {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "User-Agent": "Zenvio-Python-SDK/0.2.0",
            }
        )
        response = requests.request(method, url, headers=headers, **kwargs)
        response.raise_for_status()
        return response.json()
