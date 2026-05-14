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




export const tokens = `
  :root {
    --blush: #F9E4E8;
    --rose: #E8A0B0;
    --mauve: #9D5A6C;
    --cream: #FDF6F0;
    --coral: #E07B8A;
    --text-dark: #3D1F2A;
    --glass: rgba(255,255,255,0.55);
    --glass-border: rgba(232,160,176,0.3);
    --shadow-bloom: 0 8px 40px rgba(157,90,108,0.12), 0 2px 12px rgba(224,123,138,0.08);
    --shadow-bloom-lg: 0 16px 60px rgba(157,90,108,0.18), 0 4px 20px rgba(224,123,138,0.1);
    --radius: 20px;
    --radius-sm: 12px;
    --radius-pill: 100px;
  }

  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--text-dark);
    min-height: 100vh;
  }

  .app-bg {
    min-height: 100vh;
    background:
      radial-gradient(ellipse 80% 60% at 20% 10%, rgba(249,228,232,0.9) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 90%, rgba(232,160,176,0.35) 0%, transparent 55%),
      radial-gradient(ellipse 50% 40% at 50% 50%, rgba(253,246,240,0.6) 0%, transparent 70%),
      #FDF6F0;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .app-bg::before {
    content: '';
    position: fixed;
    top: -60px; left: -60px;
    width: 220px; height: 220px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cg opacity='0.18'%3E%3Cellipse cx='100' cy='160' rx='8' ry='30' fill='%23E8A0B0' transform='rotate(-20 100 100)'/%3E%3Cellipse cx='100' cy='160' rx='8' ry='30' fill='%23E8A0B0' transform='rotate(20 100 100)'/%3E%3Cellipse cx='100' cy='160' rx='8' ry='30' fill='%23E8A0B0' transform='rotate(60 100 100)'/%3E%3Cellipse cx='100' cy='160' rx='8' ry='30' fill='%23E8A0B0' transform='rotate(100 100 100)'/%3E%3Cellipse cx='100' cy='160' rx='8' ry='30' fill='%23E8A0B0' transform='rotate(140 100 100)'/%3E%3Ccircle cx='100' cy='100' r='10' fill='%239D5A6C' opacity='0.6'/%3E%3Ccircle cx='80' cy='70' r='6' fill='%23E07B8A' opacity='0.5'/%3E%3Ccircle cx='120' cy='70' r='6' fill='%23E07B8A' opacity='0.5'/%3E%3Ccircle cx='65' cy='90' r='4' fill='%23E8A0B0'/%3E%3Ccircle cx='135' cy='90' r='4' fill='%23E8A0B0'/%3E%3C/g%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    pointer-events: none;
    z-index: 0;
  }

  .app-bg::after {
    content: '';
    position: fixed;
    bottom: -40px; right: -40px;
    width: 180px; height: 180px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cg opacity='0.15' transform='rotate(180 100 100)'%3E%3Cellipse cx='100' cy='160' rx='7' ry='28' fill='%23E8A0B0' transform='rotate(-30 100 100)'/%3E%3Cellipse cx='100' cy='160' rx='7' ry='28' fill='%23E8A0B0' transform='rotate(10 100 100)'/%3E%3Cellipse cx='100' cy='160' rx='7' ry='28' fill='%23E8A0B0' transform='rotate(50 100 100)'/%3E%3Cellipse cx='100' cy='160' rx='7' ry='28' fill='%23E8A0B0' transform='rotate(90 100 100)'/%3E%3Cellipse cx='100' cy='160' rx='7' ry='28' fill='%23E8A0B0' transform='rotate(130 100 100)'/%3E%3Ccircle cx='100' cy='100' r='9' fill='%239D5A6C' opacity='0.6'/%3E%3C/g%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    pointer-events: none;
    z-index: 0;
  }

  .dashboard {
    max-width: 520px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .wordmark {
    font-family: 'Cormorant Garamond', serif;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--mauve);
    text-align: center;
    padding-bottom: 0.25rem;
    opacity: 0.7;
  }

  .glass-card {
    background: var(--glass);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-bloom);
    padding: 1.5rem;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }

  .glass-card:hover {
    box-shadow: var(--shadow-bloom-lg);
  }

  .profile-card {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .avatar-ring {
    position: relative;
    flex-shrink: 0;
  }

  .avatar-ring::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--rose), var(--mauve));
    z-index: 0;
  }

  .avatar {
    position: relative;
    z-index: 1;
    width: 62px;
    height: 62px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--blush), var(--rose));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 500;
    color: var(--mauve);
    border: 2.5px solid white;
    overflow: hidden;
  }

  .profile-info { flex: 1; }

  .driver-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 500;
    color: var(--text-dark);
    line-height: 1.2;
    margin-bottom: 3px;
  }

  .vehicle-label {
    font-size: 12.5px;
    color: var(--mauve);
    letter-spacing: 0.04em;
    font-weight: 300;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: var(--radius-pill);
    font-size: 11.5px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: all 0.4s ease;
    margin-top: 8px;
  }

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    transition: background 0.4s ease;
  }

  .status-online {
    background: rgba(157,90,108,0.1);
    color: var(--mauve);
  }
  .status-online .status-dot {
    background: #7DC88A;
    box-shadow: 0 0 0 3px rgba(125,200,138,0.2);
    animation: pulse-dot 2s infinite;
  }

  .status-offline {
    background: rgba(157,90,108,0.07);
    color: #b8a0a8;
  }
  .status-offline .status-dot { background: #c9b5bb; }

  .status-on-ride {
    background: rgba(224,123,138,0.12);
    color: var(--coral);
  }
  .status-on-ride .status-dot {
    background: var(--coral);
    box-shadow: 0 0 0 3px rgba(224,123,138,0.2);
    animation: pulse-dot 1.5s infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 0 3px rgba(125,200,138,0.2); }
    50% { box-shadow: 0 0 0 6px rgba(125,200,138,0.05); }
  }

  .section-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--mauve);
    opacity: 0.6;
    margin-bottom: 1rem;
  }

  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .toggle-copy h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 500;
    color: var(--text-dark);
    margin-bottom: 3px;
  }

  .toggle-copy p {
    font-size: 12.5px;
    color: var(--mauve);
    font-weight: 300;
    max-width: 200px;
    line-height: 1.5;
  }

  .toggle-switch {
    position: relative;
    width: 66px;
    height: 34px;
    flex-shrink: 0;
    cursor: pointer;
  }

  .toggle-switch input { display: none; }

  .toggle-track {
    position: absolute;
    inset: 0;
    border-radius: var(--radius-pill);
    background: rgba(157,90,108,0.12);
    border: 1.5px solid var(--glass-border);
    transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }

  .toggle-switch.active .toggle-track {
    background: linear-gradient(135deg, var(--rose), var(--mauve));
    border-color: var(--mauve);
    box-shadow: 0 4px 20px rgba(157,90,108,0.35);
  }

  .toggle-thumb {
    position: absolute;
    top: 3px; left: 3px;
    width: 26px; height: 26px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 8px rgba(61,31,42,0.15);
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }

  .toggle-switch.active .toggle-thumb {
    transform: translateX(32px);
  }

  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--rose) 30%, var(--rose) 70%, transparent);
    opacity: 0.2;
    margin: 0.75rem 0;
  }

  .ride-card {
    border: 1px solid rgba(224,123,138,0.2);
    background: rgba(255,255,255,0.65);
  }

  .ride-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  .ride-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 500;
    color: var(--text-dark);
    margin-bottom: 2px;
  }

  .fare-badge {
    background: linear-gradient(135deg, var(--blush), rgba(232,160,176,0.3));
    border: 1px solid rgba(224,123,138,0.25);
    border-radius: var(--radius-sm);
    padding: 6px 14px;
    text-align: center;
  }

  .fare-amount {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--mauve);
    display: block;
    line-height: 1;
  }

  .fare-label {
    font-size: 10px;
    color: var(--coral);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 400;
  }

  .route-line {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 0.5rem 0;
  }

  .route-stop {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    position: relative;
  }

  .route-stop + .route-stop { margin-top: 0; }

  .route-icon-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 20px;
  }

  .route-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 3px;
  }

  .route-dot-pickup {
    background: #7DC88A;
    box-shadow: 0 0 0 3px rgba(125,200,138,0.2);
  }

  .route-dot-dropoff {
    background: var(--coral);
    box-shadow: 0 0 0 3px rgba(224,123,138,0.2);
  }

  .route-connector {
    width: 1.5px;
    flex: 1;
    min-height: 22px;
    background: linear-gradient(180deg, rgba(125,200,138,0.4), rgba(224,123,138,0.4));
    margin: 2px 0;
  }

  .route-text-label {
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--mauve);
    opacity: 0.55;
    font-weight: 500;
  }

  .route-address {
    font-size: 13.5px;
    color: var(--text-dark);
    font-weight: 400;
    line-height: 1.35;
    padding-bottom: 14px;
  }

  .rider-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(232,160,176,0.15);
  }

  .rider-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--blush), var(--rose));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 500;
    color: var(--mauve);
    flex-shrink: 0;
  }

  .rider-name {
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text-dark);
  }

  .rider-sub {
    font-size: 11.5px;
    color: var(--mauve);
    opacity: 0.7;
  }

  .ride-status-pill {
    margin-left: auto;
    padding: 4px 12px;
    border-radius: var(--radius-pill);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: rgba(224,123,138,0.12);
    color: var(--coral);
    border: 1px solid rgba(224,123,138,0.2);
  }

  .btn-complete {
    width: 100%;
    padding: 1rem 1.5rem;
    border-radius: var(--radius);
    background: linear-gradient(135deg, var(--coral) 0%, var(--mauve) 100%);
    color: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    box-shadow: 0 8px 30px rgba(157,90,108,0.35);
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    position: relative;
    overflow: hidden;
  }

  .btn-complete::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    border-radius: inherit;
  }

  .btn-complete:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(157,90,108,0.45);
  }

  .btn-complete:active {
    transform: translateY(0) scale(0.98);
  }

  .btn-complete:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .idle-state {
    text-align: center;
    padding: 2rem 1rem;
  }

  .idle-illustration {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--blush), rgba(232,160,176,0.3));
    border: 1px solid rgba(232,160,176,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    font-size: 28px;
  }

  .idle-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 19px;
    font-weight: 500;
    color: var(--text-dark);
    margin-bottom: 6px;
  }

  .idle-sub {
    font-size: 13px;
    color: var(--mauve);
    font-weight: 300;
    line-height: 1.6;
    opacity: 0.8;
  }

  .stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.75rem;
  }

  .stat-tile {
    background: rgba(255,255,255,0.5);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-sm);
    padding: 1rem 0.75rem;
    text-align: center;
  }

  .stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--text-dark);
    display: block;
    line-height: 1;
    margin-bottom: 4px;
  }

  .stat-key {
    font-size: 10.5px;
    color: var(--mauve);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.7;
  }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeSlideOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
  }

  .anim-in { animation: fadeSlideIn 0.5s cubic-bezier(0.34,1.2,0.64,1) both; }

  @keyframes completePulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.04); }
    100% { transform: scale(1); }
  }

  .completing { animation: completePulse 0.4s ease; }

  .toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: linear-gradient(135deg, var(--mauve), var(--coral));
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-pill);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.04em;
    box-shadow: 0 8px 30px rgba(157,90,108,0.4);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
    z-index: 100;
    white-space: nowrap;
  }

  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  @media (max-width: 600px) {
    .app-bg { padding: 1.25rem; }
    .driver-name { font-size: 19px; }
  }
`;