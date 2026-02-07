defmodule Zenvio do
  @moduledoc """
  Zenvio SDK Entry point.
  """

  defstruct [:api_key, :base_url]

  @type t :: %__MODULE__{
          api_key: String.t(),
          base_url: String.t()
        }

  @doc """
  Initializes a new Zenvio client.
  """
  def new(api_key, base_url \\ "https://api.zenvio.com/v1") do
    %__MODULE__{
      api_key: api_key,
      base_url: String.trim_trailing(base_url, "/")
    }
  end

  @doc """
  Internal helper to perform requests.
  """
  def request(client, method, path, body \\ nil, opts \\ []) do
    url = client.base_url <> path

    default_options = [
      method: method,
      url: url,
      auth: {:bearer, client.api_key},
      headers: [{"content-type", "application/json"}, {"user-agent", "Zenvio-Elixir-SDK/0.1.0"}],
      json: body
    ]

    options = Keyword.merge(default_options, opts)

    case Req.request(options) do
      {:ok, %{status: 200, body: body}} ->
        {:ok, body}

      {:ok, %{status: 201, body: body}} ->
        {:ok, body}

      {:ok, %{status: status, body: body}} when status >= 400 ->
        error_msg = 
          case body do
            %{"message" => msg} -> msg
            %{"error" => err} -> err
            _ -> "HTTP Error #{status}"
          end
        {:error, error_msg}

      {:error, reason} ->
        {:error, reason}
    end
  end
end
