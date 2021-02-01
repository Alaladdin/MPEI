{
  let player;

  /**
   * Creates error message on page
   * @param {string} mess
   */
  function createErrorMess(mess) {
    if (mess.length <= 0) return;
    const watchError = document.querySelector('.watch__error');
    const watchErrorMess = document.querySelector('.watch__error-mess');

    watchError.classList.remove('sr-only');
    watchErrorMess.textContent = mess;
  }

  /**
   * Getting YouTube url
   * @param {string, Array} part
   * @param {string, number} maxResults
   * @param {string} playListID
   * @param {string} apiKey
   * @returns {string}
   */
  function getUrl({
    part = ['snippet'],
    maxResults = 100,
    playListID = '',
    apiKey = 'AIzaSyCfWOrIaPhG9liEfUzmUTlv1Tl0m5D1aCE',
  }) {
    return `https://www.googleapis.com/youtube/v3/playlistItems?part=${part.join()}&maxResults=${maxResults}&playlistId=${playListID}&key=${apiKey}`;
  }

  /**
   * Call API
   * @return {Promise<any>}
   */
  async function apiCall() {
    const watchVideoPlayer = document.querySelector('.watch__video');
    const playListID = watchVideoPlayer.dataset.playlistId;

    return await fetch(getUrl({
      playListID,
    })).then((res) => res.json()).catch((err) => createErrorMess(err));
  }

  /**
   * Change player video
   * @param {string} videoId
   * @param {string} videoTitle
   */
  function changeWatch(videoId, videoTitle) {
    const watchTitle = document.querySelector('.watch__name');

    player.loadVideoById({
      'videoId': videoId,
      'autoplay': 0,
    });

    watchTitle.textContent = videoTitle;
  }

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

  apiCall().then((res) => {
    const watchList = {};
    const watchCount = document.querySelector('.watch__count');
    const tag = document.createElement('script');
    const firstScriptTag = document.querySelector('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    if (!res.error) {
      for (const item of res.items) {
        const snippet = item.snippet;
        watchList[snippet.resourceId.videoId] = snippet.title;
      }

      createDropdown('.watch__select', {
        list: watchList,
      });

      const watchSelect = document.querySelector('.component-dropdown__select');

      watchCount.textContent = res.pageInfo.totalResults;
      watchSelect.onchange = () => changeWatch(
          watchSelect.value,
          watchList[watchSelect.value],
      );
    } else {
      createErrorMess(res.error.message);
    }
  });
}
