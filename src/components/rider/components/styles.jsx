export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Jost:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #fdf2f5; font-family: 'Jost', sans-serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #fdf2f5; }
  ::-webkit-scrollbar-thumb { background: #e8b4c0; border-radius: 4px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroZoom {
    from { transform: scale(1.08); }
    to   { transform: scale(1.0); }
  }
  @keyframes floatPetal {
    0%   { transform: translateY(0) rotate(0deg);   opacity: 0; }
    10%  { opacity: 0.6; }
    90%  { opacity: 0.3; }
    100% { transform: translateY(-700px) rotate(360deg); opacity: 0; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  @keyframes dotPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.7); }
  }

  .fade-up-1 { opacity:0; animation: fadeUp 0.6s 0.3s ease forwards; }
  .fade-up-2 { opacity:0; animation: fadeUp 0.6s 0.5s ease forwards; }
  .fade-up-3 { opacity:0; animation: fadeUp 0.6s 0.7s ease forwards; }
  .fade-up-4 { opacity:0; animation: fadeUp 0.6s 0.9s ease forwards; }
  .fade-up-5 { opacity:0; animation: fadeUp 0.6s 1.1s ease forwards; }

  .rs-root { min-height: 100vh; background: #fdf2f5; font-family: 'Jost', sans-serif; }

  .rs-panel {
    background: white;
    border: 1.5px solid rgba(212,114,138,0.14);
    border-radius: 22px;
  }

  .inner-sidebar {
    width: 420px;
    min-width: 420px;
    background: white;
    border-right: 1.5px solid rgba(212,114,138,0.12);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .rs-btn-primary {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #C8607A 0%, #8C4A5C 100%);
    border: none;
    border-radius: 50px;
    color: white;
    font-family: 'Jost', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.4px;
    box-shadow: 0 8px 24px rgba(157,90,108,0.35);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .rs-btn-primary:hover  { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(157,90,108,0.45); }
  .rs-btn-primary:active { transform: scale(0.98); }
  .rs-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .rs-btn-ghost {
    padding: 11px 18px;
    background: transparent;
    border: 1.5px solid rgba(212,114,138,0.2);
    border-radius: 14px;
    color: #A07080;
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    text-align: center;
  }
  .rs-btn-ghost:hover { background: rgba(212,114,138,0.06); color: #9D5A6C; }

  .rs-btn-secondary {
    flex: 1;
    padding: 12px 20px;
    background: rgba(212,114,138,0.07);
    border: 1.5px solid rgba(212,114,138,0.2);
    border-radius: 12px;
    color: #9D5A6C;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .rs-btn-secondary:hover { background: rgba(212,114,138,0.13); }

  .rs-btn-danger {
    flex: 1;
    padding: 12px 20px;
    background: rgba(239,68,68,0.07);
    border: 1.5px solid rgba(239,68,68,0.2);
    border-radius: 12px;
    color: #dc2626;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .rs-btn-danger:hover { background: rgba(239,68,68,0.13); }

  .map-wrap {
    width: 100%;
    height: 100%;
    border-radius: 20px;
    overflow: hidden;
    border: 1.5px solid rgba(212,114,138,0.12);
    min-height: 340px;
    position: relative;
    background: #fce8ef;
  }

  .rs-modal-overlay {
    position: fixed; inset: 0; z-index: 999;
    background: rgba(61,31,42,0.5);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .rs-modal-box {
    background: white;
    border: 1.5px solid rgba(212,114,138,0.18);
    border-radius: 24px;
    width: 100%; max-width: 440px;
    box-shadow: 0 40px 80px rgba(61,31,42,0.18);
    animation: slideUp 0.25s ease-out;
    overflow: hidden;
  }

  .fare-box {
    background: rgba(212,114,138,0.05);
    border: 1.5px solid rgba(212,114,138,0.15);
    border-radius: 16px;
    padding: 14px 16px;
  }

  .rs-progress-track {
    width: 100%;
    background: rgba(212,114,138,0.12);
    border-radius: 99px;
    height: 6px;
    overflow: hidden;
  }
  .rs-progress-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #D4728A, #F0A8BC);
    transition: width 0.7s ease-out;
  }

  .ride-opt {
    border: 1.5px solid rgba(212,114,138,0.14);
    border-radius: 18px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
  }
  .ride-opt:hover   { border-color: rgba(212,114,138,0.35); box-shadow: 0 4px 20px rgba(157,90,108,0.09); }
  .ride-opt.sel     { border-color: #D4728A; background: rgba(212,114,138,0.04); box-shadow: 0 4px 20px rgba(157,90,108,0.14); }

  .feature-tile {
    background: white;
    border: 1.5px solid rgba(212,114,138,0.12);
    border-radius: 20px;
    padding: 20px 18px;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: default;
    position: relative;
    overflow: hidden;
  }
  .feature-tile:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(157,90,108,0.11);
    border-color: rgba(212,114,138,0.3);
  }

  .recent-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 13px 14px;
    background: white;
    border: 1.5px solid rgba(212,114,138,0.1);
    border-radius: 16px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
    width: 100%;
    font-family: 'Jost', sans-serif;
  }
  .recent-btn:hover {
    border-color: rgba(212,114,138,0.32);
    box-shadow: 0 4px 16px rgba(157,90,108,0.08);
  }

  .rs-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,114,138,0.2), transparent);
    margin: 28px 32px;
  }

  .stat-item {
    flex: 1;
    text-align: center;
    padding: 4px 10px;
    border-right: 1px solid rgba(255,255,255,0.08);
  }
  .stat-item:last-child { border-right: none; }
`;