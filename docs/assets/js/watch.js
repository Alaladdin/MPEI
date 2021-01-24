{
  const watchSelect = document.querySelector('.watch__select');
  const watchPrevBtn = document.querySelector('.watch__btn--prev');
  const watchNextBtn = document.querySelector('.watch__btn--next');

  const tag = document.createElement('script');
  const firstScriptTag = document.querySelector('script');

  let player;

  function changeWatch(videoId) {
    player.loadVideoById({
      'videoId': videoId,
    });
  }

  const enableWatchBtn = (btn) => {
    btn.classList.remove('watch__btn--disabled');
    btn.disabled = false;
  };

  const disableWatchBtn = (btn) => {
    btn.classList.add('watch__btn--disabled');
    btn.disabled = true;
    // btn.setAttribute('disabled');

  };

  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '360',
      width: '640',
      videoId: Object.keys(watchList)[0],
    });
  }

  watchSelect.onchange = () => changeWatch(watchSelect.value);

  tag.src = 'https://www.youtube.com/iframe_api';
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  for (const [key, value] of Object.entries(watchList)) {
    const option = document.createElement('option');

    option.value = key;
    option.textContent = value.name;

    watchSelect.append(option);
  }

  watchPrevBtn.onclick = () => {
    watchSelect.selectedIndex--;
    watchSelect.dispatchEvent(new Event('change'));

    if (watchSelect.selectedIndex === 0) {
      disableWatchBtn(watchPrevBtn);
    }

    if (watchSelect.selectedIndex < watchSelect.length) {
      enableWatchBtn(watchNextBtn);
    }
  };

  watchNextBtn.onclick = () => {
    watchSelect.selectedIndex++;
    watchSelect.dispatchEvent(new Event('change'));

    if (watchSelect.selectedIndex === watchSelect.length - 1) {
      disableWatchBtn(watchNextBtn);
    }

    if (watchSelect.selectedIndex > 0) {
      enableWatchBtn(watchPrevBtn);
    }
  };
}