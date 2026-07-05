defmodule MoleView.Repo do
  use Ecto.Repo,
    otp_app: :mole_view,
    adapter: Ecto.Adapters.Postgres
end
