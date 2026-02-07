import requests
from typing import Optional, List, Union, Any
from .types import SendParams, SendResponse, MessageType, TextPayload

class WhatsAppNamespace:
    def __init__(self, client: 'Zenvio'):
        self._client = client

    def send(self, phone_id: str, params: SendParams) -> SendResponse:
        """
        Sends a WhatsApp message
        :param phone_id: The ID of the phone instance to send from
        :param params: Message parameters
        :return: SendResponse dictionary
        """
        url = f"/whatsapp/{phone_id}/messages"
        return self._client._request("POST", url, json=params)

    def send_text(self, phone_id: str, to: Union[str, List[str]], text: str) -> SendResponse:
        """
        Shortcut to send a simple WhatsApp text message
        :param phone_id: The ID of the phone instance to send from
        :param to: Recipient phone number or list of numbers
        :param text: The text message content
        :return: SendResponse dictionary
        """
        destinations = [to] if isinstance(to, str) else to
        params: SendParams = {
            "to": destinations,
            "type": "text",
            "payload": {"text": text}
        }
        return self.send(phone_id, params)

class Zenvio:
    def __init__(self, api_key: str, base_url: str = "https://api.zenvio.com/v1"):
        """
        Initialize the Zenvio SDK client
        :param api_key: Your Zenvio API Key
        :param base_url: Optional base URL for the API
        """
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.whatsapp = WhatsAppNamespace(self)

    def _request(self, method: str, path: str, **kwargs) -> SendResponse:
        url = f"{self.base_url}{path}"
        headers = kwargs.pop("headers", {})
        headers.update({
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": "Zenvio-Python-SDK/0.1.0"
        })

        try:
            response = requests.request(method, url, headers=headers, **kwargs)
            # Try to return JSON or handle error
            if response.status_code >= 400:
                try:
                    error_data = response.json()
                    return {
                        "success": False,
                        "error": error_data.get("message") or error_data.get("error") or response.reason
                    }
                except ValueError:
                    return {
                        "success": False,
                        "error": response.reason
                    }
            
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": str(e)
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"An unexpected error occurred: {str(e)}"
            }
