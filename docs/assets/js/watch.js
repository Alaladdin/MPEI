{
  let player;

  /**
   * Creates YouTube video player
   * @return {void}
   */
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '360',
      width: '640',
      videoId: 'dQw4w9WgXcQ',
    });
  }

  /**
   * Change player   video
   * @param {string} videoId
   * @param {string} videoTitle
   */
  const changeWatch = (videoId, videoTitle) => {
    const watchTitle = document.querySelector('.watch__name');
    player.loadVideoById({
      videoId,
      autoplay: 0,
    });
    watchTitle.textContent = videoTitle;
  };

  const initPlayer = (res) => {
    const tag = document.createElement('script');
    const firstScriptTag = document.querySelector('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    return res;
  };

  const initWatch = (data) => {
    const watchCount = document.querySelector('.watch__count');
    const watchList = data.videos.data;

    if (watchList) {
      createDropdown('.watch__select', { list: watchList });

      const watchSelect = document.querySelector('.component-dropdown__select');

      watchCount.textContent = data.videos.count;
      watchSelect.onchange = () => changeWatch(watchSelect.value, watchList[watchSelect.value]);
    }
  };

  /**
   * Creates error message on page
   * @param {string} mess
   */
  const createErrorMess = (mess) => {
    if (mess.length <= 0) return;
    const watchError = document.querySelector('.watch__error');
    const watchErrorMess = document.querySelector('.watch__error-mess');
    watchError.classList.remove('sr-only');
    watchErrorMess.textContent = mess;
  };

  /**
   * Call API
   * @return {Promise<any>}
   */
  const apiCall = async () => {
    const watchVideoPlayer = document.querySelector('.watch__video');
    const playListID = watchVideoPlayer.dataset.playlistId;
    return fetch(`https://mpei-server.herokuapp.com/api/getPlaylist/${playListID}`)
      .then((res) => res.json());
  };

  apiCall()
    .then(initPlayer)
    .then(initWatch)
    .catch((err) => createErrorMess(err.message));
}
