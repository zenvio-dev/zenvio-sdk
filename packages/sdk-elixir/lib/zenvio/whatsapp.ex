defmodule Zenvio.Whatsapp do
  @moduledoc """
  WhatsApp namespace for Zenvio SDK.
  """

  @doc """
  Sends a WhatsApp message.
  """
  def send(client, phone_id, params, opts \\ []) do
    Zenvio.request(client, :post, "/whatsapp/#{phone_id}/messages", params, opts)
  end

  @doc """
  Shortcut to send a simple WhatsApp text message.
  """
  def send_text(client, phone_id, to, text, opts \\ []) do
    to = if is_list(to), do: to, else: [to]

    params = %{
      "to" => to,
      "type" => "text",
      "payload" => %{"text" => text}
    }

    send(client, phone_id, params, opts)
  end

  @doc """
  Shortcut to send a WhatsApp image message.
  """
  def send_image(client, phone_id, to, url, caption \\ nil, opts \\ []) do
    to = if is_list(to), do: to, else: [to]

    params = %{
      "to" => to,
      "type" => "image",
      "payload" => %{"url" => url, "caption" => caption}
    }

    send(client, phone_id, params, opts)
  end
end
