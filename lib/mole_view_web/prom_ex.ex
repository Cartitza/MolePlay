defmodule MoleViewWeb.PromEx do
  use PromEx, otp_app: :mole_view

  @impl true
  def plugins do
    [
      PromEx.Plugins.Beam,
      {PromEx.Plugins.Phoenix, router: MoleViewWeb.Router, endpoint: MoleViewWeb.Endpoint}
    ]
  end
end
