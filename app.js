'use strict';

/**
 * 株式会社ヒット
 * 勤怠・PCログ突合システム
 */

const API_URL =
  'https://script.google.com/a/macros/theforestgym.com/s/AKfycbyqo2xpd9Ybv1q0ZKXKnxuku77hX6j5mKlybtVLJOQa8F2WS9VredOwtrF3k3-B6kts/exec';


document.addEventListener(
  'DOMContentLoaded',
  initializeApp
);


/**
 * 初期処理
 */
async function initializeApp() {
  registerMenuEvents();
  await checkApiConnection();
}


/**
 * メニューイベント登録
 */
function registerMenuEvents() {
  const menuElements =
    document.querySelectorAll('[data-menu]');

  menuElements.forEach(function(element) {
    element.addEventListener(
      'click',
      function() {
        const menuId =
          element.dataset.menu;

        handleMenuClick(menuId);
      }
    );
  });
}


/**
 * メニュー押下処理
 */
function handleMenuClick(menuId) {
  if (!menuId) {
    return;
  }

  if (menuId === 'home') {
    clearMessage();
    setActiveMenu('home');
    return;
  }

  const menuNames = {
    employee: '社員名簿',
    attendance: '勤怠CSV取込',
    pclog: 'PCログ取込',
    reconciliation: '突合実行',
    results: '突合結果',
    stage: 'ステージ管理',
    history: '取込履歴',
    settings: '設定'
  };

  const menuName =
    menuNames[menuId] ||
    menuId;

  setActiveMenu(menuId);

  showMessage(
    menuName +
      '画面は次の工程で実装します。',
    'info'
  );
}


/**
 * 選択中メニュー表示
 */
function setActiveMenu(menuId) {
  const navItems =
    document.querySelectorAll(
      '.sidebar .nav-item[data-menu]'
    );

  navItems.forEach(function(item) {
    const isActive =
      item.dataset.menu === menuId;

    item.classList.toggle(
      'active',
      isActive
    );
  });
}


/**
 * GAS接続確認
 */
async function checkApiConnection() {
  const statusElement =
    document.getElementById('apiStatus');

  const detailElement =
    document.getElementById('apiDetail');

  if (!statusElement || !detailElement) {
    console.error(
      'API接続状態の表示要素が見つかりません。'
    );
    return;
  }

  try {
    const requestUrl =
      API_URL +
      '?action=health&t=' +
      Date.now();

    const response =
      await fetch(requestUrl, {
        method: 'GET',
        redirect: 'follow',
        cache: 'no-store'
      });

    if (!response.ok) {
      throw new Error(
        'HTTP ' + response.status
      );
    }

    const result =
      await response.json();

    if (
      !result.success ||
      !result.data ||
      result.data.status !== 'ok'
    ) {
      throw new Error(
        'APIの応答が正しくありません。'
      );
    }

    statusElement.textContent =
      '正常';

    statusElement.className =
      'status-value status-ok';

    const apiVersion =
      result.data.apiVersion ||
      '不明';

    const serverTime =
      result.data.serverTime ||
      '時刻不明';

    detailElement.textContent =
      'Version ' +
      apiVersion +
      ' ／ ' +
      serverTime;

  } catch (error) {
    console.error(
      'GAS API connection error:',
      error
    );

    statusElement.textContent =
      '接続エラー';

    statusElement.className =
      'status-value status-error';

    detailElement.textContent =
      'GAS APIへ接続できません。';

    showMessage(
      'GASとの接続確認に失敗しました。ブラウザの開発者ツールでエラー内容を確認してください。',
      'error'
    );
  }
}


/**
 * メッセージ表示
 */
function showMessage(message, type) {
  const messageElement =
    document.getElementById('message');

  if (!messageElement) {
    console.error(
      'メッセージ表示要素が見つかりません。'
    );
    return;
  }

  messageElement.textContent =
    message;

  messageElement.className =
    'message ' +
    (type || 'info');

  messageElement.hidden =
    false;

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}


/**
 * メッセージ非表示
 */
function clearMessage() {
  const messageElement =
    document.getElementById('message');

  if (!messageElement) {
    return;
  }

  messageElement.textContent =
    '';

  messageElement.className =
    'message';

  messageElement.hidden =
    true;
}
