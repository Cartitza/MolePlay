defmodule MoleView.Player do
  @type t :: %__MODULE__{
          name: String.t(),
          hp: pos_integer(),
          colour: String.t(),
          posX: float(),
          posY: float(),
          id: pos_integer(),
          has_weapon: boolean()
        }

  defstruct name: "Pablo",
            hp: 100,
            colour: "red",
            posX: 0,
            posY: 0,
            id: 1,
            has_weapon: false
end
