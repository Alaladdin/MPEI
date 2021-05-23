window.addEventListener('load', () => {
  const selectionMenu = document.importNode(document.querySelector('template').content, true).childNodes[1];
  const getSelectionText = () => window.getSelection().toString();
  const removeSelectionMenu = () => {
    const controls = document.querySelectorAll('.selection-menu');

    if (controls !== null) {
      controls.forEach((control) => {
        control.remove();
        document
          .getSelection()
          .removeAllRanges();
      });
    }
  };
  const initButtonsEvents = () => {
    const selectionButtons = [
      {
        actionName: 'copy',
        action: () => {
          // eslint-disable-next-line no-undef
          if (showNotification) showNotification('Copied', { duration: 3 * 1000 });

          document.execCommand('copy');
        },
      },
      {
        actionName: 'vkontakte',
        action: () => window.open(encodeURI(`https://vk.com/share.php?&url=${window.location.href}&title=${document.title}&comment=${getSelectionText()}`)),
      },
      {
        actionName: 'telegram',
        action: () => window.open(encodeURI(`https://t.me/share/url?url=${window.location.href}&text=${getSelectionText()}`)),
      },
      {
        actionName: 'twitter',
        action: () => window.open(encodeURI(`https://twitter.com/intent/tweet?text=${getSelectionText()}`)),
      },
    ];

    selectionButtons.forEach((options) => {
      const selectionHTMLButtons = [...document.querySelectorAll('.selection-menu__btn')];
      const btn = selectionHTMLButtons.find((el) => el.dataset.action === options.actionName);

      btn.addEventListener('mousedown', options.action, true);
    });
  };
  const init = () => {
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span', 'div'].forEach((tag) => {
      const elements = document.querySelectorAll(`article ${tag}`);

      if (elements) {
        elements.forEach((el) => {
          el.addEventListener('mouseup', () => {
            const selection = window.getSelection();
            const selectionText = selection.toString();

            if (!selectionText.trim()) return;

            const rect = selection.getRangeAt(0).getBoundingClientRect();
            const selectionMenuEL = document.body.appendChild(selectionMenu);

            selectionMenu.style.top = `${rect.top - selectionMenu.offsetHeight - 10}px`;
            selectionMenu.style.left = `${rect.left + ((rect.width - selectionMenu.offsetWidth) / 2)}px`;

            // remove old listeners
            selectionMenuEL.parentNode.replaceChild(
              selectionMenuEL.cloneNode(true), selectionMenuEL,
            );

            initButtonsEvents();
          });
        });
      }
    });
  };

  init();
  document.addEventListener('mousedown', removeSelectionMenu);
  document.addEventListener('scroll', removeSelectionMenu);
});
