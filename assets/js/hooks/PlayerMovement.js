const PlayerMovement = {
  mounted() {
    this.box = this.el.querySelector(".w-12.h-12");

    // Walk up to the full-width container (absolute bottom-16 w-full)
    const container = this.el.closest("[class*='bottom-16'][class*='w-full']")
                      || this.el.parentElement.parentElement;

    this.keys = {};

    // Read initial X from the data attribute instead of parsing calc()
    this.updatedX = parseFloat(this.el.dataset.posX) || 0;
    this.updatedY = 0;

    this.el.style.left = `calc(50% + ${this.updatedX}px)`;

    this.velocityY = 0;
    this.isOnGround = true;
    this.lastPushedBottom = 0;

    const GRAVITY = 0.5;
    const JUMP_FORCE = -12;
    const GROUND = 0;
    const PUSH_THRESHOLD = 2;

    this._onKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if (!this.keys[k]) this.keys[k] = true;
    };
    this._onKeyUp = (e) => (this.keys[e.key.toLowerCase()] = false);

    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);

    this.loop = setInterval(() => {
      const containerWidth = container.offsetWidth;
      const boxWidth = this.box.offsetWidth;
      const rightBound = containerWidth / 2 - boxWidth;
      const leftBound = -(containerWidth / 2);

      // --- Horizontal ---
      if (this.keys["a"]) {
        const next = Math.max(leftBound, this.updatedX - 5);
        this.updatedX = next;
        this.el.style.left = `calc(50% + ${next}px)`;
        this.pushEvent("move", { direction: "left", new_pos: [next, this.updatedY] });
      }
      if (this.keys["d"]) {
        const next = Math.min(rightBound, this.updatedX + 5);
        this.updatedX = next;
        this.el.style.left = `calc(50% + ${next}px)`;
        this.pushEvent("move", { direction: "right", new_pos: [next, this.updatedY] });
      }

      // --- Jump ---
      if (this.keys[" "] && this.isOnGround) {
        this.velocityY = JUMP_FORCE;
        this.isOnGround = false;
      }

      // --- Vertical physics ---
      if (!this.isOnGround) {
        this.velocityY += GRAVITY;
        const nextBottom = this.updatedY - this.velocityY;

        if (nextBottom <= GROUND) {
          this.el.style.bottom = GROUND + "px";
          this.velocityY = 0;
          this.isOnGround = true;
          this.lastPushedBottom = 0;
          this.updatedY = 0;
          this.pushEvent("move", { direction: "vertical", new_pos: [this.updatedX, 0] });
        } else {
          this.el.style.bottom = nextBottom + "px";
          this.updatedY = nextBottom;

          if (Math.abs(nextBottom - this.lastPushedBottom) >= PUSH_THRESHOLD) {
            this.lastPushedBottom = nextBottom;
            this.pushEvent("move", { direction: "vertical", new_pos: [this.updatedX, nextBottom] });
          }
        }
      }
    }, 16);
  },

  destroyed() {
    clearInterval(this.loop);
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("keyup", this._onKeyUp);
  },
};

export default PlayerMovement;
