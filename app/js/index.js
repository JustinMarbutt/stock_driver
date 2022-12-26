// Hello, Fake Market!
import 'bootstrap';
import { initNewGame } from "./library/state";
import { registerActions } from "./scripts/actions";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/style.scss';

$(document).ready(function() {
  initNewGame();
  registerActions();
});
