/**
 * KSAWERY.CRACK — APPLICATION ENGINE & EASTER EGGS
 * Oficjalny kod operacyjny Grudziądz Labs
 */

(function () {
  'use strict';

  // --- Web Audio API Synthesizer (Zero external dependencies) ---
  const AudioEngine = {
    ctx: null,
    enabled: true,

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
    },

    beep(freq = 440, type = 'sine', duration = 0.12, gain = 0.08) {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gNode = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gNode.gain.setValueAtTime(gain, this.ctx.currentTime);
        gNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gNode);
        gNode.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio might be blocked until user gesture
      }
    },

    playClick() {
      this.beep(620, 'sine', 0.08, 0.05);
    },

    playSuccess() {
      this.beep(523.25, 'triangle', 0.1, 0.08);
      setTimeout(() => this.beep(659.25, 'triangle', 0.12, 0.08), 80);
      setTimeout(() => this.beep(783.99, 'triangle', 0.25, 0.08), 160);
    },

    playAlarm() {
      if (!this.enabled) return;
      this.beep(880, 'sawtooth', 0.15, 0.12);
      setTimeout(() => this.beep(440, 'sawtooth', 0.2, 0.12), 120);
    }
  };

  // --- FBI / Panic Mode Toggle ---
  const PanicSystem = {
    overlay: null,
    active: false,
    escapesCount: 2,

    init() {
      this.overlay = document.getElementById('fbi-overlay');
      const panicBtns = document.querySelectorAll('.trigger-panic');
      const exitBtn = document.getElementById('fbi-exit-btn');

      panicBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.togglePanic(true);
        });
      });

      if (exitBtn) {
        exitBtn.addEventListener('click', () => {
          this.togglePanic(false);
        });
      }

      // Keyboard Shortcut: ESC or 'f'
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || (e.key.toLowerCase() === 'f' && e.altKey)) {
          this.togglePanic(!this.active);
        }
      });
    },

    togglePanic(show) {
      this.active = show;
      if (!this.overlay) return;

      if (show) {
        AudioEngine.playAlarm();
        this.overlay.classList.add('active');
        document.title = "Arkusz1 - Microsoft Excel - Zestawienie Plonów Grudziądz 2024";
      } else {
        AudioEngine.playSuccess();
        this.overlay.classList.remove('active');
        document.title = "ksawery.crack — Grudziądz Official";
        this.escapesCount++;
        ToastSystem.show(`🚨 Federalni minęli dom Ksawerego! Wynik zaktualizowany do ${this.escapesCount}:0 dla Ksawerego!`);
        
        // Update stats on page if exists
        const fedStat = document.getElementById('federal-stat-counter');
        if (fedStat) {
          fedStat.textContent = `${this.escapesCount} : 0`;
        }
      }
    }
  };

  // --- Carpet Beating vs Ksawery Crack Calculator ---
  const CarpetCalculator = {
    areaInput: null,
    dirtSelect: null,
    carpetSelect: null,
    areaValDisplay: null,
    
    timeMomEl: null,
    noiseMomEl: null,
    timeCrackEl: null,
    purityEl: null,
    verdictEl: null,

    init() {
      this.areaInput = document.getElementById('calc-area');
      this.dirtSelect = document.getElementById('calc-dirt');
      this.carpetSelect = document.getElementById('calc-type');
      this.areaValDisplay = document.getElementById('calc-area-val');

      this.timeMomEl = document.getElementById('time-mom');
      this.noiseMomEl = document.getElementById('noise-mom');
      this.timeCrackEl = document.getElementById('time-crack');
      this.purityEl = document.getElementById('purity-crack');
      this.verdictEl = document.getElementById('calc-verdict-text');

      if (!this.areaInput) return;

      const update = () => this.calculate();

      this.areaInput.addEventListener('input', () => {
        if (this.areaValDisplay) {
          this.areaValDisplay.textContent = `${this.areaInput.value} m²`;
        }
        update();
      });

      if (this.dirtSelect) this.dirtSelect.addEventListener('change', update);
      if (this.carpetSelect) this.carpetSelect.addEventListener('change', update);

      const modalBtn = document.getElementById('btn-print-recipe');
      if (modalBtn) {
        modalBtn.addEventListener('click', () => this.showRecipeModal());
      }

      this.calculate();
    },

    calculate() {
      const area = parseFloat(this.areaInput.value) || 12;
      const dirtMultiplier = parseFloat(this.dirtSelect?.value || 1.5);
      const carpetName = this.carpetSelect?.options[this.carpetSelect.selectedIndex]?.text || "Dywan Shaggy";

      // Mom stats (exponential anger & time)
      const momMinutes = Math.round(area * 18 * dirtMultiplier);
      const momHours = (momMinutes / 60).toFixed(1);
      const momDecibels = Math.min(135, Math.round(92 + (area * 0.8) + (dirtMultiplier * 8)));

      // Ksawery Crack stats (instant perfection)
      const crackSeconds = (0.2 + (area * 0.02) * (dirtMultiplier * 0.1)).toFixed(2);
      const crackPure = 99.85;

      if (this.timeMomEl) this.timeMomEl.textContent = `${momHours} godz. + krzyki`;
      if (this.noiseMomEl) this.noiseMomEl.textContent = `${momDecibels} dB (sąsiedzi dzwonią)`;
      if (this.timeCrackEl) this.timeCrackEl.textContent = `${crackSeconds} sekundy!`;
      if (this.purityEl) this.purityEl.textContent = `${crackPure}% czystości`;

      if (this.verdictEl) {
        const dose = (area * 0.08 * dirtMultiplier).toFixed(2);
        this.verdictEl.innerHTML = `Zalecenie Ksawerego dla <strong>${carpetName}</strong>: dawka <strong>${dose}g</strong>. Dywan zatrzęsie się raz, kurz wyparuje z klatki, matka odpocznie przy kawie.`;
      }
    },

    showRecipeModal() {
      AudioEngine.playSuccess();
      const area = this.areaInput ? this.areaInput.value : 12;
      alert(`📜 OFICJALNA RECEPTA GRUDZIĄDZKA #024/2026\n\nPacjent: Właściciel dywanu (${area} m²)\nZdiagnozowano: Zmęczona matka trzepiąca dywan od rana.\nZalecenie: 1 dawka Ksawery Classic (Grudziądz Vintage).\nSposób użycia: Położyć dywan na trzepaku, mrugnąć okiem, gotowe.\n\nPodpisano: Ksawery Grudziądz (Zatwierdzone przez Republikę Kongo)`);
    }
  };

  // --- Crisis Helper Tab Switcher ---
  const CrisisHelper = {
    tabs: [],
    adviceEl: null,
    
    adviceDatabase: {
      girl: {
        title: "Kategoria: Serce pęknięte, dywan czysty",
        text: "Zostawiła Cię? Jej gigantyczna strata, mordeczko! Widocznie nie doceniała Twojego luksusowego gustu. Zamiast płakać w poduszkę, zamów paczkę z Grudziądza, odkurz chatę, zadbaj o siebie i pamiętaj: prawdziwa miłość może i przemija, ale crack od Ksawerego zawsze trzepie tak samo dobrze."
      },
      carpet: {
        title: "Kategoria: Trzepanie dywanu na osiedlu",
        text: "Nawet nie myśl o wyciąganiu tej plastikowej trzepaczki z balkonu. Szkoda rąk Twojej mamy i nerwów sąsiada z parteru. Wystarczy jedna porcja od Ksawerego — cząsteczki aktywne usuwają kurz, roztocza i wspomnienia z komunii 2011 z prędkością naddźwiękową."
      },
      fbi: {
        title: "Kategoria: Niebieskie koguty za oknem",
        text: "Spokój i opanowanie. Ksawery miał ich u siebie 2 razy i nic nie znaleźli, bo wszystko było wzorowo zamaskowane pod zapasami mąki krupczatki. Wciśnij natychmiast przycisk 'TRYB FBI' u góry ekranu i zacznij głośno mówić o cenach pszenicy ozimej."
      },
      energy: {
        title: "Kategoria: Brak energii i motywacji",
        text: "Kawa z automatu na stacji to scam. Kiedy Ksawery miesza składniki o 4:00 rano, Grudziądz świeci w ciemności. Jeden głęboki oddech i masz energię na przeoranie całego ogródka sąsiada i wybudowanie garażu w 20 minut."
      }
    },

    init() {
      this.tabs = document.querySelectorAll('.crisis-tab-btn');
      this.adviceTitleEl = document.getElementById('advice-title');
      this.adviceTextEl = document.getElementById('advice-text');

      if (!this.tabs.length) return;

      this.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          AudioEngine.playClick();
          this.tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const key = tab.getAttribute('data-problem');
          const data = this.adviceDatabase[key];
          if (data && this.adviceTitleEl && this.adviceTextEl) {
            this.adviceTitleEl.textContent = data.title;
            this.adviceTextEl.textContent = data.text;
          }
        });
      });
    }
  };

  // --- Safe Phone Contact Dialog ---
  const PhoneSafety = {
    init() {
      const phoneBtns = document.querySelectorAll('.trigger-phone-call');
      phoneBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          AudioEngine.playAlarm();
          const confirmed = confirm(
            "⚠️ OSTRZEŻENIE OD SZEFA:\n\n" +
            "Numer telefonu: 733 209 607 (lepiej kurwa nie dzwoń!).\n\n" +
            "Ksawery właśnie nadzoruje destylację partii dla prezydenta Kongo. Jeśli zadzwonisz bez ważnego powodu, możesz usłyszeć wiązankę z Grudziądza.\n\n" +
            "Czy na pewno chcesz skopiować numer do schowka?"
          );

          if (confirmed) {
            navigator.clipboard.writeText("733209607").then(() => {
              AudioEngine.playSuccess();
              ToastSystem.show("📞 Numer 733 209 607 skopiowany do schowka! Dzwonisz na własną odpowiedzialność.");
            }).catch(() => {
              alert("Numer telefonu to: 733 209 607. Pamiętaj: lepiej nie dzwoń!");
            });
          }
        });
      });
    }
  };

  // --- Encrypted Terminal Form ---
  const TerminalEngine = {
    init() {
      const form = document.getElementById('terminal-form');
      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        AudioEngine.playClick();

        const nickInput = document.getElementById('term-nick');
        const msgInput = document.getElementById('term-msg');
        const submitBtn = document.getElementById('term-submit');

        const nick = nickInput?.value.trim() || "Anonimowy Klient";
        const msg = msgInput?.value.trim() || "Brak treści grypsu";

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = "Szyfrowanie Grudziądz-AES-256...";
        }

        setTimeout(() => {
          if (submitBtn) submitBtn.innerHTML = "Wypuszczanie gołębia pocztowego...";
        }, 800);

        setTimeout(() => {
          AudioEngine.playSuccess();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Wiadomość Dostarczona!";
          }
          ToastSystem.show(`🕊️ Szyfrowany gryps od [${nick}] dotarł do piwnicy Ksawerego!`);
          if (nickInput) nickInput.value = '';
          if (msgInput) msgInput.value = '';

          setTimeout(() => {
            if (submitBtn) submitBtn.innerHTML = "Wyślij Szyfrowany Gryps";
          }, 3000);
        }, 1800);
      });
    }
  };

  // --- Live Toast Notifications ---
  const ToastSystem = {
    container: null,
    queue: [
      "📦 Ktoś z Grudziądza-Lotnisko właśnie zamówił 25g Ksawery Classic.",
      "🚨 Status z obwodnicy: Federalni skręcili w złą stronę na rondzie.",
      "🧹 Dywan w Chełmnie został wytrzepany w 0.28 sekundy.",
      "👑 Samuel Schick z Kongo przesłał 5 gwiazdek i pozdrowienia.",
      "📞 Telefon 733 209 607: 0 nieodebranych (wszyscy się boją dzwonić).",
      "💎 Partia z 2022 roku uznana za dziedzictwo kulturowe Grudziądza."
    ],
    timer: null,

    init() {
      this.container = document.getElementById('toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
      }

      // Periodically show toasts
      let idx = 0;
      this.timer = setInterval(() => {
        this.show(this.queue[idx % this.queue.length]);
        idx++;
      }, 26000);

      // Show welcome toast after 4s
      setTimeout(() => {
        this.show("⚡ Witaj w Grudziądz Labs! Receptura od 2022 niezmiennie trzepie dywan.");
      }, 4000);
    },

    show(msg) {
      if (!this.container) return;
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `<span>${msg}</span>`;

      this.container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(80px)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 450);
      }, 6000);
    }
  };

  // --- Sound Toggle Button ---
  const SoundController = {
    init() {
      const toggle = document.getElementById('sound-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', () => {
        AudioEngine.enabled = !AudioEngine.enabled;
        toggle.innerHTML = AudioEngine.enabled ? '🔊 Cyber Audio: ON' : '🔇 Cyber Audio: OFF';
        if (AudioEngine.enabled) AudioEngine.playSuccess();
      });
    }
  };

  // --- Mobile Navigation Toggle ---
  const MobileNav = {
    init() {
      const toggle = document.getElementById('mobile-nav-toggle');
      const links = document.getElementById('nav-links');

      if (!toggle || !links) return;

      toggle.addEventListener('click', () => {
        AudioEngine.playClick();
        if (links.style.display === 'flex') {
          links.style.display = 'none';
        } else {
          links.style.display = 'flex';
          links.style.flexDirection = 'column';
          links.style.position = 'absolute';
          links.style.top = '72px';
          links.style.left = '0';
          links.style.width = '100%';
          links.style.background = 'rgba(7, 9, 14, 0.98)';
          links.style.padding = '1.5rem';
          links.style.borderBottom = '1px solid var(--border-color)';
          links.style.backdropFilter = 'blur(20px)';
        }
      });
    }
  };

  // Initialize all subsystems when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    PanicSystem.init();
    CarpetCalculator.init();
    CrisisHelper.init();
    PhoneSafety.init();
    TerminalEngine.init();
    ToastSystem.init();
    SoundController.init();
    MobileNav.init();

    // Universal button click sound
    document.querySelectorAll('.btn, .nav-link').forEach(el => {
      el.addEventListener('click', () => AudioEngine.playClick());
    });
  });

})();

