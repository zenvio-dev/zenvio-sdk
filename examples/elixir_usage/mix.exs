defmodule ZenvioExample.MixProject do
  use Mix.Project

  def project do
    [
      app: :zenvio_example,
      version: "0.1.0",
      elixir: "~> 1.14",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  defp deps do
    [
      {:zenvio, "~> 0.1.0"}
    ]
  end
end
