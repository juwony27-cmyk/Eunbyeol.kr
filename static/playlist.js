const playlistSongs = [
    "https://music.apple.com/kr/album/%EA%B8%88%EB%B6%95%EC%96%B4/1703196819?i=1703196823",
    "https://music.apple.com/kr/album/%EB%88%88%EB%8D%A9%EC%9D%B4/1831464476?i=1831464483",
    "https://music.apple.com/kr/album/%EC%9E%90%EC%B2%98/1683092568?i=1683092569",
    "https://music.apple.com/kr/album/%EC%A0%90%EC%8B%AC%EC%8B%9C%EA%B0%84/1597258186?i=1597258199",
    "https://music.apple.com/kr/album/%EC%B4%88%EB%A1%9D%EC%95%84%ED%8C%8C%ED%8A%B8/1828841860?i=1828842111",
    "https://music.apple.com/kr/album/%EC%82%AC%EB%9E%91-%EC%97%86%EC%9D%B4-%EC%82%AC%EB%8A%94%EA%B2%8C-%EC%99%9C-%EA%B7%B8%EB%A0%87%EA%B2%8C-%EC%96%B4%EB%A0%A4%EC%9A%B8%EA%B9%8C%EC%9A%94/1633408885?i=1633408887",
    "https://music.apple.com/kr/album/untitled-02/1773715384?i=1773715385",
    "https://music.apple.com/kr/album/%EC%9A%A9%EC%9D%98%EC%9E%90/1828393588?i=1828393593",
    "https://music.apple.com/kr/album/%ED%95%9C%EA%B3%84/1747314944?i=1747315103",
    "https://music.apple.com/kr/album/%EC%82%AC%EB%9E%91%EC%9D%80-%EC%96%B4%EC%A9%8C%EA%B3%A0/1849123893?i=1849123894"
];

const playlistList = document.getElementById("playlistList");
const playlistCount = document.getElementById("playlistCount");
const playlistBackdrop = document.getElementById("playlistBackdrop");
const playlistCover = document.getElementById("playlistCover");
const playlistCoverLink = document.getElementById("playlistCoverLink");
const playlistItemType = document.getElementById("playlistItemType");
const playlistSongName = document.getElementById("playlistSongName");
const playlistArtist = document.getElementById("playlistArtist");
const playlistDuration = document.getElementById("playlistDuration");
const playlistReleaseDate = document.getElementById("playlistReleaseDate");
const playlistPlatform = document.getElementById("playlistPlatform");

let playlistCache = new Map();
let currentPlaylistIndex = 0;

function buildMusicUrl(type, appleUrl) {
  return `https://img.commu.world/music/${type}?url=${encodeURIComponent(appleUrl)}`;
}

function formatReleaseDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function formatItemType(type) {
  if (!type) return "TRACK";
  return String(type).replaceAll("_", " ").toUpperCase();
}

async function fetchSongInfo(appleUrl) {
  if (playlistCache.has(appleUrl)) {
    return playlistCache.get(appleUrl);
  }

  const diskCached = getCachedSongInfoFromDisk(appleUrl);
  if (diskCached) {
    playlistCache.set(appleUrl, diskCached);
    return diskCached;
  }

  const res = await fetch(buildMusicUrl("info", appleUrl), {
    method: "GET",
    cache: "force-cache"
  });

  if (!res.ok) {
    throw new Error(`정보를 불러오지 못했습니다. (${res.status})`);
  }

  const data = await res.json();
  if (!data.success || !data.info) {
    throw new Error("곡 정보가 비어 있습니다.");
  }

  playlistCache.set(appleUrl, data.info);
  saveSongInfoToDiskCache(appleUrl, data.info);

  return data.info;
}

function createPlaylistItem(info, appleUrl, index) {
  const button = document.createElement("button");
  button.dataset.order = String(index + 1).padStart(2, "0");
  button.type = "button";
  button.className = "playlist-item";
  button.dataset.index = String(index);

  const thumb = document.createElement("img");
  thumb.className = "playlist-item-thumb";
  thumb.src = buildMusicUrl("cover", appleUrl);
  thumb.alt = `${info.song_name || "노래"} 표지`;

  const textWrap = document.createElement("div");
  textWrap.className = "playlist-item-text";

  const title = document.createElement("div");
  title.className = "playlist-item-title";
  title.textContent = info.song_name || "제목 없음";

  const artist = document.createElement("div");
  artist.className = "playlist-item-artist";
  artist.textContent = info.artist_name || "아티스트 정보 없음";

  textWrap.appendChild(title);
  textWrap.appendChild(artist);

  button.appendChild(thumb);
  button.appendChild(textWrap);

  button.addEventListener("click", () => {
    renderPlaylist(index);
  });

  return button;
}

function setActivePlaylistItem(index) {
  const items = playlistList.querySelectorAll(".playlist-item");
  items.forEach((item) => {
    item.classList.toggle("is-active", Number(item.dataset.index) === index);
  });
}

