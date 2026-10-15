const fs = require('fs');

const jsCode = fs.readFileSync('scratch/bot_clean.js', 'utf8');

const window = {
    location: { reload: function() { console.log('location.reload() called'); } },
    AndroidBridge: {
        onTaskAction: function(msg) { console.log('>>> AndroidBridge.onTaskAction:', msg); },
        onPlatformSwitched: function(p) { console.log('>>> AndroidBridge.onPlatformSwitched:', p); }
    }
};

const document = {
    querySelector: function(s) {
        if (s.indexOf('platform-chip.active') !== -1) {
            return { dataset: { platform: 'instagram' } };
        }
        if (s.indexOf('sort-btn') !== -1) {
            return { classList: { contains: () => true } };
        }
        return null;
    },
    querySelectorAll: function(s) {
        if (s.indexOf('.task-card') !== -1) {
            return [
                {
                    getAttribute: (attr) => attr === 'onclick' ? 'openTask(1373895)' : null,
                    dataset: {},
                    style: {},
                    click: () => console.log('>>> CLICKED CARD 1373895!')
                },
                {
                    getAttribute: (attr) => attr === 'onclick' ? 'openTask(104570)' : null,
                    dataset: {},
                    style: {},
                    click: () => console.log('>>> CLICKED CARD 104570!')
                }
            ];
        }
        if (s.indexOf('platform-chip') !== -1) {
            return [
                { dataset: { platform: 'instagram' }, classList: { contains: () => false } }
            ];
        }
        return [];
    },
    getElementById: function(id) {
        return null;
    }
};

const localStorage = {
    setItem: function(k, v) { console.log('localStorage.setItem', k); }
};

const fetch = function(url, opts) {
    console.log('fetch called with:', url);
    return Promise.resolve({
        ok: true,
        json: function() { return Promise.resolve({ items: [] }); }
    });
};

const setInterval = function(fn, ms) {
    console.log('setInterval registered with ms:', ms);
    console.log('--- EXECUTING INTERVAL CALLBACK ONCE ---');
    try {
        fn();
        console.log('--- INTERVAL CALLBACK FINISHED SUCCESSFULLY ---');
    } catch(e) {
        console.error('--- ERROR IN INTERVAL CALLBACK ---', e);
    }
    return 123;
};

const clearInterval = function(id) { console.log('clearInterval', id); };
const setTimeout = function(fn, ms) { console.log('setTimeout', ms); return 456; };
const clearTimeout = function(id) { console.log('clearTimeout', id); };
const console = global.console;

eval(jsCode);
