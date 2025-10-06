/* main.js - Interacciones organizadas */
(function(){
  'use strict';

  const Root = document.documentElement;
  const ThemeBtn = document.getElementById('theme-toggle');
  const THEME_KEY = 'theme';
  const TRANSITION_CLASS = 'theme-transition';

  const ThemeManager = {
    isDark(){ return Root.classList.contains('theme-dark'); },
    apply(dark, save = true){
      // Añadir clase de transición temporal para que los cambios sean suaves
      Root.classList.add(TRANSITION_CLASS);
      if(dark) Root.classList.add('theme-dark'); else Root.classList.remove('theme-dark');
      // Actualizar estado accesible
      if(ThemeBtn) ThemeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      // Guardar preferencia
      try{ if(save) localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); }catch(e){}
      // Quitar la clase de transición luego de que termine la animación
      window.clearTimeout(this._t);
      this._t = window.setTimeout(()=> Root.classList.remove(TRANSITION_CLASS), 420);
      // actualizar icono
      this.updateIcon();
    },
    toggle(){ this.apply(!this.isDark()); },
    restore(){
      try{
        const saved = localStorage.getItem(THEME_KEY);
        if(saved === 'dark') this.apply(true, false);
        else if(saved === 'light') this.apply(false, false);
        else {
          // si no hay preferencia, usar prefer-color-scheme
          const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          this.apply(prefersDark, false);
        }
      }catch(e){ /* no crítico */ }
    },
    updateIcon(){
      if(!ThemeBtn) return;
      ThemeBtn.textContent = this.isDark() ? '🌞' : '🌙';
    },
    init(){
      if(ThemeBtn){
        ThemeBtn.addEventListener('click', ()=> this.toggle());
        ThemeBtn.setAttribute('role','switch');
      }
      this.restore();
    }
  };

  // Smooth scroll simple
  function initSmoothScroll(){
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        const href = a.getAttribute('href');
        if(href.length>1){
          const target = document.querySelector(href);
          if(target){
            e.preventDefault();
            target.scrollIntoView({behavior:'smooth',block:'start'});
          }
        }
      });
    });
  }

  // Inicialización al cargar DOM
  document.addEventListener('DOMContentLoaded', ()=>{
    ThemeManager.init();
    initSmoothScroll();
    // pequeña animación de entrada
    window.setTimeout(()=> document.body.classList.add('ready'), 40);
    // resaltar enlace activo en la navegación superior
    try{ highlightNavLinks(); }catch(e){}
  });

  // Exponer para debug (opcional)
  window.__ThemeManager = ThemeManager;

  function highlightNavLinks(){
    const links = document.querySelectorAll('.main-nav a');
    links.forEach(a=>{
      try{
        const href = a.getAttribute('href');
        const resolved = new URL(href, location.href).href;
        if(location.href === resolved || location.href.startsWith(resolved)) a.classList.add('active');
        else a.classList.remove('active');
      }catch(e){}
    });
  }

  /* -------------------------------------------------- */
  /* Funciones de la calculadora (mantener simples)     */
  /* -------------------------------------------------- */
  window.sumar = function(){
    const n1 = parseFloat(document.getElementById('numero1')?.value) || 0;
    const n2 = parseFloat(document.getElementById('numero2')?.value) || 0;
    const out = document.getElementById('Resultado'); if(out) out.textContent = n1 + n2;
  };

  window.restar = function(){
    const n1 = parseFloat(document.getElementById('numero1')?.value) || 0;
    const n2 = parseFloat(document.getElementById('numero2')?.value) || 0;
    const out = document.getElementById('Resultado'); if(out) out.textContent = n1 - n2;
  };

  window.multiplicar = function(){
    const n1 = parseFloat(document.getElementById('numero1')?.value) || 0;
    const n2 = parseFloat(document.getElementById('numero2')?.value) || 0;
    const out = document.getElementById('Resultado'); if(out) out.textContent = n1 * n2;
  };

  window.dividir = function(){
    const n1 = parseFloat(document.getElementById('numero1')?.value) || 0;
    const n2 = parseFloat(document.getElementById('numero2')?.value) || 0;
    const out = document.getElementById('Resultado'); if(!out) return;
    if(n2 === 0) out.textContent = 'Error'; else out.textContent = n1 / n2;
  };

  /* -------------------------------------------------- */
  /* Módulo: Calculadora UI (teclado)                   */
  /* -------------------------------------------------- */
  const Calculator = (function(){
    const screen = document.getElementById('calc-screen');
    const prev = document.querySelector('.calc-previous');
    const historyList = document.getElementById('history-list');
    let first = null, operator = null, waitingForSecond = false;
    const history = [];

    function updateScreen(value){ if(screen) screen.textContent = value; }
    function updatePrevious(){ if(!prev) return; if(first === null || !operator) prev.textContent = ''; else prev.textContent = `${first} ${operator}`; }

    function pushHistory(entry){
      if(!entry) return;
      // mantener solo la última operación
      history.length = 0;
      history.push(entry);
      renderHistory();
    }

    function renderHistory(){
      if(!historyList) return;
      historyList.innerHTML = '';
      history.forEach(h=>{
        const li = document.createElement('li'); li.textContent = h; historyList.appendChild(li);
      });
    }

    function inputDigit(d){
      if(!screen) return;
      if(waitingForSecond){ updateScreen(d); waitingForSecond = false; return; }
      updateScreen(screen.textContent === '0' ? d : screen.textContent + d);
    }

    function inputDecimal(){
      if(!screen) return;
      if(waitingForSecond){ updateScreen('0.'); waitingForSecond=false; return; }
      if(!screen.textContent.includes('.')) updateScreen(screen.textContent + '.');
    }

    function clearAll(){ first = null; operator = null; waitingForSecond = false; updateScreen('0'); updatePrevious(); }

    function handleOperator(nextOp){
      if(!screen) return;
      const inputValue = parseFloat(screen.textContent);
      if(operator && waitingForSecond){ operator = nextOp; updatePrevious(); return; }
      if(first === null){ first = inputValue; }
      else if(operator){
        const result = compute(first, inputValue, operator);
        updateScreen(String(result));
        first = (result === 'Error') ? null : result;
      }
      operator = nextOp; waitingForSecond = true; updatePrevious();
    }

    function compute(a,b,op){ switch(op){ case '+': return a + b; case '-': return a - b; case '*': return a * b; case '/': return b === 0 ? 'Error' : a / b; } return b; }

    function deleteLast(){ if(!screen) return; if(waitingForSecond) return; updateScreen(screen.textContent.length>1 ? screen.textContent.slice(0,-1) : '0'); }

    function negate(){ if(!screen) return; if(screen.textContent === '0') return; updateScreen(String(-parseFloat(screen.textContent))); }

    function equals(){
      if(!screen) return; const inputValue = parseFloat(screen.textContent);
      if(operator === null || first === null) return;
      const result = compute(first, inputValue, operator);
      updateScreen(String(result));
      pushHistory(`${first} ${operator} ${inputValue} = ${result}`);
      first = null; operator = null; waitingForSecond = false; updatePrevious();
    }

    function setup(){
      const keys = document.querySelectorAll('.calculator-app .key');
      if(!keys) return;
      keys.forEach(k=>{
        k.addEventListener('click', ()=>{
          const action = k.dataset.action;
          const value = k.dataset.value;
          switch(action){
            case 'number': inputDigit(value); break;
            case 'decimal': inputDecimal(); break;
            case 'operator': handleOperator(value); break;
            case 'clear': clearAll(); break;
            case 'delete': deleteLast(); break;
            case 'negate': negate(); break;
            case 'equals': equals(); break;
          }
        });
      });

      // soporte teclado físico
      window.addEventListener('keydown', (e)=>{
        const key = e.key;
        // mapear teclas
        if((/^[0-9]$/).test(key)) return simulateKeyPress(`button[data-action="number"][data-value="${key}"]`);
        if(key === '.') return simulateKeyPress('button[data-action="decimal"]');
        if(key === 'Enter' || key === '=') return simulateKeyPress('button[data-action="equals"]');
        if(key === 'Backspace') return simulateKeyPress('button[data-action="delete"]');
        if(key === 'Escape') return simulateKeyPress('button[data-action="clear"]');
        if(key === '+' || key === '-' || key === '*' || key === '/') return simulateKeyPress(`button[data-action="operator"][data-value="${key}"]`);
      });

      // función que visualmente presiona la tecla y la ejecuta
      function simulateKeyPress(selector){
        const btn = document.querySelector(selector);
        if(!btn) return;
        btn.classList.add('active');
        btn.click();
        setTimeout(()=> btn.classList.remove('active'), 160);
      }
    }

    return { setup };
  })();

  document.addEventListener('DOMContentLoaded', ()=>{ try{ Calculator.setup(); }catch(e){} });

})();

