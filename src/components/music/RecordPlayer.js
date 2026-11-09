import React, { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import Vinyl from './Vinyl';

// Turntable drawing coordinates (SVG viewBox is 400 x 300)
const PLATTER = { cx: 165, cy: 150, r: 120 };
const ARM_PIVOT = { x: 350, y: 45 };
const ARM_REST = 0; // degrees: tonearm parked off the record
const ARM_START = 30; // stylus on the outer groove
const ARM_END = 47; // stylus on the inner groove, near the label
const DRAG_THRESHOLD = 8; // px of movement before a press counts as a gesture
const FAN_SPREAD = 9; // degrees between neighbouring sleeves in the fan
const FAN_PUSH = 8; // extra degrees the sleeves to the right swing away to reveal the selected one

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const yearOf = (date) => date.split(' ').pop();

const RecordPlayer = ({ tracks }) => {
  const [audio] = useState(() => {
    const el = new Audio();
    el.preload = 'none';
    return el;
  });
  const [current, setCurrent] = useState(null); // index of the record on the platter
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [active, setActive] = useState(0); // the selected sleeve (keyboard focus lands here)
  const [spreadFrom, setSpreadFrom] = useState(null); // sleeve the fan opens around; null = even fan
  const [drag, setDrag] = useState(null); // floating record: { index, x, y, size, overPlatter }
  const gestureRef = useRef(null);
  const platterRef = useRef(null);
  const fanRef = useRef(null);

  useEffect(() => {
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onTime = () => setTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setTime(0);
    };
    const events = { play: onPlay, pause: onPause, waiting: onWaiting, playing: onPlaying, timeupdate: onTime, loadedmetadata: onMeta, durationchange: onMeta, ended: onEnded };
    Object.entries(events).forEach(([name, fn]) => audio.addEventListener(name, fn));
    return () => {
      audio.pause();
      Object.entries(events).forEach(([name, fn]) => audio.removeEventListener(name, fn));
    };
  }, [audio]);

  const play = () => {
    setIsLoading(true);
    audio.play().catch(() => setIsLoading(false));
  };

  // Put a record on the platter and start it. Loading the one that's already there toggles it.
  const loadRecord = (index) => {
    if (index === current) {
      if (audio.paused) play();
      else audio.pause();
      return;
    }
    audio.pause();
    audio.src = tracks[index].audioSrc;
    setCurrent(index);
    setTime(0);
    setDuration(0);
    play();
  };

  const liftRecord = () => {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    setCurrent(null);
    setTime(0);
    setDuration(0);
    setIsLoading(false);
  };

  const seek = (seconds) => {
    audio.currentTime = seconds;
    setTime(seconds);
  };

  const platterCenter = () => {
    const rect = platterRef.current.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, r: rect.width / 2 };
  };

  const isOverPlatter = (x, y) => {
    const p = platterCenter();
    return Math.hypot(x - p.x, y - p.y) <= p.r;
  };

  // Which sleeve sits under a horizontal position in the fan (the fan spans its container's width)
  const sleeveAt = (clientX) => {
    const rect = fanRef.current.getBoundingClientRect();
    const fraction = (clientX - rect.left) / rect.width;
    return Math.min(tracks.length - 1, Math.max(0, Math.floor(fraction * tracks.length)));
  };

  const select = (index) => {
    setActive(index);
    setSpreadFrom(index);
  };

  const isInsideFan = (x, y) => {
    const rect = fanRef.current.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };

  // Mouse: hovering across the fan opens it around the sleeve under the cursor
  const handleFanPointerMove = (e) => {
    const g = gestureRef.current;
    if (!g) {
      if (e.pointerType === 'mouse') select(sleeveAt(e.clientX));
      return;
    }
    if (g.pointerId !== e.pointerId) return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (!g.mode) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      // Moving toward the turntable pulls the record out; any other direction scrubs along the fan
      const p = platterCenter();
      const toPlatter = Math.atan2(p.y - g.startY, p.x - g.startX);
      const moved = Math.atan2(dy, dx);
      const diff = Math.abs(Math.atan2(Math.sin(moved - toPlatter), Math.cos(moved - toPlatter)));
      g.mode = diff < Math.PI / 4 ? 'drag' : 'scrub';
    }
    if (g.mode === 'drag') {
      setDrag({ index: g.index, x: e.clientX, y: e.clientY, size: g.size, overPlatter: isOverPlatter(e.clientX, e.clientY) });
    } else {
      const index = sleeveAt(e.clientX);
      g.index = index;
      select(index);
    }
  };

  // Moving the mouse off the fan lets it settle back to the even spread
  const handleFanPointerLeave = (e) => {
    if (e.pointerType === 'mouse' && !gestureRef.current) setSpreadFrom(null);
  };

  const handleFanPointerDown = (e) => {
    if (e.button !== 0) return;
    const sleeve = e.target.closest('.sleeve');
    if (!sleeve) return;
    // Pick by position, the same way hovering does (the sleeves overlap, so the element under
    // the pointer isn't always the one that's raised)
    const index = sleeveAt(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
    gestureRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      mode: null,
      index,
      pointerType: e.pointerType,
      // With a mouse, hovering already opened the fan on this sleeve; on touch the first tap does that
      wasSelected: e.pointerType === 'mouse' || index === spreadFrom,
      size: sleeve.offsetWidth * 0.92,
    };
    select(index);
  };

  const handleFanPointerUp = (e) => {
    const g = gestureRef.current;
    if (!g || g.pointerId !== e.pointerId) return;
    gestureRef.current = null;
    setDrag(null);
    let played = false;
    if (g.mode === 'drag') {
      if (isOverPlatter(e.clientX, e.clientY)) {
        loadRecord(g.index);
        played = true;
      }
    } else if (!g.mode && g.wasSelected) {
      loadRecord(g.index); // a tap on the selected sleeve plays it (the first tap on another just selects it)
      played = true;
    }
    // Settle back to the even spread once the mouse is off the fan, or after playing on touch
    if (g.pointerType === 'mouse' ? !isInsideFan(e.clientX, e.clientY) : played) setSpreadFrom(null);
  };

  const handleFanPointerCancel = () => {
    gestureRef.current = null;
    setDrag(null);
  };

  // Mouse and touch presses are handled in handlePointerUp, so the click the browser fires after
  // them is ignored (on touch screens it can even land on the wrong sleeve after the layout shifts).
  // Keyboard Enter/Space clicks have no press behind them (detail is 0) and play the record.
  const handleSleeveClick = (e, index) => {
    if (e.detail === 0) loadRecord(index);
  };

  // Keyboard: arrow keys move along the fan, and focus follows the raised sleeve
  const handleFanKeyDown = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    select(Math.min(tracks.length - 1, Math.max(0, active + step)));
  };

  // Keyboard focus arriving on the fan opens it on the selected sleeve; leaving settles it again
  const handleFanFocus = (e) => {
    if (e.target.matches(':focus-visible')) setSpreadFrom(active);
  };

  const handleFanBlur = (e) => {
    if (!fanRef.current.contains(e.relatedTarget)) setSpreadFrom(null);
  };

  // Touch has no "hover off", so tapping anywhere outside the fan settles it
  useEffect(() => {
    const onPointerDown = (e) => {
      if (e.pointerType !== 'mouse' && !fanRef.current?.contains(e.target)) setSpreadFrom(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => {
    const fan = fanRef.current;
    if (fan && fan.contains(document.activeElement)) {
      fan.querySelector('.sleeve.is-active')?.focus();
    }
  }, [active]);

  const progress = duration ? time / duration : 0;
  const armAngle = current !== null && (isPlaying || time > 0)
    ? ARM_START + progress * (ARM_END - ARM_START)
    : ARM_REST;
  const track = current !== null ? tracks[current] : null;
  const middle = (tracks.length - 1) / 2;

  // Evenly spread by default. While a sleeve is pointed at, only the sleeves to its right (the ones
  // covering it) swing away to reveal it; it and everything to its left stay put.
  const fanAngle = (index) => (index - middle) * FAN_SPREAD + (spreadFrom !== null && index > spreadFrom ? FAN_PUSH : 0);


  return (
    <div className="record-player">
      <div className="turntable">
        <svg className="turntable-base" viewBox="0 0 400 300" aria-hidden="true">
          <rect x="0.5" y="0.5" width="399" height="299" rx="10" fill="#f5f5f3" stroke="#111" />
          <circle cx={PLATTER.cx} cy={PLATTER.cy} r={PLATTER.r + 6} fill="#e6e6e3" stroke="#111" strokeWidth="0.75" />
          <circle cx={PLATTER.cx} cy={PLATTER.cy} r={PLATTER.r} fill="#1c1c1c" />
          {[100, 80, 60].map((r) => (
            <circle key={r} cx={PLATTER.cx} cy={PLATTER.cy} r={r} fill="none" stroke="#2a2a2a" strokeWidth="1" />
          ))}
          <circle cx={PLATTER.cx} cy={PLATTER.cy} r="3" fill="#8a8a8a" />
          <text x="380" y="284" textAnchor="end" className="turntable-label">33⅓</text>
        </svg>

        <div
          ref={platterRef}
          className={`platter${drag?.overPlatter ? ' is-over' : ''}`}
          style={{
            left: `${((PLATTER.cx - PLATTER.r) / 400) * 100}%`,
            top: `${((PLATTER.cy - PLATTER.r) / 300) * 100}%`,
            width: `${((PLATTER.r * 2) / 400) * 100}%`,
            height: `${((PLATTER.r * 2) / 300) * 100}%`,
          }}
        >
          {track && (
            <button
              key={current}
              type="button"
              className="platter-record"
              onClick={liftRecord}
              aria-label={`Lift ${track.title} off the turntable`}
            >
              <span className={`platter-spin${isPlaying ? '' : ' is-paused'}`}>
                <Vinyl color={track.color} title={track.title} year={yearOf(track.date)} />
              </span>
            </button>
          )}
        </div>

        <svg className="tonearm" viewBox="0 0 400 300" aria-hidden="true">
          <g
            className="tonearm-arm"
            style={{ transform: `rotate(${armAngle}deg)`, transformOrigin: `${ARM_PIVOT.x}px ${ARM_PIVOT.y}px` }}
          >
            <rect x="344" y="10" width="12" height="20" rx="2" fill="#111" />
            <line x1="350" y1="45" x2="350" y2="214" stroke="#111" strokeWidth="3" strokeLinecap="round" />
            <polygon points="345,210 357,212 353,246 340,243" fill="#111" />
          </g>
          <circle cx={ARM_PIVOT.x} cy={ARM_PIVOT.y} r="16" fill="#f5f5f3" stroke="#111" />
          <circle cx={ARM_PIVOT.x} cy={ARM_PIVOT.y} r="6" fill="#111" />
        </svg>

        <button
          type="button"
          className="turntable-button"
          onClick={() => (audio.paused ? play() : audio.pause())}
          disabled={!track}
        >
          {isPlaying ? 'pause' : 'play'}
        </button>
      </div>

      <div className="record-side">
        <div className="now-playing" aria-live="polite">
          {track ? (
            <>
              <span className="now-playing-label">{isLoading ? 'loading…' : isPlaying ? 'now playing' : 'paused'}</span>
              <span className="now-playing-title">{track.title}</span>
              <span className="now-playing-meta">Samples: {track.samples}</span>
              <span className="now-playing-meta">{track.date}</span>
              <div className="seek">
                <button
                  type="button"
                  className="seek-play"
                  onClick={() => (audio.paused ? play() : audio.pause())}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} style={{ marginLeft: 2 }} />}
                </button>
                <input
                  type="range"
                  className="seek-bar"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={Math.min(time, duration || 0)}
                  onChange={(e) => seek(Number(e.target.value))}
                  disabled={!duration}
                  style={{ '--pct': `${progress * 100}%` }}
                  aria-label={`Position in ${track.title}`}
                  aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
                />
                <span className="seek-time">{formatTime(time)} / {formatTime(duration)}</span>
              </div>
            </>
          ) : (
            <span className="now-playing-label">drag a record onto the turntable</span>
          )}
        </div>

        {/* Sleeves fanned out on an arc, like a hand of cards */}
        <div
          ref={fanRef}
          className="sleeve-fan"
          style={{ '--fan-count': tracks.length }}
          onPointerDown={handleFanPointerDown}
          onPointerMove={handleFanPointerMove}
          onPointerUp={handleFanPointerUp}
          onPointerCancel={handleFanPointerCancel}
          onPointerLeave={handleFanPointerLeave}
          onKeyDown={handleFanKeyDown}
          onFocus={handleFanFocus}
          onBlur={handleFanBlur}
        >
          {tracks.map((t, index) => {
            const isActive = index === active;
            return (
              <button
                key={t.title}
                type="button"
                data-index={index}
                className={`sleeve${isActive ? ' is-active' : ''}`}
                style={{
                  '--sleeve-color': t.color,
                  '--fan-angle': `${fanAngle(index)}deg`,
                  zIndex: index + 1, // stacking order never changes; the fan spreads instead
                }}
                tabIndex={isActive ? 0 : -1}
                aria-label={`${t.title}, ${t.date}. Press Enter to play, arrow keys for other records`}
                onClick={(e) => handleSleeveClick(e, index)}
              >
                <span className="sleeve-top">
                  <span className="sleeve-title">{t.title}</span>
                  {current === index && <span className="sleeve-playing">playing</span>}
                </span>
                <span className="sleeve-date">{t.date}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The record pulled out of its sleeve while it's dragged */}
      {drag && (
        <div
          className="dragging-record"
          style={{ width: drag.size, height: drag.size, left: drag.x - drag.size / 2, top: drag.y - drag.size / 2 }}
        >
          <Vinyl color={tracks[drag.index].color} title={tracks[drag.index].title} year={yearOf(tracks[drag.index].date)} />
        </div>
      )}
    </div>
  );
};

export default RecordPlayer;
