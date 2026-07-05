defmodule MoleViewWeb.PageController do
  use MoleViewWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
