document.addEventListener('DOMContentLoaded', async () => {
  const actualityEl = document.querySelector('.actuality');
  // const actualityHeaderEl = actualityEl.querySelector('.actuality__header');

  const normalizeLineBreaks = (text) => text.replace(/(?:\r\n|\r|\n)/g, '<br>');
  const formatDate = (dateString) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    };

    return new Date(dateString).toLocaleString('ru-RU', options);
  };

  const writeActuality = (actualityBody, actualityFooter) => {
    const actualityBodyEl = actualityEl.querySelector('.actuality__content');
    const actualityFooterEl = actualityEl.querySelector('.actuality__update-date');

    actualityBodyEl.innerHTML = normalizeLineBreaks(actualityBody);
    if (actualityFooter) actualityFooterEl.textContent = formatDate(actualityFooter);
  };

  // get actuality
  const getActuality = async () => fetch('https://mpei-server.herokuapp.com/api/getActuality')
    .then((res) => {
      const json = res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    })
    .catch((err) => {
      console.error(err);
      writeActuality('Ошибка при загрузке 😞');
    });

  // main side
  const { actuality } = await getActuality() || {};

  // - write content to the body
  // if we have response from server
  if (actuality) {
    // if response is not empty
    if (actuality.content) {
      actualityEl.classList.remove('text-center');
      writeActuality(actuality.content, actuality.date);
    } else {
      writeActuality('Актуалочка пустая😢');
    }
  }

  // actualityHeaderEl.addEventListener('click', () => {
  //   actualityEl.classList.toggle('show');
  // });
});
