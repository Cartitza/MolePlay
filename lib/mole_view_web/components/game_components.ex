defmodule MoleViewWeb.GameComponents do
  use Phoenix.Component

  attr :player_colour, :string, required: true
  attr :player_posX, :float, required: true

  def player_box(assigns) do
    ~H"""
    <div
      id="local_player"
      phx-hook="PlayerMovement"
      class="absolute bottom-0"
      data-pos-x={@player_posX}
    >
      <div
        class="w-12 h-12 rounded-md border-2 border-black-800 shadow-lg"
        style={"background-color: #{@player_colour};"}
      >
      </div>
    </div>
    """
  end

  attr :player, :map, required: true

  def remote_player_box(assigns) do
    ~H"""
    <div
      class="absolute bottom-0"
      style={"left: calc(50% + #{@player.posX}px)"}
    >
      <div
        class="w-12 h-12 rounded-md border-2 border-black-800 shadow-lg"
        style={"background-color: #{@player.colour};"}
      >
      </div>
    </div>
    """
  end
end
