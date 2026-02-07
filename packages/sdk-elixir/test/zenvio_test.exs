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

  test "send_text success", %{client: client} do
    adapter = fn %Req.Request{} = req ->
      assert req.method == :post
      assert req.url.path == "/whatsapp/phone-123/messages"
      Req.Response.new(status: 200, body: %{"success" => true, "messageId" => "elixir-1"})
    end

    {:ok, response} = Zenvio.Whatsapp.send_text(client, "phone-123", "5511999999999", "Text", adapter: adapter)
    assert response["success"] == true
  end

  test "send_image success", %{client: client} do
    adapter = fn %Req.Request{} = req ->
      assert req.body =~ "image"
      Req.Response.new(status: 200, body: %{"success" => true})
    end

    {:ok, response} = Zenvio.Whatsapp.send_image(client, "p", "123", "http://i.png", "Cap", adapter: adapter)
    assert response["success"] == true
  end

  test "send generic template", %{client: client} do
    adapter = fn _req -> Req.Response.new(status: 200, body: %{"success" => true}) end

    params = %{
      "to" => ["123"],
      "type" => "template",
      "payload" => %{"key" => "k", "language" => "en"}
    }
    {:ok, response} = Zenvio.Whatsapp.send(client, "p", params, adapter: adapter)
    assert response["success"] == true
  end

  test "api error handling", %{client: client} do
    adapter = fn _req -> Req.Response.new(status: 400, body: %{"error" => "Bad Request"}) end
    assert {:error, "Bad Request"} = Zenvio.Whatsapp.send_text(client, "p", "1", "hi", adapter: adapter)
  end
end
