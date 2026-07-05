// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//
// If you have dependencies that try to import CSS, esbuild will generate a separate `app.css` file.
// To load it, simply add a second `<link>` to your `root.html.heex` file.

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html";
// Establish Phoenix Socket and LiveView configuration.
import { Socket } from "phoenix";
import { LiveSocket } from "phoenix_live_view";
import { hooks as colocatedHooks } from "phoenix-colocated/mole_view";
import topbar from "../vendor/topbar";

let Hooks = {};

Hooks.PlayerMovement = {
  mounted() {
    this.box = this.el.querySelector(".w-12.h-12"); // the colored square
    this.box.style.position = "relative";
    this.box.style.left = "0px";

    const container = this.el.closest(".absolute.bottom-16"); // the positioning parent

    this.keys = {};
    window.addEventListener(
      "keydown",
      (e) => (this.keys[e.key.toLowerCase()] = true),
    );
    window.addEventListener(
      "keyup",
      (e) => (this.keys[e.key.toLowerCase()] = false),
    );

    this.loop = setInterval(() => {
      const containerWidth = container.offsetWidth;
      const boxWidth = this.box.offsetWidth;
      const current = parseFloat(this.box.style.left) || 0;

      if (this.keys["a"]) {
        const next = Math.max(
          -(containerWidth / 2 - boxWidth / 2),
          current - 5,
        );
        this.box.style.left = next + "px";
        if (next !== current)
          this.pushEvent("move", { direction: "left", new_pos: next });
      }
      if (this.keys["d"]) {
        const next = Math.min(containerWidth / 2 - boxWidth / 2, current + 5);
        this.box.style.left = next + "px";
        if (next !== current)
          this.pushEvent("move", { direction: "right", new_pos: next });
      }
    }, 16);
  },

  destroyed() {
    clearInterval(this.loop);
  },
};

const csrfToken = document
  .querySelector("meta[name='csrf-token']")
  .getAttribute("content");
const liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,
  params: { _csrf_token: csrfToken },
  hooks: Hooks,
});

// Show progress bar on live navigation and form submits
topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
window.addEventListener("phx:page-loading-start", (_info) => topbar.show(300));
window.addEventListener("phx:page-loading-stop", (_info) => topbar.hide());

// connect if there are any LiveViews on the page
liveSocket.connect();

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket;

// The lines below enable quality of life phoenix_live_reload
// development features:
//
//     1. stream server logs to the browser console
//     2. click on elements to jump to their definitions in your code editor
//
if (process.env.NODE_ENV === "development") {
  window.addEventListener(
    "phx:live_reload:attached",
    ({ detail: reloader }) => {
      // Enable server log streaming to client.
      // Disable with reloader.disableServerLogs()
      reloader.enableServerLogs();

      // Open configured PLUG_EDITOR at file:line of the clicked element's HEEx component
      //
      //   * click with "c" key pressed to open at caller location
      //   * click with "d" key pressed to open at function component definition location
      let keyDown;
      window.addEventListener("keydown", (e) => (keyDown = e.key));
      window.addEventListener("keyup", (_e) => (keyDown = null));
      window.addEventListener(
        "click",
        (e) => {
          if (keyDown === "c") {
            e.preventDefault();
            e.stopImmediatePropagation();
            reloader.openEditorAtCaller(e.target);
          } else if (keyDown === "d") {
            e.preventDefault();
            e.stopImmediatePropagation();
            reloader.openEditorAtDef(e.target);
          }
        },
        true,
      );

      window.liveReloader = reloader;
    },
  );
}
