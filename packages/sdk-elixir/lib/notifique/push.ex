defmodule Notifique.Push do
  @moduledoc """
  Push API — apps, devices, messages
  """

  def list_apps(client, params \\ %{}, opts \\ []) do
    query = URI.encode_query(params)
    path = if query == "", do: "/push/apps", else: "/push/apps?#{query}"
    Notifique.request(client, :get, path, nil, opts)
  end

  def get_app(client, id, opts \\ []) do
    Notifique.request(client, :get, "/push/apps/#{Notifique.encode_path_segment(id)}", nil, opts)
  end

  def create_app(client, params, opts \\ []) do
    Notifique.request(client, :post, "/push/apps", params, opts)
  end

  def update_app(client, id, params, opts \\ []) do
    Notifique.request(client, :put, "/push/apps/#{Notifique.encode_path_segment(id)}", params, opts)
  end

  def delete_app(client, id, opts \\ []) do
    Notifique.request(client, :delete, "/push/apps/#{Notifique.encode_path_segment(id)}", nil, opts)
  end

  def register_device(client, params, opts \\ []) do
    Notifique.request(client, :post, "/push/devices", params, opts)
  end

  def list_devices(client, params \\ %{}, opts \\ []) do
    query = URI.encode_query(params)
    path = if query == "", do: "/push/devices", else: "/push/devices?#{query}"
    Notifique.request(client, :get, path, nil, opts)
  end

  def get_device(client, id, opts \\ []) do
    Notifique.request(client, :get, "/push/devices/#{Notifique.encode_path_segment(id)}", nil, opts)
  end

  def delete_device(client, id, opts \\ []) do
    Notifique.request(client, :delete, "/push/devices/#{Notifique.encode_path_segment(id)}", nil, opts)
  end

  def send_message(client, params, opts \\ []) do
    Notifique.request(client, :post, "/push/messages", params, opts)
  end

  def list_messages(client, params \\ %{}, opts \\ []) do
    query = URI.encode_query(params)
    path = if query == "", do: "/push/messages", else: "/push/messages?#{query}"
    Notifique.request(client, :get, path, nil, opts)
  end

  def get_message(client, id, opts \\ []) do
    Notifique.request(client, :get, "/push/messages/#{Notifique.encode_path_segment(id)}", nil, opts)
  end

  def cancel_message(client, id, opts \\ []) do
    Notifique.request(client, :post, "/push/messages/#{Notifique.encode_path_segment(id)}/cancel", nil, opts)
  end
end
