"""Testes do SDK Python — alinhados à API v1."""

import pytest
import requests
import requests_mock
from zenvio import Zenvio


# ----- WhatsApp -----

def test_whatsapp_send_uses_post_whatsapp_send_with_instance_id_in_body():
    with requests_mock.Mocker() as m:
        m.post(
            "https://api.zenvio.com/v1/whatsapp/send",
            json={"message_ids": ["msg-1"], "status": "queued"},
            status_code=202,
        )
        client = Zenvio(api_key="test-key")
        result = client.whatsapp.send(
            "instance-abc",
            {
                "to": ["5511999999999"],
                "type": "text",
                "payload": {"message": "Hello"},
            },
        )
        assert result["message_ids"] == ["msg-1"]
        assert result["status"] == "queued"
        body = m.request_history[0].json()
        assert body["instance_id"] == "instance-abc"
        assert body["payload"]["message"] == "Hello"


def test_whatsapp_send_text():
    with requests_mock.Mocker() as m:
        m.post(
            "https://api.zenvio.com/v1/whatsapp/send",
            json={"message_ids": ["m1"], "status": "queued"},
            status_code=202,
        )
        client = Zenvio(api_key="test-key")
        result = client.whatsapp.send_text("inst-1", "5511999999999", "Hi")
        assert result["status"] == "queued"
        body = m.request_history[0].json()
        assert body["payload"]["message"] == "Hi"
        assert body["to"] == ["5511999999999"]


def test_whatsapp_get_message():
    with requests_mock.Mocker() as m:
        m.get(
            "https://api.zenvio.com/v1/whatsapp/msg-1",
            json={
                "message_id": "msg-1",
                "to": "5511999999999",
                "type": "text",
                "status": "sent",
                "created_at": "2025-01-01T12:00:00Z",
            },
        )
        client = Zenvio(api_key="test-key")
        result = client.whatsapp.get_message("msg-1")
        assert result["message_id"] == "msg-1"
        assert result["status"] == "sent"


def test_whatsapp_delete_and_cancel():
    with requests_mock.Mocker() as m:
        m.delete(
            "https://api.zenvio.com/v1/whatsapp/msg-1",
            json={"success": True, "message_ids": ["msg-1"], "status": "deleted"},
        )
        m.post(
            "https://api.zenvio.com/v1/whatsapp/msg-2/cancel",
            json={"success": True, "message_ids": ["msg-2"], "status": "cancelled"},
        )
        client = Zenvio(api_key="test-key")
        r1 = client.whatsapp.delete_message("msg-1")
        assert r1["status"] == "deleted"
        r2 = client.whatsapp.cancel_message("msg-2")
        assert r2["status"] == "cancelled"


def test_whatsapp_instances_list_and_get():
    with requests_mock.Mocker() as m:
        m.get(
            "https://api.zenvio.com/v1/whatsapp/instances",
            json={
                "success": True,
                "data": [{"id": "i1", "name": "My", "status": "ACTIVE"}],
                "pagination": {"total": 1, "page": 1, "limit": 10, "totalPages": 1},
            },
        )
        m.get(
            "https://api.zenvio.com/v1/whatsapp/instances/i1",
            json={"success": True, "data": {"id": "i1", "name": "My", "status": "ACTIVE"}},
        )
        client = Zenvio(api_key="test-key")
        list_res = client.whatsapp.list_instances()
        assert len(list_res["data"]) == 1
        get_res = client.whatsapp.get_instance("i1")
        assert get_res["data"]["id"] == "i1"


# ----- SMS -----

def test_sms_send():
    with requests_mock.Mocker() as m:
        m.post(
            "https://api.zenvio.com/v1/sms/send",
            json={
                "success": True,
                "data": {"status": "queued", "count": 1, "sms_ids": ["sms-1"]},
            },
            status_code=202,
        )
        client = Zenvio(api_key="test-key")
        result = client.sms.send({"to": ["5511999999999"], "message": "Olá!"})
        assert result["success"] is True
        assert result["data"]["sms_ids"] == ["sms-1"]
        assert m.request_history[0].json()["message"] == "Olá!"