/* Módulo: Modo Navideño (decoraciones leves) */
(function(){
  const KEY = 'xmas_mode';
  const btn = document.getElementById('xmas-toggle');
  const decorId = 'xmas-decor';

  function createSnow(container, count=26){
    const layer = document.createElement('div'); layer.className = 'xmas-snow';
    for(let i=0;i<count;i++){
      const flake = document.createElement('div'); flake.className='flake';
      flake.textContent = '❄';
      const size = 10 + Math.random()*20; flake.style.fontSize = size+'px';
      flake.style.left = (Math.random()*100)+'%';
      flake.style.top = (-10 - Math.random()*20)+'%';
      flake.style.opacity = 0.45 + Math.random()*0.6;
      flake.style.animationDuration = (9 + Math.random()*12)+'s';
      flake.style.animationDelay = (Math.random()*5)+'s';
      layer.appendChild(flake);
    }
    container.appendChild(layer);
  }

  function enable(){
    const container = document.getElementById(decorId);
    if(!container) return;
    container.innerHTML = '';
    createSnow(container, 36);
    btn && btn.setAttribute('aria-pressed','true');
    try{ localStorage.setItem(KEY,'1'); }catch(e){}
  }

  function disable(){
    const container = document.getElementById(decorId); if(container) container.innerHTML='';
    btn && btn.setAttribute('aria-pressed','false');
    try{ localStorage.removeItem(KEY); }catch(e){}
  }

  function toggle(){ if(isEnabled()) disable(); else enable(); }
  function isEnabled(){ try{ return !!localStorage.getItem(KEY); }catch(e){ return false; } }

  // init
  document.addEventListener('DOMContentLoaded', ()=>{
    if(!btn) return;
    btn.addEventListener('click', toggle);
    if(isEnabled()) enable();
  });
})();