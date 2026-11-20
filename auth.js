/* =========================================================
   AUTH.JS — Kullanıcı sistemi kaldırıldı.
   Geriye dönük uyumluluk için boş stub fonksiyonlar.
   ========================================================= */

var _db      = null;
var _fbReady = false;

function _initFirebase()         { return false; }
function _loadUsersFromCloud(cb) { if (cb) cb({}); }
function _saveUsersToCloud(u)    {}
function _getUsers()             { return {}; }

/* MugolAuth — tüm çağrılar sessizce yutulur */
var MugolAuth = {
    checkAuth:       function() {},
    openProfileLogin:function() {},
    doLogin:         function() {},
    doRegister:      function() {},
    doGuest:         function() {},
    showSuccess:     function() {},
    showToast:       function() {},
    getUsers:        function() { return {}; },
    saveUsers:       function() {}
};
