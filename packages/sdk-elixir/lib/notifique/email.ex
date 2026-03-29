defmodule Notifique.Email do
  @moduledoc """
  Email — POST /v1/email/messages, GET /v1/email/messages/:id, POST cancel + domains
  """

  def send(client, params, opts \\ []) do
    Notifique.request(client, :post, "/email/messages", params, opts)
  end

  def get(client, id, opts \\ []) do
    Notifique.request(client, :get, "/email/messages/#{Notifique.encode_path_segment(id)}", nil, opts)
  end

  def cancel(client, id, opts \\ []) do
    Notifique.request(client, :post, "/email/messages/#{Notifique.encode_path_segment(id)}/cancel", nil, opts)
  end
end
