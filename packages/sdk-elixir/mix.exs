defmodule Zenvio.MixProject do
  use Mix.Project

  @version "0.1.0"

  def project do
    [
      app: :zenvio,
      version: @version,
      elixir: "~> 1.14",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      description: "Official Zenvio SDK for Elixir",
      package: package()
    ]
  end

  def application do
    [
      extra_applications: [:logger]
    ]
  end

  defp deps do
    [
      {:req, "~> 0.4.0"},
      {:jason, "~> 1.4"},
      {:ex_doc, ">= 0.0.0", runtime: false}
    ]
  end

  defp package do
    [
      licenses: ["MIT"],
      links: %{"GitHub" => "https://github.com/zenvio/zenvio-sdk"}
    ]
  end
end
