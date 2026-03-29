"""Testes do SDK Python — alinhados à API v1 (Notifique)."""

import pytest
import requests
import requests_mock
from notifique import Notifique

BASE_URL = "https://api.notifique.dev/v1"


# ----- WhatsApp -----

def test_whatsapp_send_uses_post_whatsapp_send_with_instance_id_in_body():
    with requests_mock.Mocker() as m:
        m.post(
            f"{BASE_URL}/whatsapp/messages",
            json={"success": True, "data": {"messageIds": ["msg-1"], "status": "QUEUED"}},
            status_code=202,
        )
        client = Notifique(api_key="test-key")
        result = client.whatsapp.send(
            "instance-abc",
            {
                "to": ["5511999999999"],
                "type": "text",
                "payload": {"message": "Hello"},
            },
        )
        assert result["data"]["messageIds"] == ["msg-1"]
        assert result["data"]["status"] == "QUEUED"
        body = m.request_history[0].json()
        assert body["instanceId"] == "instance-abc"
        assert body["payload"]["message"] == "Hello"


def test_whatsapp_send_text():
    with requests_mock.Mocker() as m:
        m.post(
            f"{BASE_URL}/whatsapp/messages",
            json={"success": True, "data": {"messageIds": ["m1"], "status": "QUEUED"}},
            status_code=202,
        )
        client = Notifique(api_key="test-key")
        result = client.whatsapp.send_text("inst-1", "5511999999999", "Hi")
        assert result["data"]["status"] == "QUEUED"
        body = m.request_history[0].json()
        assert body["payload"]["message"] == "Hi"
        assert body["to"] == ["5511999999999"]


def test_whatsapp_get_message():
    with requests_mock.Mocker() as m:
        m.get(
            f"{BASE_URL}/whatsapp/messages/msg-1",
            json={
                "success": True,
                "data": {
                    "messageId": "msg-1",
                    "to": "5511999999999",
                    "type": "text",
                    "status": "SENT",
                    "createdAt": "2025-01-01T12:00:00Z",
                },
            },
        )
        client = Notifique(api_key="test-key")
        result = client.whatsapp.get_message("msg-1")
        assert result["data"]["messageId"] == "msg-1"
        assert result["data"]["status"] == "SENT"


def test_whatsapp_delete_and_cancel():
    """OpenAPI MessageActionResponse: envelope { success, data: { messageId, status } } com status em MAIÚSCULO."""
    with requests_mock.Mocker() as m:
        m.delete(
            "https://api.notifique.dev/v1/whatsapp/messages/msg-1",
            json={"success": True, "data": {"messageId": "msg-1", "status": "DELETED"}},
        )
        m.post(
            "https://api.notifique.dev/v1/whatsapp/messages/msg-2/cancel",
            json={"success": True, "data": {"messageId": "msg-2", "status": "CANCELLED"}},
        )
        client = Notifique(api_key="test-key")
        r1 = client.whatsapp.delete_message("msg-1")
        assert r1["success"] is True
        assert r1["data"]["messageId"] == "msg-1"
        assert r1["data"]["status"] == "DELETED"
        r2 = client.whatsapp.cancel_message("msg-2")
        assert r2["success"] is True
        assert r2["data"]["status"] == "CANCELLED"


def test_whatsapp_instances_list_and_get():
    with requests_mock.Mocker() as m:
        m.get(
            "https://api.notifique.dev/v1/whatsapp/instances",
            json={
                "success": True,
                "data": [{"id": "i1", "name": "My", "status": "ACTIVE"}],
                "pagination": {"total": 1, "page": 1, "limit": 10, "totalPages": 1},
            },
        )
        m.get(
            "https://api.notifique.dev/v1/whatsapp/instances/i1",
            json={"success": True, "data": {"id": "i1", "name": "My", "status": "ACTIVE"}},
        )
        client = Notifique(api_key="test-key")
        list_res = client.whatsapp.list_instances()
        assert len(list_res["data"]) == 1
        get_res = client.whatsapp.get_instance("i1")
        assert get_res["data"]["id"] == "i1"