function updateImageIfChanged(imgEl, nextSrc, nextAlt) {
  if (imgEl.getAttribute("src") !== nextSrc) {
    imgEl.src = nextSrc;
  }
  imgEl.alt = nextAlt;
}

function fillPlaylistHero(info, appleUrl) {
  const backdropSrc = buildMusicUrl("nonocover", appleUrl);
  const coverSrc = buildMusicUrl("cover", appleUrl);

  updateImageIfChanged(
    playlistBackdrop,
    backdropSrc,
    info.song_name ? `${info.song_name} 배경` : "노래 배경"
  );

  updateImageIfChanged(
    playlistCover,
    coverSrc,
    info.song_name ? `${info.song_name} 표지` : "노래 표지"
  );

  playlistCoverLink.href = appleUrl;
  playlistItemType.textContent = formatItemType(info.item_type);
  playlistSongName.textContent = info.song_name || "제목 없음";
  playlistArtist.textContent = info.artist_name || "아티스트 정보 없음";
  playlistArtist.href = info.artist_url || appleUrl;
  playlistDuration.textContent = info.duration || "-";
  playlistReleaseDate.textContent = formatReleaseDate(info.release_date);
  playlistPlatform.textContent =
    info.platform === "apple_music" ? "Apple Music" : (info.platform || "Music");
}

async function renderPlaylist(index = 0) {
  if (!playlistSongs.length) {
    playlistList.innerHTML = `
      <div class="playlist-empty">
        아직 등록된 곡이 없습니다.<br>
        <strong>playlistSongs</strong> 배열에 Apple Music 링크를 추가해 주세요.
      </div>
    `;

    playlistCount.textContent = "0곡";
    playlistItemType.textContent = "PLAYLIST";
    playlistSongName.textContent = "곡을 추가해 주세요";
    playlistArtist.textContent = "Apple Music 링크를 넣으면 자동으로 불러옵니다.";
    playlistArtist.removeAttribute("href");
    playlistDuration.textContent = "-";
    playlistReleaseDate.textContent = "-";
    playlistPlatform.textContent = "Apple Music";
    playlistCover.removeAttribute("src");
    playlistBackdrop.removeAttribute("src");
    playlistCoverLink.href = "#";
    return;
  }

  currentPlaylistIndex = index;

  try {
    const appleUrl = playlistSongs[index];
    const info = await fetchSongInfo(appleUrl);
    fillPlaylistHero(info, appleUrl);
    setActivePlaylistItem(index);
  } catch (error) {
    console.error(error);
    playlistSongName.textContent = "곡 정보를 불러오지 못했습니다.";
    playlistArtist.textContent = "링크 또는 응답을 확인해 주세요.";
    playlistDuration.textContent = "-";
    playlistReleaseDate.textContent = "-";
  }
}

async function initPlaylist() {
  playlistCount.textContent = `${playlistSongs.length}곡`;

  if (!playlistSongs.length) {
    renderPlaylist(0);
    return;
  }

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < playlistSongs.length; i += 1) {
    const appleUrl = playlistSongs[i];

    try {
      const info = await fetchSongInfo(appleUrl);
      const item = createPlaylistItem(info, appleUrl, i);
      fragment.appendChild(item);
    } catch (error) {
      console.error(`플레이리스트 ${i}번 곡 로드 실패`, error);
    }
  }

  playlistList.innerHTML = "";
  playlistList.appendChild(fragment);

  if (!playlistList.children.length) {
    playlistList.innerHTML = `
      <div class="playlist-empty">
        곡 목록을 불러오지 못했습니다.<br>
        Apple Music 링크를 다시 확인해 주세요.
      </div>
    `;
  }

  renderPlaylist(currentPlaylistIndex);
}

const PLAYLIST_INFO_CACHE_PREFIX = "playlist-info-cache:";
const PLAYLIST_INFO_CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7일

function getPlaylistCacheKey(appleUrl) {
  return `${PLAYLIST_INFO_CACHE_PREFIX}${appleUrl}`;
}

function getCachedSongInfoFromDisk(appleUrl) {
  try {
    const raw = localStorage.getItem(getPlaylistCacheKey(appleUrl));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.savedAt || !parsed.info) return null;

    const isExpired = Date.now() - parsed.savedAt > PLAYLIST_INFO_CACHE_TTL;
    if (isExpired) {
      localStorage.removeItem(getPlaylistCacheKey(appleUrl));
      return null;
    }

    return parsed.info;
  } catch (error) {
    console.warn("playlist disk cache read 실패", error);
    return null;
  }
}

function saveSongInfoToDiskCache(appleUrl, info) {
  try {
    localStorage.setItem(
      getPlaylistCacheKey(appleUrl),
      JSON.stringify({
        savedAt: Date.now(),
        info
      })
    );
  } catch (error) {
    console.warn("playlist disk cache save 실패", error);
  }
}

initPlaylist();