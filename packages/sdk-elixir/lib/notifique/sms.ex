defmodule Notifique.Sms do
  @moduledoc """
  SMS — POST /v1/sms/messages, GET /v1/sms/messages/:id, POST /v1/sms/messages/:id/cancel
  """

  def send(client, params, opts \\ []) do
    Notifique.request(client, :post, "/sms/messages", params, opts)
  end

  def get(client, id, opts \\ []) do
    Notifique.request(client, :get, "/sms/messages/#{Notifique.encode_path_segment(id)}", nil, opts)
  end

  def cancel(client, id, opts \\ []) do
    Notifique.request(client, :post, "/sms/messages/#{Notifique.encode_path_segment(id)}/cancel", nil, opts)
  end
end
