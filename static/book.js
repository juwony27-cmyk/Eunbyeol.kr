  const booksStage = document.getElementById('booksStage');
  const bookCards = Array.from(document.querySelectorAll('.book-card'));

  const bookPanelTitle = document.getElementById('bookPanelTitle');
  const bookPanelSubtitle = document.getElementById('bookPanelSubtitle');
  const bookPanelDate = document.getElementById('bookPanelDate');
  const bookPanelMeta = document.getElementById('bookPanelMeta');
  const bookPanelDesc = document.getElementById('bookPanelDesc');
  const bookPanelQuote = document.getElementById('bookPanelQuote');

  function setActiveBook(index) {
    booksStage.className = `books-stage is-book-${index}`;

    bookCards.forEach((card, i) => {
      const isActive = i === index;
      card.classList.toggle('is-active', isActive);
      card.classList.toggle('is-inactive', !isActive);
      card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    const active = bookCards[index];
    if (!active) return;

    bookPanelSubtitle.textContent = active.dataset.subtitle || '';
    bookPanelTitle.textContent = active.dataset.title || '';
    bookPanelDate.textContent = active.dataset.date || '';
    bookPanelMeta.textContent = active.dataset.meta || '';
    bookPanelDesc.textContent = active.dataset.desc || '';
    bookPanelQuote.textContent = active.dataset.quote || '';

    active.dispatchEvent(new CustomEvent('bookactivated'));
  }

  bookCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      setActiveBook(index);
    });

    card.addEventListener('focus', () => {
      setActiveBook(index);
    });
  });

  setActiveBook(0);