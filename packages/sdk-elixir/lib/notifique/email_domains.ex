defmodule Notifique.EmailDomains do
  @moduledoc """
  Email Domains — GET/POST /v1/email/domains, GET /v1/email/domains/:id, POST /v1/email/domains/:id/verify
  """

  def list(client, opts \\ []) do
    Notifique.request(client, :get, "/email/domains", nil, opts)
  end

  def create(client, params, opts \\ []) do
    Notifique.request(client, :post, "/email/domains", params, opts)
  end

  def get(client, id, opts \\ []) do
    Notifique.request(client, :get, "/email/domains/#{Notifique.encode_path_segment(id)}", nil, opts)
  end

  def verify(client, id, opts \\ []) do
    Notifique.request(client, :post, "/email/domains/#{Notifique.encode_path_segment(id)}/verify", nil, opts)
  end
end
