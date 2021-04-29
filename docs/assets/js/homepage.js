document.addEventListener('DOMContentLoaded', async () => {
  const actualityEl = document.querySelector('.actuality');

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
    const actualityFooterEl = actualityEl.querySelector('.actuality__footer');

    actualityBodyEl.innerHTML = normalizeLineBreaks(actualityBody);
    if (actualityFooter) actualityFooterEl.textContent = `Последнее обновление: ${formatDate(actualityFooter)}`;
  };

  // get actuality
  const getActuality = async () => fetch('https://api.mpei.space/getActuality')
    .then((res) => {
      const json = res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    })
    .catch((err) => {
      console.error(err);
      writeActuality('Ошибка загрузки 😞');
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
});