def test_sms_get():
    with requests_mock.Mocker() as m:
        m.get(
            "https://api.zenvio.com/v1/sms/sms-1",
            json={
                "success": True,
                "data": {
                    "sms_id": "sms-1",
                    "to": "5511999999999",
                    "status": "DELIVERED",
                    "created_at": "2025-01-01T12:00:00Z",
                },
            },
        )
        client = Zenvio(api_key="test-key")
        result = client.sms.get("sms-1")
        assert result["data"]["sms_id"] == "sms-1"
        assert result["data"]["status"] == "DELIVERED"


def test_sms_cancel():
    with requests_mock.Mocker() as m:
        m.post(
            "https://api.zenvio.com/v1/sms/sms-1/cancel",
            json={
                "success": True,
                "data": {"sms_id": "sms-1", "status": "cancelled"},
            },
            status_code=200,
        )
        client = Zenvio(api_key="test-key")
        result = client.sms.cancel("sms-1")
        assert result["success"] is True
        assert result["data"]["sms_id"] == "sms-1"
        assert result["data"]["status"] == "cancelled"


# ----- Email -----

def test_email_send():
    with requests_mock.Mocker() as m:
        m.post(
            "https://api.zenvio.com/v1/email/send",
            json={
                "success": True,
                "data": {"email_ids": ["em-1"], "status": "queued", "count": 1},
            },
            status_code=202,
        )
        client = Zenvio(api_key="test-key")
        result = client.email.send({
            "from_address": "noreply@example.com",
            "to": ["user@example.com"],
            "subject": "Test",
            "html": "<p>Hi</p>",
        })
        assert result["data"]["email_ids"] == ["em-1"]
        body = m.request_history[0].json()
        assert body["from"] == "noreply@example.com"


def test_email_get_and_cancel():
    with requests_mock.Mocker() as m:
        m.get(
            "https://api.zenvio.com/v1/email/em-1",
            json={
                "success": True,
                "data": {"id": "em-1", "status": "SENT", "to": "u@x.com"},
            },
        )
        m.post(
            "https://api.zenvio.com/v1/email/em-1/cancel",
            json={"success": True, "data": {"email_id": "em-1", "status": "cancelled"}},
        )
        client = Zenvio(api_key="test-key")
        r1 = client.email.get("em-1")
        assert r1["data"]["id"] == "em-1"
        r2 = client.email.cancel("em-1")
        assert r2["data"]["status"] == "cancelled"


# ----- Messages (template) -----

def test_messages_send():
    with requests_mock.Mocker() as m:
        m.post(
            "https://api.zenvio.com/v1/templates/send",
            json={
                "success": True,
                "data": {
                    "message_ids": ["msg-1"],
                    "sms_ids": ["sms-1"],
                    "email_ids": ["em-1"],
                    "status": "queued",
                    "count": 3,
                },
            },
            status_code=202,
        )
        client = Zenvio(api_key="test-key")
        result = client.messages.send({
            "to": ["5511999999999", "user@example.com"],
            "template": "welcome",
            "variables": {"name": "Trial", "credits": 300},
            "channels": ["whatsapp", "sms", "email"],
            "instance_id": "inst-1",
            "from_address": "noreply@example.com",
        })
        assert result["data"]["status"] == "queued"
        assert result["data"]["count"] == 3
        body = m.request_history[0].json()
        assert body["template"] == "welcome"
        assert body["channels"] == ["whatsapp", "sms", "email"]
        assert body["from"] == "noreply@example.com"


# ----- Errors -----

def test_api_error_raises():
    with requests_mock.Mocker() as m:
        m.post(
            "https://api.zenvio.com/v1/whatsapp/send",
            json={"message": "Invalid API Key", "success": False},
            status_code=401,
        )
        client = Zenvio(api_key="wrong-key")
        with pytest.raises(requests.HTTPError) as exc_info:
            client.whatsapp.send("inst", {"to": ["1"], "type": "text", "payload": {"message": "x"}})
        assert exc_info.value.response.status_code == 401
