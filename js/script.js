/* ============================================================
   js/script.js -- Life Dashboard
   Vanilla JS only. No frameworks. No dependencies.
   ============================================================ */

const App = {};

// App.Theme
App.Theme = (function () {
  var KEY = 'dashboard_theme';
  var VALID = ['dark', 'light'];
  var _current = 'dark';

  function getStored() {
    try {
      var v = localStorage.getItem(KEY);
      return (v === 'dark' || v === 'light') ? v : 'dark';
    } catch(e) { return 'dark'; }
  }

  function applyTheme(theme) {
    _current = theme;
    document.documentElement.dataset.theme = theme;
    var icon = document.getElementById('theme-icon');
    var btn = document.getElementById('theme-toggle');
    if (icon) icon.textContent = theme === 'dark' ? '\u263E' : '\u2600';
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function persist(theme) {
    try { localStorage.setItem(KEY, theme); } catch(e) {}
  }

  return {
    init: function() {
      applyTheme(getStored());
      var btn = document.getElementById('theme-toggle');
      if (btn) btn.addEventListener('click', function() { App.Theme.toggle(); });
    },
    toggle: function() {
      var next = _current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      persist(next);
    },
    get: function() { return _current; }
  };
})();

// App.User
App.User = (function () {
  var KEY = 'dashboard_username';
  var MAX = 50;
  var _name = '';

  function loadFromStorage() {
    try {
      var v = localStorage.getItem(KEY);
      if (!v) return '';
      var t = v.trim();
      return t.length <= MAX ? t : '';
    } catch(e) { return ''; }
  }

  return {
    init: function() {
      _name = loadFromStorage();
      var input = document.getElementById('name-input');
      if (input && _name) input.value = _name;
      var btn = document.getElementById('name-save-btn');
      if (btn) btn.addEventListener('click', function() {
        var inp = document.getElementById('name-input');
        if (inp) App.User.save(inp.value);
      });
      if (input) input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') App.User.save(input.value);
      });
    },
    save: function(raw) {
      var t = (raw || '').trim();
      if (t === '') {
        _name = '';
        try { localStorage.removeItem(KEY); } catch(e) {}
      } else if (t.length <= MAX) {
        _name = t;
        try { localStorage.setItem(KEY, _name); } catch(e) {}
      }
      if (App.Clock && typeof App.Clock.updateGreeting === 'function') App.Clock.updateGreeting();
    },
    get: function() { return _name; }
  };
})();