# ----- SMS -----

def test_sms_send():
    with requests_mock.Mocker() as m:
        m.post(
            "https://api.notifique.dev/v1/sms/messages",
            json={
                "success": True,
                "data": {"status": "QUEUED", "count": 1, "smsIds": ["sms-1"]},
            },
            status_code=202,
        )
        client = Notifique(api_key="test-key")
        result = client.sms.send({"to": ["5511999999999"], "message": "Olá!"})
        assert result["success"] is True
        assert result["data"]["smsIds"] == ["sms-1"]
        assert m.request_history[0].json()["message"] == "Olá!"


def test_sms_get():
    with requests_mock.Mocker() as m:
        m.get(
            f"{BASE_URL}/sms/messages/sms-1",
            json={
                "success": True,
                "data": {
                    "smsId": "sms-1",
                    "to": "5511999999999",
                    "status": "DELIVERED",
                    "createdAt": "2025-01-01T12:00:00Z",
                },
            },
        )
        client = Notifique(api_key="test-key")
        result = client.sms.get("sms-1")
        assert result["data"]["smsId"] == "sms-1"
        assert result["data"]["status"] == "DELIVERED"


def test_sms_cancel():
    with requests_mock.Mocker() as m:
        m.post(
            f"{BASE_URL}/sms/messages/sms-1/cancel",
            json={
                "success": True,
                "data": {"smsId": "sms-1", "status": "CANCELLED"},
            },
            status_code=200,
        )
        client = Notifique(api_key="test-key")
        result = client.sms.cancel("sms-1")
        assert result["success"] is True
        assert result["data"]["smsId"] == "sms-1"
        assert result["data"]["status"] == "CANCELLED"


# ----- Email -----

def test_email_send():
    with requests_mock.Mocker() as m:
        m.post(
            "https://api.notifique.dev/v1/email/messages",
            json={
                "success": True,
                "data": {"emailIds": ["em-1"], "status": "QUEUED", "count": 1},
            },
            status_code=202,
        )
        client = Notifique(api_key="test-key")
        result = client.email.send({
            "from_address": "noreply@example.com",
            "to": ["user@example.com"],
            "subject": "Test",
            "html": "<p>Hi</p>",
        })
        assert result["data"]["emailIds"] == ["em-1"]
        body = m.request_history[0].json()
        assert body["from"] == "noreply@example.com"


def test_email_get_and_cancel():
    with requests_mock.Mocker() as m:
        m.get(
            f"{BASE_URL}/email/messages/em-1",
            json={
                "success": True,
                "data": {"id": "em-1", "status": "SENT", "to": "u@x.com"},
            },
        )
        m.post(
            f"{BASE_URL}/email/messages/em-1/cancel",
            json={"success": True, "data": {"emailId": "em-1", "status": "CANCELLED"}},
        )
        client = Notifique(api_key="test-key")
        r1 = client.email.get("em-1")
        assert r1["data"]["id"] == "em-1"
        r2 = client.email.cancel("em-1")
        assert r2["data"]["status"] == "CANCELLED"


# ----- Email Domains -----

