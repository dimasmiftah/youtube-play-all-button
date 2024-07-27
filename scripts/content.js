const applyStyles = (element, styles) => {
  Object.assign(element.style, styles);
};

const createButton = ({ text, id }) => {
  const button = document.createElement('button');
  button.textContent = text;
  button.id = id;
  const classesToAdd = [
    'yt-spec-button-shape-next',
    'yt-spec-button-shape-next--tonal',
    'yt-spec-button-shape-next--mono',
    'yt-spec-button-shape-next--size-m',
    'yt-spec-button-shape-next--icon-leading-trailing',
  ];
  button.classList.add(...classesToAdd);

  applyStyles(button, {
    marginLeft: '10px',
    minWidth: 'fit-content',
  });

  return button;
};

const navigate = (url) => {
  window.location = url;
};

const getChannelCode = () => {
  const channelUrl = document.querySelector('link[itemprop="url"]')?.href;
  const channelCode = channelUrl?.split('/')[4]?.replace('UC', 'UU');

  return channelCode;
};

const addPlaylistButton = () => {
  const parsedChannelCode = getChannelCode();
  const playlistUrl = `https://www.youtube.com/playlist?list=${parsedChannelCode}`;
  const goToPlaylistButton = createButton({ text: 'Go to Playlist', id: 'goToPlaylistButton' });

  goToPlaylistButton.addEventListener('click', () => navigate(playlistUrl));

  return goToPlaylistButton;
};

const addPlayAllButton = () => {
  const videoUrl = document.querySelector('a[href*="/watch?v="]')?.href;
  const parsedChannelCode = getChannelCode();
  const playAllUrl = `${videoUrl}&list=${parsedChannelCode}`;
  const playAllButton = createButton({ text: 'Play All', id: 'playAllButton' });

  playAllButton.addEventListener('click', () => navigate(playAllUrl));

  return playAllButton;
};

const insertButtons = () => {
  const playlistButton = document.getElementById('goToPlaylistButton');
  const playAllButton = document.getElementById('playAllButton');

  if (playlistButton) {
    playlistButton.remove();
  }

  if (playAllButton) {
    playAllButton.remove();
  }

  const subscribeButton = document.querySelector('.yt-flexible-actions-view-model-wiz__action');

  if (subscribeButton) {
    const goToPlaylistButton = addPlaylistButton();
    const playAllButton = addPlayAllButton();

    subscribeButton.insertAdjacentElement('afterend', playAllButton);
    subscribeButton.insertAdjacentElement('afterend', goToPlaylistButton);
  }
};

const insertButtonsWithDelay = () => {
  setTimeout(insertButtons, 1000);
};

let lastVisitedChannel = '';

const checkAndReloadForNewChannel = () => {
  const currentURL = window.location.href;
  const channelMatch = currentURL.match(/youtube\.com\/@([^/]+)/);

  if (channelMatch) {
    const currentChannel = channelMatch[1];
    if (currentChannel !== lastVisitedChannel) {
      lastVisitedChannel = currentChannel;
      if (!sessionStorage.getItem('reloaded')) {
        sessionStorage.setItem('reloaded', 'true');
        window.location.reload();
      } else {
        sessionStorage.removeItem('reloaded');
        insertButtonsWithDelay();
      }
    }
  }

  const playlistButton = document.getElementById('goToPlaylistButton');
  const playAllButton = document.getElementById('playAllButton');

  if (!playAllButton || !playlistButton) {
    insertButtonsWithDelay();
  }
};

// Initial check and insert
checkAndReloadForNewChannel();

// Listen for page navigation events
window.addEventListener('yt-navigate-finish', checkAndReloadForNewChannel);