// App.Clock
App.Clock = (function () {
  var _intervalId = null;

  function getGreeting(hour) {
    if (hour >= 5 && hour <= 11) return 'Good Morning';
    if (hour >= 12 && hour <= 17) return 'Good Afternoon';
    if (hour >= 18 && hour <= 20) return 'Good Evening';
    return 'Good Night';
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function render() {
    var now = new Date();
    var h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    var timeEl = document.getElementById('clock-time');
    if (timeEl) timeEl.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
    var dateEl = document.getElementById('clock-date');
    if (dateEl) dateEl.textContent = now.toLocaleDateString(undefined, {weekday:'long',year:'numeric',month:'long',day:'numeric'});
    updateGreetingDisplay(h);
  }

  function updateGreetingDisplay(hour) {
    var el = document.getElementById('greeting-text');
    if (!el) return;
    if (hour === undefined) hour = new Date().getHours();
    var base = getGreeting(hour);
    var name = (App.User && typeof App.User.get === 'function') ? App.User.get() : '';
    el.textContent = name ? base + ', ' + name : base;
  }

  return {
    init: function() {
      render();
      _intervalId = setInterval(render, 1000);
    },
    updateGreeting: function() { updateGreetingDisplay(); }
  };
})();

// App.Timer
App.Timer = (function () {
  var DURATION = 25 * 60;
  var _remaining = DURATION;
  var _running = false;
  var _complete = false;
  var _intervalId = null;

  function pad(n) { return String(n).padStart(2, '0'); }

  function render() {
    var el = document.getElementById('timer-display');
    if (el) el.textContent = pad(Math.floor(_remaining / 60)) + ':' + pad(_remaining % 60);
  }

  function showComplete() {
    var ctrl = document.getElementById('timer-controls');
    var comp = document.getElementById('timer-complete');
    if (ctrl) ctrl.hidden = true;
    if (comp) comp.hidden = false;
  }

  function showControls() {
    var ctrl = document.getElementById('timer-controls');
    var comp = document.getElementById('timer-complete');
    if (ctrl) ctrl.hidden = false;
    if (comp) comp.hidden = true;
  }

  function tick() {
    _remaining--;
    if (_remaining <= 0) {
      _remaining = 0;
      render();
      clearInterval(_intervalId);
      _intervalId = null;
      _running = false;
      _complete = true;
      showComplete();
    } else {
      render();
    }
  }

  return {
    init: function() {
      render();
      showControls();
      document.getElementById('timer-start').addEventListener('click', function() { App.Timer.start(); });
      document.getElementById('timer-pause').addEventListener('click', function() { App.Timer.pause(); });
      document.getElementById('timer-reset').addEventListener('click', function() { App.Timer.reset(); });
    },
    start: function() {
      if (_running || _complete) return;
      clearInterval(_intervalId);
      _intervalId = setInterval(tick, 1000);
      _running = true;
    },
    pause: function() {
      clearInterval(_intervalId);
      _intervalId = null;
      _running = false;
    },
    reset: function() {
      clearInterval(_intervalId);
      _intervalId = null;
      _remaining = DURATION;
      _running = false;
      _complete = false;
      render();
      showControls();
    }
  };
})();

// App.Todo
App.Todo = (function () {
  var KEY = 'dashboard_tasks';
  var _tasks = [];

  function loadTasks() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch(e) { return []; }
  }

  function saveTasks() {
    try { localStorage.setItem(KEY, JSON.stringify(_tasks)); } catch(e) {}
  }

  function isDuplicate(title, excludeId) {
    var norm = title.trim().toLowerCase();
    return _tasks.some(function(t) {
      return t.id !== excludeId && t.title.trim().toLowerCase() === norm;
    });
  }

  function showError(msg) {
    var el = document.getElementById('task-error');
    if (el) { el.textContent = msg; el.hidden = false; }
  }
  function clearError() {
    var el = document.getElementById('task-error');
    if (el) { el.textContent = ''; el.hidden = true; }
  }

  function startEdit(li, task) {
    while (li.firstChild) li.removeChild(li.firstChild);
    var row = document.createElement('div');
    row.className = 'task-edit-row';
    var inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'task-edit-input';
    inp.value = task.title;
    inp.maxLength = 300;
    inp.setAttribute('aria-label', 'Edit task title');
    var saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-accent';
    saveBtn.textContent = 'Save';
    saveBtn.style.minWidth = '44px';
    saveBtn.style.minHeight = '44px';
    saveBtn.setAttribute('aria-label', 'Save edit');
    var cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-ghost';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.minWidth = '44px';
    cancelBtn.style.minHeight = '44px';
    cancelBtn.setAttribute('aria-label', 'Cancel edit');
    function doSave() { App.Todo.edit(task.id, inp.value); }
    saveBtn.addEventListener('click', doSave);
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') doSave();
      if (e.key === 'Escape') renderTasks();
    });
    cancelBtn.addEventListener('click', renderTasks);
    row.appendChild(inp);
    row.appendChild(saveBtn);
    row.appendChild(cancelBtn);
    li.appendChild(row);
    inp.focus(); inp.select();
  }

  function renderTasks() {
    var list = document.getElementById('task-list');
    if (!list) return;
    while (list.firstChild) list.removeChild(list.firstChild);
    _tasks.forEach(function(task) {
      var li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');
      li.dataset.id = task.id;
      var chk = document.createElement('button');
      chk.className = 'task-checkbox';
      chk.setAttribute('aria-label', task.completed ? 'Mark incomplete' : 'Mark complete');
      chk.setAttribute('aria-pressed', String(task.completed));
      if (task.completed) chk.textContent = '\u2713';
      chk.addEventListener('click', function() { App.Todo.toggle(task.id); });
      var titleSpan = document.createElement('span');
      titleSpan.className = 'task-title';
      titleSpan.appendChild(document.createTextNode(task.title));
      var actions = document.createElement('div');
      actions.className = 'task-actions';
      var editBtn = document.createElement('button');
      editBtn.className = 'btn-task btn-task-edit';
      editBtn.textContent = 'Edit';
      editBtn.setAttribute('aria-label', 'Edit task: ' + task.title);
      editBtn.addEventListener('click', function() { startEdit(li, task); });
      var delBtn = document.createElement('button');
      delBtn.className = 'btn-task btn-task-delete';
      delBtn.textContent = 'Del';
      delBtn.setAttribute('aria-label', 'Delete task: ' + task.title);
      delBtn.addEventListener('click', function() { App.Todo.delete(task.id); });
      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
      li.appendChild(chk);
      li.appendChild(titleSpan);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  return {
    init: function() {
      _tasks = loadTasks();
      renderTasks();
      var addBtn = document.getElementById('task-add-btn');
      var inp = document.getElementById('task-input');
      function doAdd() { App.Todo.add(inp ? inp.value : ''); }
      if (addBtn) addBtn.addEventListener('click', doAdd);
      if (inp) inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') doAdd(); });
    },
    add: function(raw) {
      var title = (raw || '').trim();
      if (!title) { showError('Task title cannot be empty.'); return; }
      if (isDuplicate(title, null)) { showError('This task already exists.'); return; }
      clearError();
      _tasks.push({ id: String(Date.now()), title: title, completed: false });
      saveTasks();
      renderTasks();
      var inp = document.getElementById('task-input');
      if (inp) { inp.value = ''; inp.focus(); }
    },
    edit: function(id, rawTitle) {
      var title = (rawTitle || '').trim();
      if (!title) { showError('Task title cannot be empty.'); return; }
      if (isDuplicate(title, id)) { showError('A task with that name already exists.'); return; }
      clearError();
      var task = _tasks.find(function(t) { return t.id === id; });
      if (task) { task.title = title; saveTasks(); }
      renderTasks();
    },
    toggle: function(id) {
      var task = _tasks.find(function(t) { return t.id === id; });
      if (task) { task.completed = !task.completed; saveTasks(); renderTasks(); }
    },
    delete: function(id) {
      _tasks = _tasks.filter(function(t) { return t.id !== id; });
      saveTasks();
      renderTasks();
    }
  };
})();

// App.Links
App.Links = (function () {
  var KEY = 'dashboard_links';
  var DEFAULTS = [
    { id: 'default-1', label: 'GitHub',       url: 'https://github.com' },
    { id: 'default-2', label: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
    { id: 'default-3', label: 'Google',       url: 'https://www.google.com' }
  ];
  var _links = [];

  function loadLinks() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return DEFAULTS.slice();
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULTS.slice();
      return parsed;
    } catch(e) { return DEFAULTS.slice(); }
  }

  function saveLinks() {
    try { localStorage.setItem(KEY, JSON.stringify(_links)); } catch(e) {}
  }

  function validateUrl(url) {
    var t = (url || '').trim();
    if (!t.startsWith('http://') && !t.startsWith('https://')) return false;
    var lo = t.toLowerCase();
    if (lo.startsWith('javascript:') || lo.startsWith('data:')) return false;
    try { new URL(t); return true; } catch(e) { return false; }
  }

  function showError(msg) {
    var el = document.getElementById('link-error');
    if (el) { el.textContent = msg; el.hidden = false; }
  }
  function clearError() {
    var el = document.getElementById('link-error');
    if (el) { el.textContent = ''; el.hidden = true; }
  }

  function renderLinks() {
    var list = document.getElementById('links-list');
    if (!list) return;
    while (list.firstChild) list.removeChild(list.firstChild);
    _links.forEach(function(link) {
      var li = document.createElement('li');
      li.className = 'link-item';
      var a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.appendChild(document.createTextNode(link.label));
      a.setAttribute('aria-label', 'Open ' + link.label + ' in new tab');
      var delBtn = document.createElement('button');
      delBtn.className = 'btn-link-delete';
      delBtn.textContent = '\u00D7';
      delBtn.setAttribute('aria-label', 'Delete link: ' + link.label);
      delBtn.addEventListener('click', function() { App.Links.delete(link.id); });
      li.appendChild(a);
      li.appendChild(delBtn);
      list.appendChild(li);
    });
  }

  return {
    init: function() {
      _links = loadLinks();
      renderLinks();
      var addBtn = document.getElementById('link-add-btn');
      var lblInp = document.getElementById('link-label-input');
      var urlInp = document.getElementById('link-url-input');
      if (addBtn) addBtn.addEventListener('click', function() {
        App.Links.add(lblInp ? lblInp.value : '', urlInp ? urlInp.value : '');
      });
      if (urlInp) urlInp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          App.Links.add(lblInp ? lblInp.value : '', urlInp.value);
        }
      });
      if (lblInp) lblInp.addEventListener('focus', clearError);
      if (urlInp) urlInp.addEventListener('focus', clearError);
    },
    add: function(rawLabel, rawUrl) {
      var label = (rawLabel || '').trim();
      var url = (rawUrl || '').trim();
      if (!label) { showError('Please enter a label.'); return; }
      if (label.length > 100) { showError('Label must be 100 characters or fewer.'); return; }
      if (!url) { showError('Please enter a URL.'); return; }
      if (!validateUrl(url)) { showError('URL must start with http:// or https://'); return; }
      clearError();
      _links.push({ id: String(Date.now()), label: label, url: url });
      saveLinks();
      renderLinks();
      var lbl = document.getElementById('link-label-input');
      var urlEl = document.getElementById('link-url-input');
      if (lbl) lbl.value = '';
      if (urlEl) urlEl.value = '';
      if (lbl) lbl.focus();
    },
    delete: function(id) {
      _links = _links.filter(function(l) { return l.id !== id; });
      saveLinks();
      renderLinks();
    }
  };
})();

// Init
document.addEventListener('DOMContentLoaded', function() {
  App.Theme.init();
  App.User.init();
  App.Clock.init();
  App.Timer.init();
  App.Todo.init();
  App.Links.init();
});
