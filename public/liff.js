window.onload = function (e) {
  // init で初期化。基本情報を取得。
  // https://developers.line.me/ja/reference/liff/#initialize-liff-app
  liff.init(function (data) {
    initializeApp(data);
  });
};

function initializeApp(data) {
  document.getElementById('languagefield').textContent = data.language;
  document.getElementById('viewtypefield').textContent = data.context.viewType;
  document.getElementById('useridfield').textContent = data.context.userId;
  document.getElementById('utouidfield').textContent = data.context.utouId;
  document.getElementById('roomidfield').textContent = data.context.roomId;
  document.getElementById('groupidfield').textContent = data.context.groupId;
}