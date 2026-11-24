// AI Help Widget — floating chat on all pages
(function() {
  'use strict';

  var chatHistory = [];
  var isOpen = false;
  var isLoading = false;

  // Page greetings
  var PAGE_GREETINGS = {
    'dashboard': { en: 'Need help with your dashboard or stats?', ru: 'Нужна помощь с дашбордом или статистикой?' },
    'tasks': { en: 'Looking for tasks to earn? I can help!', ru: 'Ищете задания? Могу помочь!' },
    'my-tasks': { en: 'Questions about your task history or earnings?', ru: 'Вопросы по истории заданий или заработку?' },
    'leaderboard': { en: 'Want to climb the leaderboard? Ask me how!', ru: 'Хотите подняться в рейтинге? Спрашивайте!' },
    'wallet': { en: 'Questions about balance or withdrawals?', ru: 'Вопросы по балансу или выводу средств?' },
    'profile': { en: 'Need help linking a social account?', ru: 'Нужна помощь с привязкой аккаунта?' },
    'referrals': { en: 'Want to earn more with referrals? Ask me!', ru: 'Хотите больше заработать с рефералами?' },
    'support': { en: 'I can help before you create a ticket!', ru: 'Могу помочь до создания тикета!' },
    'faq': { en: 'Can\'t find your answer? Ask me directly!', ru: 'Не нашли ответ? Спросите меня!' },
  };

  var DEFAULT_GREETING = { en: 'Hi! How can I help you today?', ru: 'Привет! Чем могу помочь?' };

  function getCurrentPage() {
    var path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
    return path || 'dashboard';
  }

  function getLang() {
    try {
      return (localStorage.getItem('lang') || 'en').substring(0, 2);
    } catch(e) { return 'en'; }
  }

  function getGreeting() {
    var page = getCurrentPage();
    var lang = getLang();
    var g = PAGE_GREETINGS[page] || DEFAULT_GREETING;
    return g[lang] || g['en'] || DEFAULT_GREETING['en'];
  }

  function t(key) {
    var lang = getLang();
    var strings = {
      en: {
        title: 'Peter I',
        placeholder: 'Type your question...',
        send: 'Send',
        create_ticket: 'Create support ticket',
        powered: 'Your assistant',
        close: 'Close',
        error: 'Something went wrong. Try again or create a ticket.',
        limit: 'Please create a support ticket for further help.'
      },
      ru: {
        title: 'Пётр I',
        placeholder: 'Введите вопрос...',
        send: 'Отправить',
        create_ticket: 'Создать тикет',
        powered: 'Ваш ассистент',
        close: 'Закрыть',
        error: 'Что-то пошло не так. Попробуйте снова или создайте тикет.',
        limit: 'Создайте тикет в поддержку для дальнейшей помощи.'
      }
    };
    return (strings[lang] && strings[lang][key]) || strings['en'][key] || key;
  }

  function createWidget() {
    // Don't show on login/register pages or admin pages
    var path = window.location.pathname;
    if (path.includes('admin')) return;

    // Check if user is logged in (has sidebar or user footer)
    // Widget will be injected after auth check via initWidget()

    var wrapper = document.createElement('div');
    wrapper.id = 'ai-help-widget';
    wrapper.innerHTML = `
      <div id="ai-help-btn" title="${t('title')}">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <div id="ai-help-chat" style="display:none">
        <div id="ai-help-header">
          <div style="display:flex;align-items:center;gap:8px">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span style="font-weight:600;font-size:14px">${t('title')}</span>
          </div>
          <button id="ai-help-close" title="${t('close')}">&times;</button>
        </div>
        <div id="ai-help-messages"></div>
        <div id="ai-help-footer">
          <div id="ai-help-input-row">
            <input type="text" id="ai-help-input" placeholder="${t('placeholder')}" maxlength="1000" autocomplete="off">
            <button id="ai-help-send">${t('send')}</button>
          </div>
          <div id="ai-help-actions">
            <a id="ai-help-ticket" href="/support">${t('create_ticket')}</a>
            <span style="color:var(--text-muted,#888);font-size:11px">${t('powered')}</span>
          </div>
        </div>
      </div>`;
    document.body.appendChild(wrapper);

    // Inject styles
    var style = document.createElement('style');
    style.textContent = `
      #ai-help-widget { position:fixed; bottom:20px; right:20px; z-index:9999; font-family:inherit; }
      #ai-help-btn {
        width:52px; height:52px; border-radius:50%; background:linear-gradient(135deg,#dc2626,#ea580c);
        color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer;
        box-shadow:0 4px 16px rgba(234,88,12,0.4); transition:transform 0.2s,box-shadow 0.2s;
      }
      #ai-help-btn:hover { transform:scale(1.08); box-shadow:0 6px 20px rgba(234,88,12,0.5); }
      #ai-help-chat {
        position:absolute; bottom:64px; right:0; width:340px; max-height:480px;
        background:#18181b; border:1px solid #2a2a2e;
        border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,0.5);
        display:flex; flex-direction:column; overflow:hidden;
      }
      #ai-help-header {
        display:flex; align-items:center; justify-content:space-between;
        padding:12px 16px; border-bottom:1px solid #2a2a2e;
        background:linear-gradient(135deg,#dc2626,#ea580c); color:#fff;
      }
      #ai-help-close {
        background:none; border:none; color:#fff; font-size:22px; cursor:pointer;
        width:28px; height:28px; display:flex; align-items:center; justify-content:center;
        border-radius:50%; transition:background 0.15s;
      }
      #ai-help-close:hover { background:rgba(255,255,255,0.2); }
      #ai-help-messages {
        flex:1; overflow-y:auto; padding:12px 16px; min-height:200px; max-height:320px;
        background:#18181b; display:flex; flex-direction:column; gap:10px;
      }
      .ai-msg { max-width:85%; padding:10px 14px; border-radius:14px; font-size:13px; line-height:1.5; word-wrap:break-word; }
      .ai-msg-bot { align-self:flex-start; background:#27272a; color:#e4e4e7; border-bottom-left-radius:4px; }
      .ai-msg-user { align-self:flex-end; background:linear-gradient(135deg,#dc2626,#ea580c); color:#fff; border-bottom-right-radius:4px; }
      .ai-msg-typing { align-self:flex-start; background:#27272a; color:#a1a1aa; font-style:italic; border-bottom-left-radius:4px; }
      #ai-help-footer { border-top:1px solid #2a2a2e; padding:10px 12px; background:#18181b; }
      #ai-help-input-row { display:flex; gap:8px; }
      #ai-help-input {
        flex:1; padding:8px 12px; border:1px solid #3f3f46; border-radius:20px;
        font-size:13px; outline:none; background:#09090b; color:#e4e4e7;
      }
      #ai-help-input:focus { border-color:#ea580c; }
      #ai-help-send {
        padding:8px 16px; border:none; border-radius:20px;
        background:linear-gradient(135deg,#dc2626,#ea580c); color:#fff;
        font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap;
        transition:opacity 0.15s;
      }
      #ai-help-send:hover { opacity:0.9; }
      #ai-help-send:disabled { opacity:0.5; cursor:not-allowed; }
      #ai-help-actions {
        display:flex; align-items:center; justify-content:space-between; margin-top:8px; padding:0 4px;
      }
      #ai-help-ticket {
        font-size:12px; color:#ea580c; text-decoration:none; font-weight:500;
      }
      #ai-help-ticket:hover { text-decoration:underline; }
      @media (max-width:480px) {
        #ai-help-chat { width:calc(100vw - 32px); right:-4px; bottom:60px; max-height:70vh; }
      }
    `;
    document.head.appendChild(style);

    // Event listeners
    document.getElementById('ai-help-btn').addEventListener('click', toggleChat);
    document.getElementById('ai-help-close').addEventListener('click', toggleChat);
    document.getElementById('ai-help-send').addEventListener('click', sendMessage);
    document.getElementById('ai-help-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
  }

  function toggleChat() {
    isOpen = !isOpen;
    var chat = document.getElementById('ai-help-chat');
    var btn = document.getElementById('ai-help-btn');
    if (!chat || !btn) return;

    chat.style.display = isOpen ? 'flex' : 'none';
    btn.style.display = isOpen ? 'none' : 'flex';

    if (isOpen && chatHistory.length === 0) {
      // Show greeting
      addMessage('bot', getGreeting());
    }

    if (isOpen) {
      setTimeout(function() {
        var input = document.getElementById('ai-help-input');
        if (input) input.focus();
      }, 100);
    }
  }

  function addMessage(role, text) {
    var container = document.getElementById('ai-help-messages');
    if (!container) return;

    var div = document.createElement('div');
    div.className = 'ai-msg ' + (role === 'user' ? 'ai-msg-user' : 'ai-msg-bot');
    // Render basic markdown bold
    var rendered = escText(text).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
    div.innerHTML = rendered;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;

    if (role !== 'typing') {
      chatHistory.push({ role: role === 'user' ? 'user' : 'assistant', content: text });
    }
  }

  function showTyping() {
    var container = document.getElementById('ai-help-messages');
    if (!container) return;
    var div = document.createElement('div');
    div.className = 'ai-msg ai-msg-typing';
    div.id = 'ai-typing';
    div.textContent = '...';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function removeTyping() {
    var el = document.getElementById('ai-typing');
    if (el) el.remove();
  }

  function escText(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  async function sendMessage() {
    if (isLoading) return;
    var input = document.getElementById('ai-help-input');
    var sendBtn = document.getElementById('ai-help-send');
    if (!input) return;

    var msg = input.value.trim();
    if (!msg) return;

    input.value = '';
    addMessage('user', msg);

    isLoading = true;
    sendBtn.disabled = true;
    showTyping();

    try {
      var resp = await fetch('/api/support/ai-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          message: msg,
          history: chatHistory.filter(function(h) { return h.role === 'user' || h.role === 'assistant'; }),
          page: getCurrentPage()
        })
      });

      removeTyping();

      if (resp.status === 429) {
        addMessage('bot', t('limit'));
        return;
      }

      var data = await resp.json();
      if (data.ok && data.reply) {
        addMessage('bot', data.reply);
      } else {
        addMessage('bot', t('error'));
      }
    } catch(e) {
      removeTyping();
      addMessage('bot', t('error'));
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // Init: wait for page to be ready and user to be logged in
  function initWidget() {
    // Don't show on admin or auth pages
    var path = window.location.pathname;
    if (path.includes('admin') || path === '/login' || path === '/register' || path === '/') return;

    // Check if already created
    if (document.getElementById('ai-help-widget')) return;

    createWidget();
  }

  // Try to init after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(initWidget, 500); });
  } else {
    setTimeout(initWidget, 500);
  }

  // Re-init on navigation (SPA)
  var _origPushState = history.pushState;
  history.pushState = function() {
    _origPushState.apply(this, arguments);
    setTimeout(function() {
      // Update greeting if chat is closed and empty
      if (!isOpen && chatHistory.length === 0) {
        var el = document.getElementById('ai-help-widget');
        if (!el) initWidget();
      }
    }, 300);
  };
})();
