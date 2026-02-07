import pytest
import requests_mock
from zenvio import Zenvio

def test_send_text_shortcut():
    with requests_mock.Mocker() as m:
        phone_id = "phone-123"
        api_key = "test-key"
        m.post(
            f"https://api.zenvio.com/v1/whatsapp/{phone_id}/messages",
            json={"success": True, "messageId": "msg-999"},
            status_code=200
        )

        client = Zenvio(api_key=api_key)
        response = client.whatsapp.send_text(phone_id, "5511999999999", "Hello Python!")

        assert response["success"] is True
        assert response["messageId"] == "msg-999"
        
        # Verify request headers and body
        last_request = m.request_history[0]
        assert last_request.headers["Authorization"] == f"Bearer {api_key}"
        assert last_request.json()["type"] == "text"
        assert last_request.json()["payload"]["text"] == "Hello Python!"

def test_send_full_params():
    with requests_mock.Mocker() as m:
        phone_id = "phone-123"
        m.post(
            f"https://api.zenvio.com/v1/whatsapp/{phone_id}/messages",
            json={"success": True, "messageId": "msg-template"},
            status_code=200
        )

        client = Zenvio(api_key="test-key")
        params = {
            "to": ["5511999999999"],
            "type": "template",
            "payload": {
                "key": "welcome",
                "language": "pt_BR",
                "variables": ["Matheus"]
            }
        }
        response = client.whatsapp.send(phone_id, params)

        assert response["success"] is True
        last_body = m.request_history[0].json()
        assert last_body["type"] == "template"
        assert last_body["payload"]["key"] == "welcome"

def test_api_error_handling():
    with requests_mock.Mocker() as m:
        phone_id = "phone-123"
        m.post(
            f"https://api.zenvio.com/v1/whatsapp/{phone_id}/messages",
            json={"message": "Invalid API Key", "success": False},
            status_code=403
        )

        client = Zenvio(api_key="wrong-key")
        response = client.whatsapp.send_text(phone_id, "123", "hi")

        assert response["success"] is False
        assert response["error"] == "Invalid API Key"

def test_send_image():
    with requests_mock.Mocker() as m:
        phone_id = "phone-123"
        m.post(
            f"https://api.zenvio.com/v1/whatsapp/{phone_id}/messages",
            json={"success": True, "messageId": "msg-img"},
            status_code=200
        )

        client = Zenvio(api_key="test-key")
        payload = {
            "url": "https://example.com/test.jpg",
            "caption": "Test Image"
        }
        response = client.whatsapp.send(phone_id, {
            "to": ["5511999999999"],
            "type": "image",
            "payload": payload
        })

        assert response["success"] is True
        assert m.request_history[0].json()["payload"]["url"] == "https://example.com/test.jpg"

def test_send_buttons():
    with requests_mock.Mocker() as m:
        phone_id = "phone-123"
        m.post(
            f"https://api.zenvio.com/v1/whatsapp/{phone_id}/messages",
            json={"success": True, "messageId": "msg-btn"},
            status_code=200
        )

        client = Zenvio(api_key="test-key")
        response = client.whatsapp.send(phone_id, {
            "to": ["5511999999999"],
            "type": "buttons",
            "payload": {
                "body": "Hi",
                "buttons": [{"id": "1", "label": "Opt 1"}]
            }
        })

        assert response["success"] is True
        assert m.request_history[0].json()["type"] == "buttons"

def test_send_media_variants():
    with requests_mock.Mocker() as m:
        phone_id = "phone-123"
        m.post(f"https://api.zenvio.com/v1/whatsapp/{phone_id}/messages", json={"success": True})

        client = Zenvio(api_key="test-key")
        
        # Audio
        client.whatsapp.send(phone_id, {"to": ["1"], "type": "audio", "payload": {"url": "a.mp3"}})
        assert m.request_history[-1].json()["type"] == "audio"

        # Document
        client.whatsapp.send(phone_id, {"to": ["1"], "type": "document", "payload": {"url": "d.pdf"}})
        assert m.request_history[-1].json()["type"] == "document"

        # Video
        client.whatsapp.send(phone_id, {"to": ["1"], "type": "video", "payload": {"url": "v.mp4"}})
        assert m.request_history[-1].json()["type"] == "video"

def test_send_list():
    with requests_mock.Mocker() as m:
        phone_id = "p-1"
        m.post(f"https://api.zenvio.com/v1/whatsapp/{phone_id}/messages", json={"success": True})
        
        client = Zenvio(api_key="k")
        response = client.whatsapp.send(phone_id, {
            "to": ["1"],
            "type": "list",
            "payload": {
                "body": "Select",
                "sections": [{"title": "S1", "rows": [{"id": "r1", "title": "Row 1"}]}]
            }
        })
        
        assert response["success"] is True
        assert m.request_history[0].json()["type"] == "list"
        assert m.request_history[0].json()["payload"]["body"] == "Select"
