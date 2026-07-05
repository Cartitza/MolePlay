defmodule MoleViewWeb.GameComponents do
  use Phoenix.Component

  attr :player_colour, :string, required: true

  def player_box(assigns) do
    ~H"""
    <div
      id="local_player"
      phx-hook="PlayerMovement"
      class="relative w-full flex justify-center"
      style="margin-top: -3rem;"
    >
      <div class="flex flex-col items-center gap-1">
        <!-- Player box placeholder -->
        <div
          class="w-12 h-12 rounded-md border-2 border-black-800 shadow-lg"
          style={"background-color: #{@player_colour};"}
        >
        </div>
      </div>
    </div>
    """
  end
end
