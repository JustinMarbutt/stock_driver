// Hello, Fake Market!
import 'bootstrap';
import { initNewGame } from "./library/state";
import { registerActions } from "./scripts/actions";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/style.scss';

// Requrie tos accept for initNewGame an registerActions
$('#termsModal').modal({backdrop: 'static', keyboard: false});
$('#agreeButton').on('click', function() {
  initNewGame();
  registerActions();
});
