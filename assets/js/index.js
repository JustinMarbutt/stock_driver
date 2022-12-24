// Hello, Fake Market!
import { initNewGame } from "./library/state";
import { registerActions } from "./scripts/actions";

$(document).ready(function() {
  initNewGame();
  registerActions();
});
