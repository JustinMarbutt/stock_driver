// Hello, Fake Market!
import { initNewGame } from "./library/state";
import { registerActions } from "./scripts/actions";
import '../styles/style.scss';

$(document).ready(function() {
  initNewGame();
  registerActions();
});
