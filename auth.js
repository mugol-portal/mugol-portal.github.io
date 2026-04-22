/* =========================================================
   AUTH.JS — GİRİŞ / KAYIT SİSTEMİ
   MuGöl PORTAL · Bağımsız Dosya

   Düzenleyebileceğiniz ayarlar:
   - Arka plan rengi / gradyanı   → #auth-overlay background
   - Kutu rengi / boyutu          → #auth-box
   - Logo değiştirme              → .auth-logo-icon içindeki <img>
   - Şifre min uzunluğu           → doRegister() içinde pass.length < 6
   - Kullanıcı adını hatırla      → "Beni Hatırla" checkbox'ı
   ========================================================= */

(function () {

    /* --------------------------------------------------
       1. STİLLER
    -------------------------------------------------- */
    var css = `
        #auth-overlay {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 999997;
            background: linear-gradient(135deg, #4318ff 0%, #00d2ff 100%);
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        #auth-overlay.visible { display: flex !important; }

        #auth-box {
            background: var(--bg-card, #fff);
            border-radius: 28px;
            width: min(420px, 100%);
            padding: 2.5rem 2rem;
            box-shadow: 0 30px 80px rgba(0,0,0,0.3);
            animation: authPop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        [data-theme="dark"] #auth-box { background: #1e293b; }

        @keyframes authPop {
            from { opacity:0; transform: scale(0.88) translateY(24px); }
            to   { opacity:1; transform: scale(1)   translateY(0); }
        }

        .auth-logo {
            text-align: center;
            margin-bottom: 1.5rem;
        }
        .auth-logo .auth-logo-icon {
            width: 68px; height: 68px;
            background: linear-gradient(135deg, #4318ff, #00d2ff);
            border-radius: 18px;
            display: inline-flex; align-items: center; justify-content: center;
            font-size: 2rem; color: #fff;
            box-shadow: 0 10px 25px rgba(67,24,255,0.35);
            margin-bottom: 12px;
        }
        .auth-logo h2 {
            font-size: 1.5rem; font-weight: 900;
            color: var(--text-main, #0f172a);
            font-family: 'Nunito', sans-serif;
            margin: 0;
        }
        [data-theme="dark"] .auth-logo h2 { color: #f8fafc; }
        .auth-logo p {
            font-size: 0.9rem; color: var(--text-muted, #64748b);
            font-weight: 600; margin: 4px 0 0;
            font-family: 'Nunito', sans-serif;
        }

        .auth-tabs {
            display: flex; gap: 6px;
            background: var(--bg-body, #f1f5f9);
            border-radius: 14px; padding: 5px;
            margin-bottom: 1.5rem;
        }
        [data-theme="dark"] .auth-tabs { background: #0f172a; }

        .auth-tab-btn {
            flex: 1; padding: 10px;
            border: none; border-radius: 10px;
            font-family: 'Nunito', sans-serif;
            font-weight: 800; font-size: 0.95rem;
            cursor: pointer; transition: all 0.2s;
            background: transparent;
            color: var(--text-muted, #64748b);
        }
        .auth-tab-btn.active {
            background: var(--bg-card, #fff);
            color: var(--primary-color, #4318ff);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        [data-theme="dark"] .auth-tab-btn.active { background: #1e293b; }

        .auth-form { display: flex; flex-direction: column; gap: 14px; }
        .auth-form.hidden { display: none; }

        .auth-input-group {
            display: flex; flex-direction: column; gap: 6px;
        }
        .auth-input-group label {
            font-size: 0.85rem; font-weight: 800;
            color: var(--text-muted, #64748b);
            font-family: 'Nunito', sans-serif;
        }
        .auth-input-group input {
            padding: 12px 16px;
            border: 2px solid var(--border-color, #e2e8f0);
            border-radius: 12px;
            font-family: 'Nunito', sans-serif;
            font-size: 1rem; font-weight: 700;
            color: var(--text-main, #0f172a);
            background: var(--bg-body, #f8fafc);
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        [data-theme="dark"] .auth-input-group input {
            background: #0f172a; color: #f8fafc;
            border-color: #334155;
        }
        .auth-input-group input:focus {
            border-color: var(--primary-color, #4318ff);
            box-shadow: 0 0 0 3px rgba(67,24,255,0.1);
        }

        /* ====== BENİ HATIRLA ====== */
        .auth-remember {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            font-family: 'Nunito', sans-serif;
            font-size: 0.9rem;
            font-weight: 700;
            color: var(--text-muted, #64748b);
            user-select: none;
        }
        .auth-remember input[type="checkbox"] {
            width: 18px; height: 18px;
            accent-color: var(--primary-color, #4318ff);
            cursor: pointer;
            border-radius: 5px;
            padding: 0;
            border: 2px solid var(--border-color, #e2e8f0);
        }

        /* ====== KAYITLI GİRİŞ KUTUSU ====== */
        #auth-saved-user-box {
            display: none;
            background: linear-gradient(135deg, rgba(67,24,255,0.07), rgba(0,210,255,0.07));
            border: 1.5px solid rgba(67,24,255,0.18);
            border-radius: 14px;
            padding: 14px 16px;
            align-items: center;
            gap: 12px;
            margin-bottom: 4px;
        }
        #auth-saved-user-box.show { display: flex !important; }
        .auth-saved-avatar {
            width: 40px; height: 40px; border-radius: 50%;
            background: linear-gradient(135deg, #4318ff, #00d2ff);
            display: flex; align-items: center; justify-content: center;
            font-size: 1rem; font-weight: 900; color: #fff;
            font-family: 'Nunito', sans-serif;
            flex-shrink: 0;
        }
        .auth-saved-info {
            flex: 1;
        }
        .auth-saved-info span {
            display: block;
            font-family: 'Nunito', sans-serif;
        }
        .auth-saved-info .auth-saved-name {
            font-size: 1rem; font-weight: 900;
            color: var(--text-main, #0f172a);
        }
        [data-theme="dark"] .auth-saved-info .auth-saved-name { color: #f8fafc; }
        .auth-saved-info .auth-saved-hint {
            font-size: 0.78rem; font-weight: 700;
            color: var(--text-muted, #64748b);
        }
        .auth-saved-clear {
            background: none; border: none; cursor: pointer;
            color: var(--text-muted, #94a3b8);
            font-size: 1rem; padding: 4px;
            transition: color 0.2s;
        }
        .auth-saved-clear:hover { color: #ef4444; }

        /* ====== KULLANICI SEÇİCİ ====== */
        #auth-user-picker {
            display: none;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 2px;
        }
        #auth-user-picker.show { display: flex !important; }
        .auth-picker-label {
            font-size: 0.8rem; font-weight: 800;
            color: var(--text-muted, #64748b);
            font-family: 'Nunito', sans-serif;
            text-align: center;
            letter-spacing: 0.02em;
        }
        .auth-picker-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
        }
        .auth-picker-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            padding: 10px 14px;
            border-radius: 14px;
            border: 2px solid rgba(67,24,255,0.12);
            background: linear-gradient(135deg, rgba(67,24,255,0.05), rgba(0,210,255,0.05));
            transition: all 0.2s cubic-bezier(0.2,0.8,0.2,1);
            min-width: 68px;
            font-family: 'Nunito', sans-serif;
        }
        .auth-picker-item:hover {
            border-color: #4318ff;
            background: linear-gradient(135deg, rgba(67,24,255,0.12), rgba(0,210,255,0.12));
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(67,24,255,0.2);
        }
        .auth-picker-avatar {
            width: 44px; height: 44px; border-radius: 50%;
            background: linear-gradient(135deg, #4318ff, #00d2ff);
            display: flex; align-items: center; justify-content: center;
            font-size: 1.15rem; font-weight: 900; color: #fff;
            font-family: 'Nunito', sans-serif;
            box-shadow: 0 4px 12px rgba(67,24,255,0.25);
        }
        .auth-picker-name {
            font-size: 0.78rem; font-weight: 800;
            color: var(--text-main, #0f172a);
            max-width: 76px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        [data-theme="dark"] .auth-picker-name { color: #f8fafc; }
        .auth-picker-divider {
            display: flex; align-items: center; gap: 10px;
            margin: 2px 0;
        }
        .auth-picker-divider::before, .auth-picker-divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--border-color, #e2e8f0);
        }
        [data-theme="dark"] .auth-picker-divider::before,
        [data-theme="dark"] .auth-picker-divider::after { background: #334155; }
        .auth-picker-divider span {
            font-size: 0.78rem; font-weight: 700;
            color: var(--text-muted, #94a3b8);
            font-family: 'Nunito', sans-serif;
            white-space: nowrap;
        }

        /* ====== ŞİFRE GÖSTER ====== */
        .auth-pass-wrap {
            position: relative;
            display: flex;
            align-items: center;
        }
        .auth-pass-wrap input {
            width: 100%;
            padding-right: 48px !important;
            box-sizing: border-box;
        }
        .auth-pass-toggle {
            position: absolute;
            right: 13px;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted, #94a3b8);
            font-size: 1rem;
            padding: 6px;
            line-height: 1;
            transition: color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .auth-pass-toggle:hover { color: #4318ff; }

        .auth-btn {
            padding: 14px;
            background: linear-gradient(135deg, #4318ff, #00d2ff);
            color: #fff; border: none; border-radius: 14px;
            font-family: 'Nunito', sans-serif;
            font-size: 1rem; font-weight: 900;
            cursor: pointer; margin-top: 4px;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 6px 20px rgba(67,24,255,0.35);
        }
        .auth-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(67,24,255,0.45); }
        .auth-btn:active { transform: translateY(0); }

        .auth-error {
            display: none;
            background: rgba(239,68,68,0.1);
            border: 1px solid rgba(239,68,68,0.3);
            border-radius: 10px; padding: 10px 14px;
            font-size: 0.9rem; font-weight: 700;
            color: #ef4444; font-family: 'Nunito', sans-serif;
        }
        .auth-error.show { display: block; }
        .auth-success {
            display: none;
            background: rgba(16,185,129,0.1);
            border: 1px solid rgba(16,185,129,0.3);
            border-radius: 10px; padding: 10px 14px;
            font-size: 0.9rem; font-weight: 700;
            color: #10b981; font-family: 'Nunito', sans-serif;
        }
        .auth-success.show { display: block; }
        .auth-divider {
            text-align: center;
            font-size: 0.8rem; color: var(--text-muted, #94a3b8);
            font-weight: 700; margin: 4px 0;
            font-family: 'Nunito', sans-serif;
        }
    `;

    var styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);


    /* --------------------------------------------------
       2. HTML
    -------------------------------------------------- */
    var html = `
        <div id="auth-overlay" role="dialog" aria-modal="true" aria-label="Giriş Yap veya Kayıt Ol">
            <div id="auth-box">

                <div class="auth-logo">
                    <div class="auth-logo-icon">
                        <img src="logo.png" alt="MuGöl"
                            style="height:44px;border-radius:10px;object-fit:contain;"
                            onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
                        <span style="display:none;font-weight:900;font-size:1.1rem;font-family:Nunito,sans-serif;">MG</span>
                    </div>
                    <h2>MuGöl<span style="color:var(--primary-color,#4318ff)">PORTAL</span></h2>
                    <p>Devam etmek için giriş yapın</p>
                </div>

                <div class="auth-tabs">
                    <button class="auth-tab-btn active" id="authTabLogin"
                        onclick="MugolAuth.switchTab('login')">Giriş Yap</button>
                    <button class="auth-tab-btn" id="authTabRegister"
                        onclick="MugolAuth.switchTab('register')">Kayıt Ol</button>
                </div>

                <!-- GİRİŞ FORMU -->
                <div class="auth-form" id="authLoginForm">

                    <!-- KAYITLI KULLANICI SEÇİCİ -->
                    <div id="auth-user-picker">
                        <div class="auth-picker-label">⚡ Hızlı Giriş — Hesap Seç</div>
                        <div class="auth-picker-list" id="authPickerList"></div>
                        <div class="auth-picker-divider"><span>veya manuel giriş</span></div>
                    </div>

                    <!-- KAYITLI KULLANICI KUTUSU -->
                    <div id="auth-saved-user-box">
                        <div class="auth-saved-avatar" id="authSavedAvatar">?</div>
                        <div class="auth-saved-info">
                            <span class="auth-saved-name" id="authSavedName">-</span>
                            <span class="auth-saved-hint">Kayıtlı hesap</span>
                        </div>
                        <button class="auth-saved-clear" onclick="MugolAuth.clearSaved()" title="Hesabı unut">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="auth-input-group" id="authUserInputGroup">
                        <label for="auth-login-user">Kullanıcı Adı</label>
                        <input type="text" id="auth-login-user"
                            placeholder="kullanici_adi" autocomplete="username">
                    </div>
                    <div class="auth-input-group" id="authPassInputGroup">
                        <label for="auth-login-pass">Şifre</label>
                        <div class="auth-pass-wrap">
                            <input type="password" id="auth-login-pass"
                                placeholder="••••••••" autocomplete="current-password">
                            <button type="button" class="auth-pass-toggle" id="toggleLoginPass"
                                onclick="MugolAuth.togglePassVis('auth-login-pass', this)"
                                aria-label="Şifreyi göster/gizle">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <label class="auth-remember" id="authRememberLabel">
                        <input type="checkbox" id="authRemember" checked>
                        Beni hatırla (kullanıcı adını kaydet)
                    </label>
                    <div class="auth-error" id="loginError"></div>
                    <button class="auth-btn" id="authLoginBtn" onclick="MugolAuth.doLogin()">
                        <i class="fas fa-sign-in-alt" style="margin-right:8px;"></i>Giriş Yap
                    </button>
                    <div class="auth-divider">Hesabın yok mu? → Kayıt Ol sekmesine tıkla</div>
                </div>

                <!-- KAYIT FORMU -->
                <div class="auth-form hidden" id="authRegisterForm">
                    <div class="auth-input-group">
                        <label for="auth-reg-user">Kullanıcı Adı</label>
                        <input type="text" id="auth-reg-user"
                            placeholder="yeni_kullanici" autocomplete="username">
                    </div>
                    <div class="auth-input-group">
                        <label for="auth-reg-pass">Şifre</label>
                        <div class="auth-pass-wrap">
                            <input type="password" id="auth-reg-pass"
                                placeholder="••••••••" autocomplete="new-password">
                            <button type="button" class="auth-pass-toggle"
                                onclick="MugolAuth.togglePassVis('auth-reg-pass', this)"
                                aria-label="Şifreyi göster/gizle">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="auth-input-group">
                        <label for="auth-reg-pass2">Şifre Tekrar</label>
                        <div class="auth-pass-wrap">
                            <input type="password" id="auth-reg-pass2"
                                placeholder="••••••••" autocomplete="new-password">
                            <button type="button" class="auth-pass-toggle"
                                onclick="MugolAuth.togglePassVis('auth-reg-pass2', this)"
                                aria-label="Şifreyi göster/gizle">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="auth-error"   id="registerError"></div>
                    <div class="auth-success" id="registerSuccess"></div>
                    <button class="auth-btn" onclick="MugolAuth.doRegister()">
                        <i class="fas fa-user-plus" style="margin-right:8px;"></i>Kayıt Ol
                    </button>
                    <div class="auth-divider">Zaten hesabın var mı? → Giriş Yap sekmesine tıkla</div>
                </div>

            </div>
        </div>
    `;

    var container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);


    /* --------------------------------------------------
       3. LOGİK
    -------------------------------------------------- */
    window.MugolAuth = {

        getUsers: function () {
            try { return JSON.parse(localStorage.getItem('mugol-users') || '{}'); }
            catch (e) { return {}; }
        },

        /* Kayıtlı kullanıcı adını ekrana yükle */
        loadSavedUser: function () {
            var saved = localStorage.getItem('mugol-remember-user');
            var box            = document.getElementById('auth-saved-user-box');
            var userInputGroup = document.getElementById('authUserInputGroup');
            var passInputGroup = document.getElementById('authPassInputGroup');
            var rememberLabel  = document.getElementById('authRememberLabel');
            var loginBtn       = document.getElementById('authLoginBtn');

            if (saved) {
                /* Kayıtlı kullanıcı var → kutucuğu göster, inputlar da görünür kalsın */
                document.getElementById('authSavedName').textContent   = saved;
                document.getElementById('authSavedAvatar').textContent = saved.charAt(0).toUpperCase();
                document.getElementById('auth-login-user').value = saved;
                if (box)            box.classList.add('show');
                if (userInputGroup) userInputGroup.style.display = '';
                if (passInputGroup) passInputGroup.style.display = '';
                if (rememberLabel)  rememberLabel.style.display  = '';
                if (loginBtn)       loginBtn.innerHTML = '<i class="fas fa-sign-in-alt" style="margin-right:8px;"></i>Giriş Yap';
                /* Kayıtlı şifreyi şifre alanına doldur */
                var savedUsers = this.getUsers();
                var passInput  = document.getElementById('auth-login-pass');
                if (passInput) passInput.value = savedUsers[saved] || '';
            } else {
                /* Kayıtlı kullanıcı yok → normal görünüm */
                if (box)            box.classList.remove('show');
                if (userInputGroup) userInputGroup.style.display = '';
                if (passInputGroup) passInputGroup.style.display = '';
                if (rememberLabel)  rememberLabel.style.display  = '';
                if (loginBtn)       loginBtn.innerHTML = '<i class="fas fa-sign-in-alt" style="margin-right:8px;"></i>Giriş Yap';
            }
        },

        /* Kayıtlı kullanıcıyı unut */
        clearSaved: function () {
            localStorage.removeItem('mugol-remember-user');
            document.getElementById('auth-login-user').value = '';
            document.getElementById('auth-login-pass').value = '';
            this.loadSavedUser();
            this.loadUserPicker();
        },

        /* Tüm kayıtlı kullanıcıları seçici olarak göster
           (Zaten "Beni Hatırla" kutusunda gösterilen kullanıcı hariç) */
        loadUserPicker: function () {
            var users   = this.getUsers();
            var saved   = localStorage.getItem('mugol-remember-user') || '';
            /* Hatırlanan kullanıcıyı listeden çıkar — o zaten aşağıdaki kutuda var */
            var keys    = Object.keys(users).filter(function (u) { return u !== saved; });
            var picker  = document.getElementById('auth-user-picker');
            var list    = document.getElementById('authPickerList');
            if (!picker || !list) return;
            list.innerHTML = '';
            if (keys.length === 0) {
                picker.classList.remove('show');
                return;
            }
            var self = this;
            keys.forEach(function (username) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'auth-picker-item';
                btn.title = username + ' olarak giriş yap';
                btn.innerHTML =
                    '<div class="auth-picker-avatar">' + username.charAt(0).toUpperCase() + '</div>' +
                    '<span class="auth-picker-name">' + username + '</span>';
                btn.addEventListener('click', function () { self.selectUser(username); });
                list.appendChild(btn);
            });
            picker.classList.add('show');
        },

        /* Kullanıcıyı seç → kullanıcı adını forma doldur, şifre iste */
        selectUser: function (username) {
            var users = this.getUsers();
            if (!users[username]) return;
            /* Kullanıcı adını input'a yaz */
            var userInput = document.getElementById('auth-login-user');
            if (userInput) userInput.value = username;
            /* Kayıtlı şifreyi şifre alanına doldur */
            var passInput = document.getElementById('auth-login-pass');
            if (passInput) passInput.value = users[username] || '';
            /* Picker'ı gizle, saved-user kutusunu gizle, form alanlarını göster */
            var picker = document.getElementById('auth-user-picker');
            if (picker) picker.classList.remove('show');
            var box = document.getElementById('auth-saved-user-box');
            if (box) box.classList.remove('show');
            var userInputGroup = document.getElementById('authUserInputGroup');
            var passInputGroup = document.getElementById('authPassInputGroup');
            var rememberLabel  = document.getElementById('authRememberLabel');
            if (userInputGroup) userInputGroup.style.display = '';
            if (passInputGroup) passInputGroup.style.display = '';
            if (rememberLabel)  rememberLabel.style.display  = '';
        },

        /* Hoş geldiniz metnini güncelle (ortak yardımcı) */
        _applyWelcome: function (user) {
            var lang    = localStorage.getItem('mugol-lang') || 'tr';
            var titleEl = document.getElementById('welcomeTitle');
            var descEl  = document.getElementById('welcomeDesc');
            if (titleEl) titleEl.textContent = lang === 'en' ? 'Welcome, ' + user + '! 👋' : 'Hoş Geldiniz, ' + user + '! 👋';
            if (descEl)  descEl.textContent  = lang === 'en' ? 'MuGöl PORTAL is ready.' : 'MuGöl PORTAL\'a hoş geldiniz.';
        },

        /* Şifreyi göster / gizle */
        togglePassVis: function (inputId, btn) {
            var input = document.getElementById(inputId);
            if (!input) return;
            var isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            btn.innerHTML = isHidden
                ? '<i class="fas fa-eye-slash"></i>'
                : '<i class="fas fa-eye"></i>';
        },

        switchTab: function (tab) {
            var loginForm = document.getElementById('authLoginForm');
            var regForm   = document.getElementById('authRegisterForm');
            var tabLogin  = document.getElementById('authTabLogin');
            var tabReg    = document.getElementById('authTabRegister');
            if (tab === 'login') {
                loginForm.classList.remove('hidden');
                regForm.classList.add('hidden');
                tabLogin.classList.add('active');
                tabReg.classList.remove('active');
            } else {
                loginForm.classList.add('hidden');
                regForm.classList.remove('hidden');
                tabLogin.classList.remove('active');
                tabReg.classList.add('active');
            }
        },

        doRegister: function () {
            var user  = document.getElementById('auth-reg-user').value.trim();
            var pass  = document.getElementById('auth-reg-pass').value;
            var pass2 = document.getElementById('auth-reg-pass2').value;
            var errEl = document.getElementById('registerError');
            var sucEl = document.getElementById('registerSuccess');
            errEl.classList.remove('show');
            sucEl.classList.remove('show');

            if (!user || user.length < 3) {
                errEl.textContent = 'Kullanıcı adı en az 3 karakter olmalıdır.';
                errEl.classList.add('show'); return;
            }
            if (!pass || pass.length < 6) {
                errEl.textContent = 'Şifre en az 6 karakter olmalıdır.';
                errEl.classList.add('show'); return;
            }
            if (pass !== pass2) {
                errEl.textContent = 'Şifreler eşleşmiyor.';
                errEl.classList.add('show'); return;
            }
            var users = this.getUsers();
            if (users[user]) {
                errEl.textContent = 'Bu kullanıcı adı zaten alınmış.';
                errEl.classList.add('show'); return;
            }
            users[user] = pass;
            localStorage.setItem('mugol-users', JSON.stringify(users));
            sucEl.textContent = '✅ Kayıt başarılı! Giriş yapabilirsiniz.';
            sucEl.classList.add('show');
            document.getElementById('auth-reg-user').value  = '';
            document.getElementById('auth-reg-pass').value  = '';
            document.getElementById('auth-reg-pass2').value = '';
            setTimeout(function () { MugolAuth.switchTab('login'); }, 1200);
        },

        doLogin: function () {
            var userEl   = document.getElementById('auth-login-user');
            var passEl   = document.getElementById('auth-login-pass');
            var user     = userEl ? userEl.value.trim() : '';
            var pass     = passEl ? passEl.value : '';
            var users    = this.getUsers();
            var errEl    = document.getElementById('loginError');
            var remember = document.getElementById('authRemember');
            errEl.classList.remove('show');

            if (!user || !pass) {
                errEl.textContent = 'Kullanıcı adı ve şifreyi doldurun.';
                errEl.classList.add('show'); return;
            }
            if (!users[user] || users[user] !== pass) {
                errEl.textContent = 'Kullanıcı adı veya şifre hatalı.';
                errEl.classList.add('show'); return;
            }

            /* Beni hatırla seçiliyse kullanıcı adını kaydet */
            if (remember && remember.checked) {
                localStorage.setItem('mugol-remember-user', user);
            }

            /* Oturum aç — sayfa yenilenmesinde tekrar sorma */
            sessionStorage.setItem('mugol-session', user);

            /* Giriş başarılı → hoş geldiniz metnini güncelle */
            this._applyWelcome(user);

            /* Overlay kapat */
            var overlay = document.getElementById('auth-overlay');
            if (overlay) {
                overlay.style.opacity    = '0';
                overlay.style.transition = 'opacity 0.4s ease';
                setTimeout(function () {
                    overlay.classList.remove('visible');
                    overlay.style.opacity = '';
                }, 400);
            }
        },

        /* Oturumu kapat */
        doLogout: function () {
            sessionStorage.removeItem('mugol-session');
            location.reload();
        },

        /* Splash bittikten sonra script.js tarafından çağrılır */
        checkAuth: function () {
            var session   = sessionStorage.getItem('mugol-session');
            var users      = this.getUsers();

            /* Sadece aktif oturum (aynı sekme/session) varsa direkt geç */
            if (session && users[session]) {
                this._applyWelcome(session);
                return; /* overlay açma */
            }

            /* Oturum yok → giriş ekranını göster
               (hatırlanan kullanıcı varsa loadSavedUser / loadUserPicker ile öne çıkar) */
            localStorage.removeItem('mugol-logged-in');
            var overlay = document.getElementById('auth-overlay');
            if (overlay) {
                this.loadSavedUser();
                this.loadUserPicker();
                overlay.classList.add('visible');
            }
        }
    };

    /* Enter tuşu desteği */
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        var authOverlay = document.getElementById('auth-overlay');
        if (!authOverlay || !authOverlay.classList.contains('visible')) return;
        var loginForm = document.getElementById('authLoginForm');
        if (!loginForm.classList.contains('hidden')) {
            MugolAuth.doLogin();
        } else {
            MugolAuth.doRegister();
        }
    });

    /* checkAuth, splash bittikten sonra script.js'den çağrılır */

})();
