(function () {
  const visitedKey = 'baekeunbyeol_first_visit_done';
  const reloadedKey = 'baekeunbyeol_first_reload_done';

  const hasVisited = localStorage.getItem(visitedKey) === 'true';
  const hasReloaded = sessionStorage.getItem(reloadedKey) === 'true';

  if (!hasVisited) {
    localStorage.setItem(visitedKey, 'true');

    if (!hasReloaded) {
      sessionStorage.setItem(reloadedKey, 'true');
      location.reload();
    }
  }
})();