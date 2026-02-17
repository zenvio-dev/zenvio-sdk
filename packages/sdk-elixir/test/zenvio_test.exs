defmodule ZenvioTest do
  use ExUnit.Case

  setup do
    client = Zenvio.new("test-key")
    {:ok, client: client}
  end

  test "client initialization", %{client: client} do
    assert client.api_key == "test-key"
    assert client.base_url == "https://api.zenvio.com/v1"
  end

  describe "WhatsApp" do
    test "send_text success", %{client: client} do
      adapter = fn %Req.Request{} = req ->
        assert req.options[:method] == :post
        assert to_string(req.url) =~ "whatsapp/send"
        body = req.options[:json]
        assert body["instance_id"] == "instance-1"
        assert body["payload"]["message"] == "Hello"
        Req.Response.new(status: 200, body: %{"message_ids" => ["msg-123"], "status" => "queued"})
      end

      {:ok, response} = Zenvio.Whatsapp.send_text(client, "instance-1", "5511999999999", "Hello", adapter: adapter)
      assert response["message_ids"] == ["msg-123"]
      assert response["status"] == "queued"
    end

    test "send_text error returns status and body", %{client: client} do
      adapter = fn _req ->
        Req.Response.new(status: 400, body: %{"error" => "Invalid instance"})
      end

      assert {:error, %{status: 400, body: body}} = Zenvio.Whatsapp.send_text(client, "x", "1", "hi", adapter: adapter)
      assert body["error"] == "Invalid instance"
    end

    test "send with params", %{client: client} do
      adapter = fn _req -> Req.Response.new(status: 200, body: %{"message_ids" => ["m1"], "status" => "queued"}) end

      params = %{
        "to" => ["5511888888888"],
        "type" => "text",
        "payload" => %{"message" => "Hi"}
      }

      {:ok, resp} = Zenvio.Whatsapp.send(client, "instance-1", params, adapter: adapter)
      assert resp["message_ids"] == ["m1"]
    end

    test "get_message", %{client: client} do
      adapter = fn %Req.Request{} = req ->
        assert to_string(req.url) =~ "whatsapp/msg-1"
        Req.Response.new(status: 200, body: %{"message_id" => "msg-1", "status" => "delivered"})
      end

      {:ok, status} = Zenvio.Whatsapp.get_message(client, "msg-1", adapter: adapter)
      assert status["message_id"] == "msg-1"
      assert status["status"] == "delivered"
    end

    test "list_instances", %{client: client} do
      adapter = fn _req -> Req.Response.new(status: 200, body: %{"success" => true, "data" => [], "pagination" => %{}}) end
      {:ok, list} = Zenvio.Whatsapp.list_instances(client, %{}, adapter: adapter)
      assert list["success"] == true
    end
  end

  describe "SMS" do
    test "send", %{client: client} do
      adapter = fn %Req.Request{} = req ->
        assert to_string(req.url) =~ "sms/send"
        assert req.options[:json]["to"] == ["5511999999999"]
        Req.Response.new(status: 200, body: %{"success" => true, "data" => %{"sms_ids" => ["sms-1"], "status" => "queued"}})
      end

      {:ok, resp} = Zenvio.Sms.send(client, %{"to" => ["5511999999999"], "message" => "Test"}, adapter: adapter)
      assert resp["data"]["sms_ids"] == ["sms-1"]
    end

    test "get", %{client: client} do
      adapter = fn _req -> Req.Response.new(status: 200, body: %{"success" => true, "data" => %{"sms_id" => "sms-1", "status" => "delivered"}}) end
      {:ok, resp} = Zenvio.Sms.get(client, "sms-1", adapter: adapter)
      assert resp["data"]["sms_id"] == "sms-1"
    end
  end

  describe "Email" do
    test "send", %{client: client} do
      adapter = fn _req ->
        Req.Response.new(status: 200, body: %{"success" => true, "data" => %{"email_ids" => ["email-1"], "status" => "queued"}})
      end

      params = %{"from" => "noreply@example.com", "to" => ["u@example.com"], "subject" => "Test", "text" => "Body"}
      {:ok, resp} = Zenvio.Email.send(client, params, adapter: adapter)
      assert resp["data"]["email_ids"] == ["email-1"]
    end

    test "cancel", %{client: client} do
      adapter = fn _req -> Req.Response.new(status: 200, body: %{"success" => true, "data" => %{"email_id" => "email-1", "status" => "cancelled"}}) end
      {:ok, resp} = Zenvio.Email.cancel(client, "email-1", adapter: adapter)
      assert resp["success"] == true
    end
  end

  describe "Messages" do
    test "send", %{client: client} do
      adapter = fn %Req.Request{} = req ->
        assert to_string(req.url) =~ "templates/send"
        body = req.options[:json]
        assert body["template"] == "welcome"
        assert body["channels"] == ["whatsapp", "sms"]
        Req.Response.new(status: 200, body: %{"success" => true, "data" => %{"message_ids" => ["m1", "m2"], "status" => "queued"}})
      end

      params = %{
        "to" => ["5511999999999"],
        "template" => "welcome",
        "variables" => %{"name" => "User"},
        "channels" => ["whatsapp", "sms"],
        "instance_id" => "inst-1"
      }

      {:ok, resp} = Zenvio.Messages.send(client, params, adapter: adapter)
      assert resp["data"]["message_ids"] == ["m1", "m2"]
    end
  end
end
