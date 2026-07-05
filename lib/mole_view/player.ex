defmodule MoleView.Player do
  @type t :: %__MODULE__{
          name: String.t(),
          hp: pos_integer(),
          colour: String.t()
        }

  defstruct name: nil,
            hp: 100,
            colour: "red"
end
