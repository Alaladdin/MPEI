{
  let player;

  class Loader {
    constructor(el) {
      this.el = el;
      this.loader = document.createElement('div');
    }

    create() {
      this.funnies = [
        'сервер спит, нужно чутка подождать, пока проснется',
        'обработка твоих личных данных чего-то затянулась',
        'жирафы крутые',
        'шея жирафа может достигать двух метров, да-да',
        'коалы тоже бомбезные',
        'самое старое существо на Земле - моллюск Мин. В 2013 году ему было 507 лет!',
        'баобаб',
        'да ты походи, сервер сейчас проснется, ответит',
        'здесь не могло быть вашей рекламы',
        'ʕ•ᴥ•ʔ',
        'ты наш мильенный посетитель',
        'утренние новости ночью с мистером коалой',
        'интересных фактов на всех не хватит, придется драться',
      ];
      this.loader.classList.add('loader');
      this.loader.dataset.content = this.funnies[Math.floor(Math.random() * this.funnies.length)];
      this.el.append(this.loader);
    }

    delete() {
      this.el.removeChild(this.loader);
    }
  }

  const dropdownLoader = new Loader(document.querySelector('.watch__select'));

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

  const initPlayer = () => {
    const tag = document.createElement('script');
    const firstScriptTag = document.querySelector('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
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
    if (playListID.length <= 0) throw Error('playlistId not provided');
    return fetch(`https://mpei-server.herokuapp.com/api/getPlaylist/${playListID}`)
      .then((res) => res.json());
  };

  dropdownLoader.create();
  initPlayer();
  apiCall()
    .then((data) => {
      dropdownLoader.delete();
      return data;
    })
    .then(initWatch)
    .catch((err) => createErrorMess(err.message));
}