def test_email_domains_list_create_get_verify():
    with requests_mock.Mocker() as m:
        m.get(
            f"{BASE_URL}/email/domains",
            json={
                "success": True,
                "data": [
                    {"id": "d1", "domain": "example.com", "status": "VERIFIED", "dnsRecords": [], "verifiedAt": "2025-01-01T12:00:00Z", "createdAt": "2025-01-01T10:00:00Z"},
                ],
            },
        )
        m.post(
            f"{BASE_URL}/email/domains",
            json={
                "success": True,
                "data": {"id": "d2", "domain": "new.com", "status": "PENDING", "dnsRecords": [{"type": "TXT", "name": "_dmarc.new.com", "value": "v=DMARC1"}], "createdAt": "2025-01-01T10:00:00Z"},
                "message": "Add the DNS record(s) above, then call verify.",
            },
        )
        m.get(
            f"{BASE_URL}/email/domains/d1",
            json={"success": True, "data": {"id": "d1", "domain": "example.com", "status": "VERIFIED", "verifiedAt": "2025-01-01T12:00:00Z", "createdAt": "2025-01-01T10:00:00Z", "updatedAt": "2025-01-01T12:00:00Z"}},
        )
        m.post(
            f"{BASE_URL}/email/domains/d2/verify",
            json={"success": True, "data": {"id": "d2", "domain": "new.com", "status": "VERIFIED"}, "verified": True},
        )
        client = Notifique(api_key="test-key")
        list_res = client.email.domains.list()
        assert list_res["success"] is True
        assert len(list_res["data"]) == 1
        assert list_res["data"][0]["status"] == "VERIFIED"
        create_res = client.email.domains.create({"domain": "new.com"})
        assert create_res["data"]["status"] == "PENDING"
        get_res = client.email.domains.get("d1")
        assert get_res["data"]["id"] == "d1"
        verify_res = client.email.domains.verify("d2")
        assert verify_res["verified"] is True


# ----- Push -----

def test_push_apps_list_get_create_update_delete():
    with requests_mock.Mocker() as m:
        m.get(
            f"{BASE_URL}/push/apps",
            json={"success": True, "data": [{"id": "app1", "name": "My App", "workspaceId": "w1", "createdAt": "2025-01-01T10:00:00Z", "updatedAt": "2025-01-01T10:00:00Z"}], "pagination": {"total": 1, "page": 1, "limit": 20, "totalPages": 1}},
        )
        m.get(
            f"{BASE_URL}/push/apps/app1",
            json={"success": True, "data": {"id": "app1", "name": "My App", "workspaceId": "w1", "createdAt": "2025-01-01T10:00:00Z", "updatedAt": "2025-01-01T10:00:00Z"}},
        )
        m.post(
            f"{BASE_URL}/push/apps",
            json={"success": True, "data": {"id": "app2", "name": "New App", "workspaceId": "w1", "createdAt": "2025-01-01T10:00:00Z", "updatedAt": "2025-01-01T10:00:00Z"}},
        )
        m.put(
            f"{BASE_URL}/push/apps/app2",
            json={"success": True, "data": {"id": "app2", "name": "Updated", "workspaceId": "w1", "createdAt": "2025-01-01T10:00:00Z", "updatedAt": "2025-01-01T11:00:00Z"}},
        )
        m.delete(f"{BASE_URL}/push/apps/app2", json={"success": True})
        client = Notifique(api_key="test-key")
        list_res = client.push.apps.list()
        assert list_res["success"] is True
        assert len(list_res["data"]) == 1
        get_res = client.push.apps.get("app1")
        assert get_res["data"]["id"] == "app1"
        create_res = client.push.apps.create({"name": "New App"})
        assert create_res["data"]["name"] == "New App"
        update_res = client.push.apps.update("app2", {"name": "Updated"})
        assert update_res["data"]["name"] == "Updated"
        del_res = client.push.apps.delete("app2")
        assert del_res["success"] is True


