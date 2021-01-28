{
  
  createDropdown('.watch__select', {
    list: watchList,
  });
  
  const watchSelect = document.querySelector('.component-dropdown__select');
  const watchPrevBtn = document.querySelector('.watch__btn--prev');
  const watchNextBtn = document.querySelector('.watch__btn--next');
  
  const tag = document.createElement('script');
  const firstScriptTag = document.querySelector('script');
  
  let player;
  
  function changeWatch(videoId) {
    player.loadVideoById({
      'videoId': videoId,
      'autoplay': 0,
    });
  }
  
  const enableWatchBtn = (btn) => {
    btn.classList.remove('watch__btn--disabled');
    btn.disabled = false;
  };
  
  const disableWatchBtn = (btn) => {
    btn.classList.add('watch__btn--disabled');
    btn.disabled = true;
  };
  
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '360',
      width: '640',
      videoId: 'dQw4w9WgXcQ',
    });
  }
  
  watchSelect.onchange = () => {
    changeWatch(watchSelect.value);
    checkBoundaries();
  };
  
  tag.src = 'https://www.youtube.com/iframe_api';
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  watchPrevBtn.onclick = () => {
    watchSelect.selectedIndex--;
    watchSelect.dispatchEvent(new Event('change'));
    checkBoundaries();
  };
  
  watchNextBtn.onclick = () => {
    watchSelect.selectedIndex++;
    watchSelect.dispatchEvent(new Event('change'));
    checkBoundaries();
  };
  
  function checkBoundaries() {
    if (watchSelect.selectedIndex === 0) {
      disableWatchBtn(watchPrevBtn);
    }
    
    if (watchSelect.selectedIndex < watchSelect.length) {
      enableWatchBtn(watchNextBtn);
    }
    
    if (watchSelect.selectedIndex === watchSelect.length - 1) {
      disableWatchBtn(watchNextBtn);
    }
    
    if (watchSelect.selectedIndex > 0) {
      enableWatchBtn(watchPrevBtn);
    }
  }
}