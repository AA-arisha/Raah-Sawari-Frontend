import { useState, useEffect, useRef, useCallback } from "react";

function MapView({ label = "Map View", animated = false, showDriver = false, showRoute = false }) {
  const canvasRef = useRef(null);
  const frameRef  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#fce8ef"); bg.addColorStop(1, "#f8dde6");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(212,114,138,0.1)"; ctx.lineWidth = 1;
      for (let x=0; x<W; x+=38) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y=0; y<H; y+=38) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // Roads
      const roads = [[0,H*.3,W,H*.3],[0,H*.62,W,H*.62],[W*.28,0,W*.28,H],[W*.62,0,W*.62,H]];
      ctx.strokeStyle = "rgba(200,96,122,0.17)"; ctx.lineWidth = 10;
      roads.forEach(([x1,y1,x2,y2]) => { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); });
      ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1.5; ctx.setLineDash([10,10]);
      roads.forEach(([x1,y1,x2,y2]) => { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); });
      ctx.setLineDash([]);

      // Route
      if (showRoute || showDriver) {
        const g = ctx.createLinearGradient(W*.2,H*.7,W*.75,H*.3);
        g.addColorStop(0,"rgba(200,96,122,0.9)"); g.addColorStop(1,"rgba(240,168,188,0.35)");
        ctx.strokeStyle = g; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(W*.2,H*.72);
        ctx.bezierCurveTo(W*.28,H*.62,W*.62,H*.62,W*.62,H*.3);
        ctx.bezierCurveTo(W*.62,H*.22,W*.68,H*.26,W*.74,H*.28);
        ctx.stroke();
      }

      // Dest pin
      if (showRoute || showDriver) {
        const px = W*.74, py = H*.28;
        ctx.shadowColor="#C8607A"; ctx.shadowBlur=14;
        ctx.fillStyle="#C8607A"; ctx.beginPath(); ctx.arc(px,py,9,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0; ctx.fillStyle="white"; ctx.font="bold 10px Jost,sans-serif";
        ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("B",px,py);
      }

      // Animated driver
      if (showDriver) {
        frameRef.current += 0.007;
        const t = frameRef.current % 1;
        const [sx,sy,ex,ey] = [W*.2,H*.72,W*.74,H*.28];
        const [cx1,cy1,cx2,cy2] = [W*.28,H*.62,W*.62,H*.45];
        const x = Math.pow(1-t,3)*sx + 3*Math.pow(1-t,2)*t*cx1 + 3*(1-t)*t*t*cx2 + t*t*t*ex;
        const y = Math.pow(1-t,3)*sy + 3*Math.pow(1-t,2)*t*cy1 + 3*(1-t)*t*t*cy2 + t*t*t*ey;
        if (animated) {
          [0.3,0.6,0.9].forEach((_,i) => {
            const r = ((frameRef.current*1.5 + i*0.33)%1);
            ctx.strokeStyle=`rgba(200,96,122,${(1-r)*0.35})`; ctx.lineWidth=2;
            ctx.beginPath(); ctx.arc(x,y,10+r*22,0,Math.PI*2); ctx.stroke();
          });
        }
        ctx.shadowColor="rgba(200,96,122,0.45)"; ctx.shadowBlur=16;
        ctx.fillStyle="#C8607A"; ctx.beginPath(); ctx.arc(x,y,11,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0; ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("🚗",x,y);
      }

      // Origin pin
      const [px,py] = [W*.2,H*.72];
      ctx.shadowColor="#9D5A6C"; ctx.shadowBlur=12;
      ctx.fillStyle="#9D5A6C"; ctx.beginPath(); ctx.arc(px,py,9,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0; ctx.fillStyle="white"; ctx.font="bold 10px Jost,sans-serif";
      ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("A",px,py);

      if (animated) raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [animated, showDriver, showRoute]);

  return (
    <div className="map-wrap">
      <canvas ref={canvasRef} width={900} height={520} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
      <div style={{ position:"absolute", top:14, left:14, background:"rgba(253,242,245,0.93)", backdropFilter:"blur(8px)", border:"1px solid rgba(212,114,138,0.2)", borderRadius:12, padding:"6px 14px", fontSize:12, color:"#9D5A6C", fontWeight:500 }}>
        📍 {label}
      </div>
      {animated && (
        <div style={{ position:"absolute", bottom:14, right:14, background:"rgba(253,242,245,0.93)", backdropFilter:"blur(8px)", border:"1px solid rgba(212,114,138,0.2)", borderRadius:12, padding:"5px 12px", display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"#D4728A", display:"inline-block", animation:"dotPulse 1.2s infinite" }} />
          <span style={{ fontSize:11, color:"#D4728A", fontWeight:600 }}>Live</span>
        </div>
      )}
    </div>
  );
}

export default MapView;