def test_push_messages_send_list_get_cancel():
    with requests_mock.Mocker() as m:
        m.post(
            f"{BASE_URL}/push/messages",
            json={"success": True, "data": {"status": "QUEUED", "count": 1, "pushIds": ["push-1"]}},
            status_code=202,
        )
        m.get(
            f"{BASE_URL}/push/messages",
            json={"success": True, "data": [{"id": "push-1", "deviceId": "dev1", "title": "Hi", "body": "Body", "status": "SENT", "createdAt": "2025-01-01T10:00:00Z"}], "pagination": {"total": 1, "page": 1, "limit": 20, "totalPages": 1}},
        )
        m.get(
            f"{BASE_URL}/push/messages/push-1",
            json={"success": True, "data": {"id": "push-1", "deviceId": "dev1", "title": "Hi", "body": "Body", "status": "DELIVERED", "createdAt": "2025-01-01T10:00:00Z"}},
        )
        m.post(
            f"{BASE_URL}/push/messages/push-1/cancel",
            json={"success": True, "data": {"pushId": "push-1", "status": "CANCELLED"}},
        )
        client = Notifique(api_key="test-key")
        send_res = client.push.messages.send({"to": ["dev1"], "title": "Hi", "body": "Body"})
        assert send_res["data"]["status"] == "QUEUED"
        assert send_res["data"]["pushIds"] == ["push-1"]
        list_res = client.push.messages.list()
        assert len(list_res["data"]) == 1
        get_res = client.push.messages.get("push-1")
        assert get_res["data"]["status"] == "DELIVERED"
        cancel_res = client.push.messages.cancel("push-1")
        assert cancel_res["data"]["status"] == "CANCELLED"


# ----- Messages (template) -----

def test_messages_send():
    with requests_mock.Mocker() as m:
        m.post(
            "https://api.notifique.dev/v1/templates/send",
            json={
                "success": True,
                "data": {
                    "messageIds": ["msg-1"],
                    "smsIds": ["sms-1"],
                    "emailIds": ["em-1"],
                    "status": "QUEUED",
                    "count": 3,
                },
            },
            status_code=202,
        )
        client = Notifique(api_key="test-key")
        result = client.messages.send({
            "to": ["5511999999999", "user@example.com"],
            "template": "welcome",
            "variables": {"name": "Trial", "credits": 300},
            "channels": ["whatsapp", "sms", "email"],
            "instanceId": "inst-1",
            "from": "noreply@example.com",
        })
        assert result["data"]["status"] == "QUEUED"
        assert result["data"]["count"] == 3
        body = m.request_history[0].json()
        assert body["template"] == "welcome"
        assert body["channels"] == ["whatsapp", "sms", "email"]
        assert body["from"] == "noreply@example.com"
        assert body["instanceId"] == "inst-1"


# ----- Errors -----

def test_api_error_raises_notifique_error():
    """4xx/5xx responses raise NotifiqueApiError, not requests.HTTPError."""
    from notifique import NotifiqueApiError
    with requests_mock.Mocker() as m:
        m.post(
            f"{BASE_URL}/whatsapp/messages",
            json={"message": "Invalid API Key", "success": False},
            status_code=401,
        )
        client = Notifique(api_key="wrong-key")
        with pytest.raises(NotifiqueApiError) as exc_info:
            client.whatsapp.send("inst", {"to": ["1"], "type": "text", "payload": {"message": "x"}})
        assert exc_info.value.status_code == 401
        assert "Invalid API Key" in str(exc_info.value)


def test_api_error_with_details():
    """Details array is concatenated into the error message."""
    from notifique import NotifiqueApiError
    with requests_mock.Mocker() as m:
        m.post(
            f"{BASE_URL}/sms/messages",
            json={
                "message": "Validation error",
                "success": False,
                "details": [
                    {"field": "to", "message": "must be E.164 format"},
                    {"field": "message", "message": "too long"},
                ],
            },
            status_code=422,
        )
        client = Notifique(api_key="test-key")
        with pytest.raises(NotifiqueApiError) as exc_info:
            client.sms.send({"to": ["not-a-number"], "message": "x" * 200})
        assert exc_info.value.status_code == 422
        assert "to:" in str(exc_info.value)


def test_constructor_validates_api_key():
    """Empty or missing api_key raises ValueError at construction time."""
    with pytest.raises(ValueError):
        Notifique(api_key="")
    with pytest.raises(ValueError):
        Notifique(api_key="   ")
    with pytest.raises((ValueError, TypeError)):
        Notifique(api_key=None)  # type: ignore


def test_constructor_rejects_non_https_base_url():
    with pytest.raises(ValueError):
        Notifique(api_key="key", base_url="http://localhost:3000/v1")
