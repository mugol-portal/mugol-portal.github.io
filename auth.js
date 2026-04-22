/* =========================================================
   AUTH.JS — V3.1 ULTRA MASTER STABLE
   MuGöl PORTAL · Kayıt Sorunu Giderildi & UX İyileştirildi
   ========================================================= */

(function () {

    /* --------------------------------------------------
       1. STİLLER (PREMIUM & MASTER)
    -------------------------------------------------- */
    var css = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Nunito:wght@400;700;900&display=swap');

        #auth-overlay {
            display: none; position: fixed; inset: 0; z-index: 999998;
            background: #0f172a; align-items: center; justify-content: center;
            padding: 15px; font-family: 'Plus Jakarta Sans', sans-serif;
            box-sizing: border-box; opacity: 0; transition: opacity 0.8s ease;
        }
        #auth-overlay.visible { display: flex !important; opacity: 1; }

        .auth-aura { position: absolute; width: 100%; height: 100%; z-index: -1; overflow: hidden; }
        .auth-aura div { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.2; animation: authAuraMove 12s infinite alternate; }
        .aura-1 { width: 450px; height: 450px; background: #4318ff; top: -10%; left: -10%; }
        .aura-2 { width: 350px; height: 350px; background: #00d2ff; bottom: -10%; right: -10%; }
        @keyframes authAuraMove { from { transform: translate(0,0) scale(1); } to { transform: translate(50px, 50px) scale(1.1); } }

        #auth-box {
            background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
            border-radius: 35px; width: 100%; max-width: 410px; max-height: 95vh; overflow-y: auto;
            padding: 35px 25px; box-shadow: 0 40px 100px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.4); position: relative; box-sizing: border-box;
            animation: authPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        [data-theme="dark"] #auth-box { background: rgba(30, 41, 59, 0.95); border-color: rgba(255, 255, 255, 0.1); }

        .auth-brand-wrapper { display: flex; flex-direction: column; align-items: center; margin-bottom: 25px; }
        .auth-logo-row { display: flex; flex-direction: row; align-items: center; gap: 15px; }
        .auth-brand-name { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.6rem; color: #0f172a; letter-spacing: -0.5px; }
        [data-theme="dark"] .auth-brand-name { color: #f8fafc; }
        
        .auth-logo-icon { width: 55px; height: 55px; background: linear-gradient(135deg, #4318ff, #00d2ff); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(67, 24, 255, 0.2); }
        .auth-greeting-text { font-size: 1.2rem; font-weight: 900; color: #0f172a; margin-top: 10px; font-family: 'Nunito', sans-serif; text-align: center; }
        [data-theme="dark"] .auth-greeting-text { color: #f8fafc; }

        .auth-tabs { display: flex; background: rgba(0,0,0,0.05); padding: 5px; border-radius: 16px; margin-bottom: 20px; }
        .auth-tab-btn { flex: 1; padding: 10px; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; background: transparent; color: #64748b; font-family: inherit; }
        .auth-tab-btn.active { background: #fff; color: #4318ff; box-shadow: 0 5px 12px rgba(0,0,0,0.05); }

        .auth-form { display: flex; flex-direction: column; gap: 15px; width: 100%; }
        .auth-form.hidden { display: none; }

        .auth-input-group label { font-size: 0.8rem; font-weight: 800; color: #64748b; margin-left: 5px; display: block; margin-bottom: 6px; }
        .auth-input-group input { width: 100%; padding: 14px 16px; border: 2px solid transparent; border-radius: 15px; background: rgba(0,0,0,0.04); font-size: 0.95rem; font-weight: 600; box-sizing: border-box; outline: none; transition: 0.3s; color: inherit; }
        .auth-input-group input:focus { border-color: #4318ff; background: #fff; }

        .auth-pass-wrap { position: relative; width: 100%; display: flex; align-items: center; }
        .auth-pass-wrap input { padding-right: 85px !important; }
        .auth-pass-toggle { position: absolute; right: 12px; background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 1.1rem; z-index: 5; }
        .caps-warn { position: absolute; right: 45px; font-size: 0.6rem; font-weight: 800; color: #f59e0b; display: none; background: rgba(245, 158, 11, 0.1); padding: 2px 5px; border-radius: 4px; z-index: 4; }

        .strength-meter { height: 4px; width: 100%; background: rgba(0,0,0,0.05); margin-top: -5px; border-radius: 2px; overflow: hidden; display: none; }
        .strength-bar { height: 100%; width: 0; transition: 0.4s ease; }

        .auth-account-card { background: linear-gradient(135deg, rgba(67, 24, 255, 0.05), rgba(0, 210, 255, 0.05)); border: 1px solid rgba(67, 24, 255, 0.1); border-radius: 18px; padding: 12px 15px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: 0.3s; margin-bottom: 15px; }
        .auth-account-avatar { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; }

        .auth-btn { width: 100%; padding: 15px; border: none; border-radius: 16px; background: linear-gradient(135deg, #4318ff, #00d2ff); color: #fff; font-weight: 800; font-size: 1rem; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .auth-btn:disabled { opacity: 0.7; cursor: wait; }
        .btn-quick-access { background: linear-gradient(135deg, #f59e0b, #ef4444) !important; margin-top: 5px; }

        .auth-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: #1e293b; color: #fff; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; z-index: 1000000; transition: 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55); box-shadow: 0 10px 30px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 10px; }
        .auth-toast.show { transform: translateX(-50%) translateY(0); }

        .auth-success-screen { display: none; position: absolute; inset: 0; background: inherit; border-radius: inherit; z-index: 100; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        @keyframes authSpin { to { transform: rotate(360deg); } }
        .auth-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: authSpin 0.8s linear infinite; }
        .auth-error-box { display: none; background: rgba(239, 68, 68, 0.1); border-radius: 12px; padding: 10px; font-size: 0.8rem; font-weight: 700; color: #ef4444; text-align: center; margin-bottom: 10px; }
        .auth-error-box.show { display: block; animation: authShake 0.4s; }
        @keyframes authShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
    `;

    var styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    /* --------------------------------------------------
       2. HTML
    -------------------------------------------------- */
    var html = `
        <div id="auth-toast" class="auth-toast"><i class="fas fa-info-circle"></i> <span id="auth-toast-text">İşlem Başarılı</span></div>
        <div id="auth-overlay">
            <div class="auth-aura"><div class="aura-1"></div><div class="aura-2"></div></div>
            <div id="auth-box">
                <div id="authSuccessScreen" class="auth-success-screen">
                    <div style="width:70px; height:70px; background:#10b981; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2rem; margin-bottom:15px;"><i class="fas fa-check"></i></div>
                    <h2 id="successUserTitle" style="font-weight:900; margin:0; color:var(--text-main);">Hoş Geldin!</h2>
                    <p style="color:#64748b; font-weight:600; font-size:0.9rem;">Portal hazırlanıyor...</p>
                </div>

                <div class="auth-brand-wrapper">
                    <div class="auth-logo-row">
                        <div class="auth-logo-icon">
                            <img src="logo.png" alt="MG" style="height:32px;" onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
                            <span style="display:none; color:#fff; font-weight:900; font-size:1.1rem;">MG</span>
                        </div>
                        <span class="auth-brand-name">MuGöl <span style="color:#4318ff">PORTAL</span></span>
                    </div>
                    <div class="auth-greeting-text" id="dynamicGreeting">Hoş Geldiniz</div>
                </div>

                <div class="auth-tabs">
                    <button class="auth-tab-btn active" id="authTabLogin" onclick="MugolAuth.switchTab('login')">Giriş Yap</button>
                    <button class="auth-tab-btn" id="authTabRegister" onclick="MugolAuth.switchTab('register')">Kayıt Ol</button>
                </div>

                <div class="auth-form" id="authLoginForm">
                    <div id="authSavedContainer"></div>
                    <div class="auth-input-group"><label>Kullanıcı Adı</label><input type="text" id="auth-login-user" placeholder="Kullanıcı adınız"></div>
                    <div class="auth-input-group">
                        <label>Şifre</label>
                        <div class="auth-pass-wrap">
                            <input type="password" id="auth-login-pass" placeholder="••••••••">
                            <div class="caps-warn" id="capsWarn">CAPS</div>
                            <button type="button" class="auth-pass-toggle" onclick="MugolAuth.togglePassVis('auth-login-pass', this)"><i class="fas fa-eye"></i></button>
                        </div>
                    </div>
                    <div class="auth-error-box" id="loginError"></div>
                    <button class="auth-btn" id="authLoginBtn" onclick="MugolAuth.doLogin()">
                        <span id="authLoginSpinner" style="display:none;" class="auth-spinner"></span>
                        <span id="authLoginText">Giriş Yap</span>
                    </button>
                    <button class="auth-btn btn-quick-access" onclick="MugolAuth.doQuickLogin()"><i class="fas fa-bolt"></i> Hızlı Giriş</button>
                </div>

                <div class="auth-form hidden" id="authRegisterForm">
                    <div class="auth-input-group"><label>Yeni Kullanıcı Adı</label><input type="text" id="auth-reg-user" placeholder="En az 3 karakter"></div>
                    <div class="auth-input-group">
                        <label>Şifre Oluştur</label>
                        <div class="auth-pass-wrap">
                            <input type="password" id="auth-reg-pass" placeholder="En az 6 karakter" oninput="MugolAuth.updateStrength(this.value)">
                            <button type="button" class="auth-pass-toggle" onclick="MugolAuth.togglePassVis('auth-reg-pass', this)"><i class="fas fa-eye"></i></button>
                        </div>
                    </div>
                    <div class="strength-meter" id="strengthMeter"><div id="strengthBar" class="strength-bar"></div></div>
                    <div class="auth-error-box" id="registerError"></div>
                    <button class="auth-btn" id="authRegBtn" onclick="MugolAuth.doRegister()">
                        <span id="authRegSpinner" style="display:none;" class="auth-spinner"></span>
                        <span id="authRegText">Hesap Oluştur</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    var container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    /* --------------------------------------------------
       3. LOGİK (FIXED & IMPROVED)
    -------------------------------------------------- */
    window.MugolAuth = {
        getUsers: function () {
            try { return JSON.parse(localStorage.getItem('mugol-users') || '{}'); } catch (e) { return {}; }
        },
        saveUsers: function (users) { localStorage.setItem('mugol-users', JSON.stringify(users)); },
        
        showToast: function(msg) {
            const toast = document.getElementById('auth-toast');
            if(!toast) return;
            document.getElementById('auth-toast-text').textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        },

        updateStrength: function(val) {
            const meter = document.getElementById('strengthMeter');
            const bar = document.getElementById('strengthBar');
            if(!val) { meter.style.display = 'none'; return; }
            meter.style.display = 'block';
            let s = 0;
            if(val.length > 5) s++;
            if(/[A-Z]/.test(val)) s++;
            if(/[0-9]/.test(val)) s++;
            if(/[^A-Za-z0-9]/.test(val)) s++;
            const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
            bar.style.width = s > 0 ? (s * 25) + '%' : '10%';
            bar.style.background = colors[s-1] || colors[0];
        },

        updateGreeting: function() {
            const saved = localStorage.getItem('mugol-remember-user');
            const el = document.getElementById('dynamicGreeting');
            if (saved) {
                el.innerHTML = `Tekrar Hoş Geldin, <span style="color:#4318ff">${saved}</span>`;
            } else {
                var hr = new Date().getHours();
                var greet = (hr < 12) ? "Günaydın" : (hr < 18) ? "Tünaydın" : "İyi Akşamlar";
                el.innerHTML = greet + ', <span style="color:#4318ff">PORTAL</span>';
            }
        },

        switchTab: function (tab) {
            document.getElementById('authLoginForm').classList.toggle('hidden', tab !== 'login');
            document.getElementById('authRegisterForm').classList.toggle('hidden', tab !== 'register');
            document.getElementById('authTabLogin').classList.toggle('active', tab === 'login');
            document.getElementById('authTabRegister').classList.toggle('active', tab === 'register');
            document.getElementById('registerError').classList.remove('show');
            document.getElementById('loginError').classList.remove('show');
        },

        togglePassVis: function (id, btn) {
            var input = document.getElementById(id);
            if(!input) return;
            input.type = input.type === 'password' ? 'text' : 'password';
            btn.querySelector('i').className = input.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        },

        loadSavedAccounts: function () {
            var users = this.getUsers();
            var saved = localStorage.getItem('mugol-remember-user');
            var cont = document.getElementById('authSavedContainer');
            if (!cont) return;
            if (saved && users[saved]) {
                const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
                const avatarCol = colors[saved.length % colors.length];
                cont.innerHTML = `
                    <div class="auth-account-card" onclick="MugolAuth.quickFill('${saved}')">
                        <div class="auth-account-avatar" style="background:${avatarCol}">${saved.charAt(0).toUpperCase()}</div>
                        <div style="flex:1;"><div style="font-weight:800; color:var(--text-main);">${saved}</div><div style="font-size:0.7rem; color:#64748b;">Kayıtlı Profil</div></div>
                        <i class="fas fa-trash-alt" style="color:#94a3b8; padding:5px;" onclick="event.stopPropagation(); MugolAuth.clearSaved()"></i>
                    </div>`;
            } else { cont.innerHTML = ''; }
        },

        quickFill: function(user) {
            var users = this.getUsers();
            document.getElementById('auth-login-user').value = user;
            document.getElementById('auth-login-pass').value = users[user] || '';
            document.getElementById('auth-login-pass').focus();
        },

        clearSaved: function () { 
            localStorage.removeItem('mugol-remember-user'); 
            this.loadSavedAccounts(); this.updateGreeting();
            this.showToast("Kayıtlı hesap kaldırıldı.");
        },
        
        doLogin: function () {
            var user = document.getElementById('auth-login-user').value.trim();
            var pass = document.getElementById('auth-login-pass').value;
            var users = this.getUsers();
            var err = document.getElementById('loginError');

            if (user && users[user] && users[user] === pass) {
                document.getElementById('authLoginSpinner').style.display = 'inline-block';
                document.getElementById('authLoginText').textContent = 'Doğrulanıyor...';
                setTimeout(() => {
                    localStorage.setItem('mugol-remember-user', user);
                    sessionStorage.setItem('mugol-session', user);
                    this.showSuccess(user);
                }, 1000);
            } else {
                err.textContent = "Kullanıcı adı veya şifre yanlış!";
                err.classList.add('show');
            }
        },

        doQuickLogin: function() {
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const guestUser = "Misafir_" + randomNum;
            const guestPass = "mg" + randomNum;
            var users = this.getUsers();
            users[guestUser] = guestPass;
            this.saveUsers(users);
            localStorage.setItem('mugol-remember-user', guestUser);
            sessionStorage.setItem('mugol-session', guestUser);
            this.showSuccess(guestUser);
        },

        doRegister: function () {
            const user = document.getElementById('auth-reg-user').value.trim();
            const pass = document.getElementById('auth-reg-pass').value;
            const err = document.getElementById('registerError');
            const btn = document.getElementById('authRegBtn');
            const spin = document.getElementById('authRegSpinner');
            const txt = document.getElementById('authRegText');
            var users = this.getUsers();

            if (user.length < 3 || pass.length < 6) {
                err.textContent = "Kullanıcı adı (3+) veya şifre (6+) çok kısa!";
                err.classList.add('show'); return;
            }
            if (users[user]) {
                err.textContent = "Bu kullanıcı adı zaten mevcut!";
                err.classList.add('show'); return;
            }

            // Kayıt İşlemi Başlat
            btn.disabled = true;
            spin.style.display = 'inline-block';
            txt.textContent = 'Oluşturuluyor...';

            setTimeout(() => {
                users[user] = pass;
                this.saveUsers(users);
                localStorage.setItem('mugol-remember-user', user);
                
                this.showToast("Hesap başarıyla oluşturuldu!");
                
                // Formu temizle ve Giriş ekranına dön
                document.getElementById('auth-reg-user').value = '';
                document.getElementById('auth-reg-pass').value = '';
                this.updateStrength('');
                
                btn.disabled = false;
                spin.style.display = 'none';
                txt.textContent = 'Hesap Oluştur';
                
                this.switchTab('login');
                this.loadSavedAccounts();
                this.updateGreeting();
                
                // Giriş alanlarını doldur
                document.getElementById('auth-login-user').value = user;
                document.getElementById('auth-login-pass').value = pass;
                document.getElementById('auth-login-pass').focus();
            }, 1000);
        },

        showSuccess: function(name) {
            var screen = document.getElementById('authSuccessScreen');
            document.getElementById('successUserTitle').textContent = "Hoş Geldin, " + name + "!";
            screen.style.display = 'flex';
            setTimeout(() => {
                document.getElementById('auth-overlay').classList.remove('visible');
                var welcome = document.getElementById('welcomeTitle');
                if (welcome) welcome.textContent = 'Hoş Geldin, ' + name + '! 👋';
            }, 1600);
        },

        checkAuth: function () {
            var session = sessionStorage.getItem('mugol-session');
            if (session) {
                var welcome = document.getElementById('welcomeTitle');
                if (welcome) welcome.textContent = 'Hoş Geldin, ' + session + '! 👋';
                return false; 
            }
            document.getElementById('auth-overlay').classList.add('visible');
            this.updateGreeting();
            this.loadSavedAccounts();
            return true;
        }
    };

    document.addEventListener('keydown', function (e) {
        var warn = document.getElementById('capsWarn');
        if (warn) warn.style.display = (e.getModifierState && e.getModifierState('CapsLock')) ? 'block' : 'none';
        if (e.key === 'Enter' && document.getElementById('auth-overlay').classList.contains('visible')) {
            var isRegVisible = !document.getElementById('authRegisterForm').classList.contains('hidden');
            if (isRegVisible) MugolAuth.doRegister(); else MugolAuth.doLogin();
        }
    });
})();