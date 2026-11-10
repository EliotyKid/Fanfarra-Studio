/* @ds-bundle: {"format":4,"namespace":"FanfarraStudioDesignSystem_fca01a","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"PlayButton","sourcePath":"components/actions/PlayButton.jsx"},{"name":"ToggleButton","sourcePath":"components/actions/ToggleButton.jsx"},{"name":"StatusMessage","sourcePath":"components/feedback/StatusMessage.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Slider","sourcePath":"components/forms/Slider.jsx"},{"name":"VolumeSlider","sourcePath":"components/forms/VolumeSlider.jsx"},{"name":"ICON_PATHS","sourcePath":"components/icons/Icon.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"Panel","sourcePath":"components/layout/Panel.jsx"},{"name":"NavItem","sourcePath":"components/navigation/NavItem.jsx"},{"name":"StepSequencer","sourcePath":"components/player/StepSequencer.jsx"},{"name":"TrackHeader","sourcePath":"components/player/TrackHeader.jsx"},{"name":"TransportControls","sourcePath":"components/player/TransportControls.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"7e38654ac42f","components/actions/IconButton.jsx":"804bafb4c2e0","components/actions/PlayButton.jsx":"8f3a03190770","components/actions/ToggleButton.jsx":"b73c5b66e913","components/feedback/StatusMessage.jsx":"0a25244cdae6","components/forms/Select.jsx":"bb983bcff1ba","components/forms/Slider.jsx":"8ef200d21a98","components/forms/VolumeSlider.jsx":"0b4396d4ab68","components/icons/Icon.jsx":"59107a2b7979","components/layout/Panel.jsx":"fc6391a90cc3","components/navigation/NavItem.jsx":"35d8542ee0a4","components/player/StepSequencer.jsx":"d1e4bf75b3c6","components/player/TrackHeader.jsx":"efea455aa05d","components/player/TransportControls.jsx":"cb44b8d95b99","ui_kits/web-app/App.jsx":"f9bd3857ec46","ui_kits/web-app/DesktopPlayer.jsx":"a8b2ee75b580","ui_kits/web-app/MobileApp.jsx":"6cdee9e7da03","ui_kits/web-app/Sidebar.jsx":"22c980ecc46e","ui_kits/web-app/audio.js":"49a8396c5707","ui_kits/web-app/data.js":"dcd28fa5f125","ui_kits/web-app/ios-frame.jsx":"24642b887be3","ui_kits/web-app/usePlayer.jsx":"cfc19a8581d0"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.FanfarraStudioDesignSystem_fca01a = window.FanfarraStudioDesignSystem_fca01a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/forms/Slider.jsx
try { (() => {
function Slider({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label = 'Valor',
  disabled = false,
  valueText,
  className = '',
  style
}) {
  const ref = React.useRef(null);
  const pct = max === min ? 0 : (value - min) / (max - min) * 100;
  const clamp = v => Math.min(max, Math.max(min, Math.round(v / step) * step));
  const fromX = clientX => {
    const r = ref.current.getBoundingClientRect();
    return clamp(min + (clientX - r.left) / r.width * (max - min));
  };
  const onDown = e => {
    if (disabled) return;
    e.preventDefault();
    ref.current.focus();
    ref.current.setPointerCapture(e.pointerId);
    onChange && onChange(fromX(e.clientX));
  };
  const onMove = e => {
    if (!disabled && ref.current.hasPointerCapture(e.pointerId)) onChange && onChange(fromX(e.clientX));
  };
  const onKey = e => {
    if (disabled) return;
    const big = (max - min) / 10;
    let v = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') v = value + step * 5;else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') v = value - step * 5;else if (e.key === 'PageUp') v = value + big;else if (e.key === 'PageDown') v = value - big;else if (e.key === 'Home') v = min;else if (e.key === 'End') v = max;
    if (v !== null) {
      e.preventDefault();
      onChange && onChange(clamp(v));
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: ('fs-slider ' + className).trim(),
    style: style,
    role: "slider",
    tabIndex: disabled ? -1 : 0,
    "aria-label": label,
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuenow": value,
    "aria-valuetext": valueText,
    "aria-disabled": disabled || undefined,
    onPointerDown: onDown,
    onPointerMove: onMove,
    onKeyDown: onKey
  }, /*#__PURE__*/React.createElement("div", {
    className: "fs-slider__track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fs-slider__fill",
    style: {
      width: pct + '%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "fs-slider__thumb",
    style: {
      left: pct + '%'
    }
  }));
}
Object.assign(__ds_scope, { Slider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Slider.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
// Lucide icon paths (lucide-static@0.460.0, ISC) — copied programmatically from assets/icons/*.svg.
const ICON_PATHS = {
  'arrow-left': '<path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path>',
  'audio-lines': '<path d="M2 10v3"></path><path d="M6 6v11"></path><path d="M10 3v18"></path><path d="M14 8v7"></path><path d="M18 5v13"></path><path d="M22 10v3"></path>',
  'chart-no-axes-column': '<line x1="18" x2="18" y1="20" y2="10"></line><line x1="12" x2="12" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="14"></line>',
  'check': '<path d="M20 6 9 17l-5-5"></path>',
  'chevron-down': '<path d="m6 9 6 6 6-6"></path>',
  'chevron-left': '<path d="m15 18-6-6 6-6"></path>',
  'chevron-right': '<path d="m9 18 6-6-6-6"></path>',
  'chevron-up': '<path d="m18 15-6-6-6 6"></path>',
  'circle-alert': '<circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line>',
  'circle-check': '<circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path>',
  'circle-x': '<circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path>',
  'drum': '<path d="m2 2 8 8"></path><path d="m22 2-8 8"></path><ellipse cx="12" cy="9" rx="10" ry="5"></ellipse><path d="M7 13.4v7.9"></path><path d="M12 14v8"></path><path d="M17 13.4v7.9"></path><path d="M2 9v8a10 5 0 0 0 20 0V9"></path>',
  'expand': '<path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"></path><path d="M3 16.2V21m0 0h4.8M3 21l6-6"></path><path d="M21 7.8V3m0 0h-4.8M21 3l-6 6"></path><path d="M3 7.8V3m0 0h4.8M3 3l6 6"></path>',
  'headphones': '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>',
  'info': '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>',
  'keyboard': '<path d="M10 8h.01"></path><path d="M12 12h.01"></path><path d="M14 8h.01"></path><path d="M16 12h.01"></path><path d="M18 8h.01"></path><path d="M6 8h.01"></path><path d="M7 16h10"></path><path d="M8 12h.01"></path><rect width="20" height="16" x="2" y="4" rx="2"></rect>',
  'list-music': '<path d="M21 15V6"></path><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path><path d="M12 12H3"></path><path d="M16 6H3"></path><path d="M12 18H3"></path>',
  'loader-circle': '<path d="M21 12a9 9 0 1 1-6.219-8.56"></path>',
  'mail': '<rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>',
  'menu': '<line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>',
  'minus': '<path d="M5 12h14"></path>',
  'mouse-pointer-click': '<path d="M14 4.1 12 6"></path><path d="m5.1 8-2.9-.8"></path><path d="m6 12-1.9 2"></path><path d="M7.2 2.2 8 5.1"></path><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"></path>',
  'music-2': '<circle cx="8" cy="18" r="4"></circle><path d="M12 18V2l7 4"></path>',
  'music': '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>',
  'pause': '<rect x="14" y="4" width="4" height="16" rx="1"></rect><rect x="6" y="4" width="4" height="16" rx="1"></rect>',
  'play': '<polygon points="6 3 20 12 6 21 6 3"></polygon>',
  'plus': '<path d="M5 12h14"></path><path d="M12 5v14"></path>',
  'repeat': '<path d="m17 2 4 4-4 4"></path><path d="M3 11v-1a4 4 0 0 1 4-4h14"></path><path d="m7 22-4-4 4-4"></path><path d="M21 13v1a4 4 0 0 1-4 4H3"></path>',
  'rotate-cw': '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path>',
  'send': '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path>',
  'settings': '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle>',
  'shrink': '<path d="m15 15 6 6m-6-6v4.8m0-4.8h4.8"></path><path d="M9 19.8V15m0 0H4.2M9 15l-6 6"></path><path d="M15 4.2V9m0 0h4.8M15 9l6-6"></path><path d="M9 4.2V9m0 0H4.2M9 9 3 3"></path>',
  'skip-back': '<polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" x2="5" y1="19" y2="5"></line>',
  'skip-forward': '<polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" x2="19" y1="5" y2="19"></line>',
  'square': '<rect width="18" height="18" x="3" y="3" rx="2"></rect>',
  'timer': '<line x1="10" x2="14" y1="2" y2="2"></line><line x1="12" x2="15" y1="14" y2="11"></line><circle cx="12" cy="14" r="8"></circle>',
  'trash-2': '<path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line>',
  'triangle-alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
  'volume-1': '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path><path d="M16 9a5 5 0 0 1 0 6"></path>',
  'volume-2': '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path><path d="M16 9a5 5 0 0 1 0 6"></path><path d="M19.364 18.364a9 9 0 0 0 0-12.728"></path>',
  'volume-x': '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path><line x1="22" x2="16" y1="9" y2="15"></line><line x1="16" x2="22" y1="9" y2="15"></line>',
  'volume': '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path>',
  'x': '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>'
};
const FILLED = {
  play: true,
  pause: true,
  'skip-back': true,
  'skip-forward': true,
  square: true
};
function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  filled,
  color = 'currentColor',
  title,
  style,
  className = '',
  ...rest
}) {
  const inner = ICON_PATHS[name];
  if (!inner) return null;
  const isFilled = filled ?? !!FILLED[name];
  return React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: isFilled ? color : 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: ('fs-icon ' + className).trim(),
    style: {
      flexShrink: 0,
      display: 'block',
      ...style
    },
    role: title ? 'img' : undefined,
    'aria-hidden': title ? undefined : true,
    'aria-label': title,
    dangerouslySetInnerHTML: {
      __html: inner
    },
    ...rest
  });
}
Object.assign(__ds_scope, { ICON_PATHS, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = 'primary',
  size = 'lg',
  icon,
  iconRight,
  block = false,
  className = '',
  type = 'button',
  children,
  ...rest
}) {
  const cls = ['fs-btn', 'fs-btn--' + variant, size !== 'lg' && 'fs-btn--' + size, block && 'fs-btn--block', className].filter(Boolean).join(' ');
  const is = size === 'sm' ? 16 : 18;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: cls
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: is
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: is
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  shape = 'circle',
  pressed,
  iconSize,
  className = '',
  type = 'button',
  ...rest
}) {
  const cls = ['fs-iconbtn', 'fs-iconbtn--' + variant, 'fs-iconbtn--' + size, shape === 'square' && 'fs-iconbtn--square', className].filter(Boolean).join(' ');
  const is = iconSize ?? (size === 'sm' ? 18 : size === 'lg' ? 22 : 20);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: cls,
    "aria-label": label,
    title: label,
    "aria-pressed": pressed === undefined ? undefined : !!pressed
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: is
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/actions/PlayButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PlayButton({
  playing = false,
  onToggle,
  size = 'lg',
  className = '',
  onClick,
  ...rest
}) {
  const cls = ['fs-play', size === 'sm' && 'fs-play--sm', className].filter(Boolean).join(' ');
  const is = size === 'sm' ? 20 : 24;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    "aria-label": playing ? 'Pausar' : 'Tocar',
    title: playing ? 'Pausar (espaço)' : 'Tocar (espaço)',
    onClick: e => {
      onClick && onClick(e);
      onToggle && onToggle(!playing);
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: playing ? 'pause' : 'play',
    size: is,
    className: playing ? '' : 'fs-icon--play'
  }));
}
Object.assign(__ds_scope, { PlayButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/PlayButton.jsx", error: String((e && e.message) || e) }); }

// components/actions/ToggleButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ToggleButton({
  pressed = false,
  onPressedChange,
  icon,
  size = 'md',
  className = '',
  children,
  onClick,
  ...rest
}) {
  const cls = ['fs-toggle', size === 'lg' && 'fs-toggle--lg', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    "aria-pressed": !!pressed,
    onClick: e => {
      onClick && onClick(e);
      onPressedChange && onPressedChange(!pressed);
    }
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20
  }), children);
}
Object.assign(__ds_scope, { ToggleButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/ToggleButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusMessage.jsx
try { (() => {
const BADGE = {
  success: 'check',
  danger: 'x'
};
const TRAIL = {
  success: 'check',
  danger: 'x'
};
const bang = size => /*#__PURE__*/React.createElement("span", {
  "aria-hidden": "true",
  style: {
    font: '800 ' + size + 'px/1 var(--font-display)'
  }
}, "!");
function StatusMessage({
  tone = 'success',
  title,
  message,
  variant = 'inline',
  onDismiss,
  role,
  className = ''
}) {
  const cls = ['fs-status', 'fs-status--' + tone, variant === 'banner' && 'fs-status--banner', className].filter(Boolean).join(' ');
  const r = role || (tone === 'danger' ? 'alert' : 'status');
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    role: r
  }, /*#__PURE__*/React.createElement("span", {
    className: "fs-status__badge"
  }, BADGE[tone] ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: BADGE[tone],
    size: 14,
    strokeWidth: 3
  }) : bang(13)), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "fs-status__title"
  }, title), message && /*#__PURE__*/React.createElement("div", {
    className: "fs-status__msg"
  }, message)), onDismiss ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "fs-status__trail",
    "aria-label": "Fechar",
    onClick: onDismiss
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 20
  })) : /*#__PURE__*/React.createElement("span", {
    className: "fs-status__trail",
    "aria-hidden": "true"
  }, TRAIL[tone] ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: TRAIL[tone],
    size: 24
  }) : bang(26)));
}
Object.assign(__ds_scope, { StatusMessage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusMessage.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const norm = o => typeof o === 'object' && o !== null ? o : {
  value: o,
  label: String(o)
};
function Select({
  value,
  options = [],
  onChange,
  icon,
  label,
  size = 'md',
  block = false,
  disabled = false,
  renderValue,
  className = '',
  id
}) {
  const opts = options.map(norm);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const rootRef = React.useRef(null);
  const btnRef = React.useRef(null);
  const listRef = React.useRef(null);
  const uid = React.useRef(id || 'fs-sel-' + Math.random().toString(36).slice(2, 8)).current;
  const selIdx = Math.max(0, opts.findIndex(o => o.value === value));
  const sel = opts[selIdx];
  React.useEffect(() => {
    if (!open) return;
    setActive(selIdx);
    const onDoc = e => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    requestAnimationFrame(() => listRef.current && listRef.current.focus());
    return () => document.removeEventListener('pointerdown', onDoc);
  }, [open]);
  React.useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[active];
    if (el) {
      const l = listRef.current;
      if (el.offsetTop < l.scrollTop) l.scrollTop = el.offsetTop;else if (el.offsetTop + el.offsetHeight > l.scrollTop + l.clientHeight) l.scrollTop = el.offsetTop + el.offsetHeight - l.clientHeight;
    }
  }, [active, open]);
  const close = (focus = true) => {
    setOpen(false);
    if (focus) btnRef.current && btnRef.current.focus();
  };
  const pick = i => {
    const o = opts[i];
    if (o && onChange) onChange(o.value);
    close();
  };
  const onListKey = e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(opts.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(0, a - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(opts.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pick(active);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      close(false);
    }
  };
  const onBtnKey = e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
    }
  };
  const cls = ['fs-select', size === 'lg' && 'fs-select--lg', block && 'fs-select--block', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    ref: rootRef
  }, /*#__PURE__*/React.createElement("button", {
    ref: btnRef,
    type: "button",
    className: "fs-select__trigger",
    disabled: disabled,
    "aria-haspopup": "listbox",
    "aria-expanded": open,
    "aria-controls": uid + '-list',
    "aria-label": label ? label + ': ' + (sel ? sel.label : '') : undefined,
    onClick: () => setOpen(o => !o),
    onKeyDown: onBtnKey
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    className: "fs-select__value"
  }, renderValue ? renderValue(sel) : sel ? sel.label : ''), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    className: "fs-select__chev"
  })), open && /*#__PURE__*/React.createElement("ul", {
    ref: listRef,
    id: uid + '-list',
    className: "fs-select__menu",
    role: "listbox",
    tabIndex: -1,
    "aria-label": label,
    "aria-activedescendant": uid + '-o' + active,
    onKeyDown: onListKey
  }, opts.map((o, i) => /*#__PURE__*/React.createElement("li", {
    key: String(o.value),
    id: uid + '-o' + i,
    role: "option",
    className: "fs-select__option",
    "aria-selected": i === selIdx,
    "data-active": i === active,
    onPointerEnter: () => setActive(i),
    onClick: () => pick(i)
  }, /*#__PURE__*/React.createElement("span", null, o.label), i === selIdx && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 16
  })))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/VolumeSlider.jsx
try { (() => {
function VolumeSlider({
  value = 70,
  onChange,
  muted = false,
  onMuteToggle,
  showIcon = true,
  label = 'Volume',
  width,
  disabled = false,
  className = ''
}) {
  const eff = muted ? 0 : value;
  const glyph = muted || value === 0 ? 'volume-x' : value < 50 ? 'volume-1' : 'volume-2';
  return /*#__PURE__*/React.createElement("div", {
    className: ('fs-volume ' + className).trim(),
    style: width ? {
      width
    } : undefined
  }, showIcon && (onMuteToggle ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: glyph,
    label: muted ? 'Ativar som' : 'Silenciar',
    size: "sm",
    pressed: undefined,
    onClick: () => onMuteToggle(!muted),
    disabled: disabled
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-1)',
      display: 'inline-grid'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: glyph,
    size: 22
  }))), /*#__PURE__*/React.createElement(__ds_scope.Slider, {
    label: label,
    value: eff,
    onChange: v => {
      if (muted && onMuteToggle) onMuteToggle(false);
      onChange && onChange(v);
    },
    valueText: eff + '%',
    disabled: disabled
  }));
}
Object.assign(__ds_scope, { VolumeSlider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/VolumeSlider.jsx", error: String((e && e.message) || e) }); }

// components/layout/Panel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Panel({
  title,
  flush = false,
  as = 'section',
  className = '',
  children,
  ...rest
}) {
  const Tag = as;
  const cls = ['fs-panel', flush && 'fs-panel--flush', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), title && /*#__PURE__*/React.createElement("h2", {
    className: "fs-panel__title"
  }, title), children);
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Panel.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function NavItem({
  icon,
  label,
  children,
  active = false,
  href,
  onClick,
  inset = false,
  className = '',
  ...rest
}) {
  const cls = ['fs-nav-item', inset && 'fs-nav-item--inset', className].filter(Boolean).join(' ');
  const content = /*#__PURE__*/React.createElement(React.Fragment, null, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 24,
    strokeWidth: 1.75
  }), /*#__PURE__*/React.createElement("span", null, label ?? children));
  const common = {
    className: cls,
    'aria-current': active ? 'page' : undefined,
    onClick,
    ...rest
  };
  return href ? /*#__PURE__*/React.createElement("a", _extends({
    href: href
  }, common), content) : /*#__PURE__*/React.createElement("button", _extends({
    type: "button"
  }, common), content);
}
Object.assign(__ds_scope, { NavItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavItem.jsx", error: String((e && e.message) || e) }); }

// components/player/TrackHeader.jsx
try { (() => {
function TrackHeader({
  name,
  color,
  muted = false,
  onMuteToggle,
  compact = false,
  className = '',
  style
}) {
  const cls = ['fs-track', compact && 'fs-track--compact', muted && 'fs-track--muted', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    style: {
      '--inst': color,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "fs-track__dot",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "fs-track__name"
  }, name), onMuteToggle !== null && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: muted ? 'volume-x' : 'volume-2',
    size: "sm",
    iconSize: compact ? 16 : 20,
    label: (muted ? 'Ativar ' : 'Silenciar ') + name,
    pressed: muted,
    style: muted ? {
      background: 'transparent',
      borderColor: 'transparent',
      color: 'var(--danger)'
    } : undefined,
    onClick: () => onMuteToggle && onMuteToggle(!muted)
  }));
}
Object.assign(__ds_scope, { TrackHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/player/TrackHeader.jsx", error: String((e && e.message) || e) }); }

// components/player/StepSequencer.jsx
try { (() => {
function StepSequencer({
  tracks = [],
  bars = 4,
  stepsPerBar = 8,
  stepsPerBeat = 2,
  playhead = null,
  playing = false,
  onToggleStep,
  onMuteToggle,
  compact = false,
  minCellWidth,
  followPlayhead = true,
  className = '',
  style
}) {
  const total = bars * stepsPerBar;
  const minCell = minCellWidth ?? (compact ? 18 : 20);
  const cur = playhead == null ? -1 : Math.floor(playhead) % total;
  const scrollRef = React.useRef(null);
  const curBar = cur < 0 ? -1 : Math.floor(cur / stepsPerBar);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!followPlayhead || !el || curBar < 0 || el.scrollWidth <= el.clientWidth + 1) return;
    const barW = el.scrollWidth / bars,
      x = curBar * barW;
    if (x < el.scrollLeft || x + barW > el.scrollLeft + el.clientWidth) el.scrollTo({
      left: x,
      behavior: 'smooth'
    });
  }, [curBar, followPlayhead, bars]);
  const cols = 'repeat(' + total + ',minmax(0,1fr))';
  return /*#__PURE__*/React.createElement("div", {
    className: ['fs-seq', compact && 'fs-seq--compact', className].filter(Boolean).join(' '),
    "data-density": compact ? 'compact' : undefined,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "fs-seq__heads"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fs-seq__corner"
  }), tracks.map(t => /*#__PURE__*/React.createElement(__ds_scope.TrackHeader, {
    key: t.id,
    name: t.name,
    color: t.color,
    muted: !!t.muted,
    compact: compact,
    onMuteToggle: onMuteToggle ? m => onMuteToggle(t.id, m) : null
  }))), /*#__PURE__*/React.createElement("div", {
    className: "fs-seq__scroll",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "fs-seq__body",
    style: {
      minWidth: total * minCell
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "fs-seq__ruler",
    style: {
      gridTemplateColumns: 'repeat(' + bars + ',minmax(0,1fr))'
    }
  }, Array.from({
    length: bars
  }, (_, b) => /*#__PURE__*/React.createElement("div", {
    key: b,
    className: "fs-seq__bar"
  }, b + 1))), /*#__PURE__*/React.createElement("div", {
    className: "fs-seq__lanes"
  }, tracks.map((t, ti) => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "fs-seq__lane",
    "data-muted": !!t.muted,
    style: {
      '--inst': t.color,
      gridTemplateColumns: cols
    }
  }, Array.from({
    length: total
  }, (_, i) => {
    const on = !!(t.steps && t.steps[i]);
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "fs-seq__cell",
      "aria-pressed": on,
      "data-bar": i % stepsPerBar === 0,
      "data-beat": i % stepsPerBeat === 0,
      "data-hit": playing && on && cur === i,
      "aria-label": t.name + ', compasso ' + (Math.floor(i / stepsPerBar) + 1) + ', passo ' + (i % stepsPerBar + 1),
      onClick: () => onToggleStep && onToggleStep(t.id, i, !on)
    }, /*#__PURE__*/React.createElement("span", {
      className: "fs-seq__block"
    }));
  })))), playhead != null && /*#__PURE__*/React.createElement("div", {
    className: "fs-seq__playhead",
    style: {
      left: playhead % total / total * 100 + '%'
    },
    "aria-hidden": "true"
  }))));
}
Object.assign(__ds_scope, { StepSequencer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/player/StepSequencer.jsx", error: String((e && e.message) || e) }); }

// components/player/TransportControls.jsx
try { (() => {
function TransportControls({
  playing = false,
  onPlayToggle,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  loop,
  onLoopToggle,
  size = 'lg',
  spread = false,
  className = '',
  style
}) {
  const compact = size === 'sm';
  const v = compact ? 'ghost' : 'surface';
  const st = spread ? {
    justifyContent: 'space-between',
    width: '100%',
    ...style
  } : style;
  return /*#__PURE__*/React.createElement("div", {
    className: ['fs-transport', compact && 'fs-transport--compact', className].filter(Boolean).join(' '),
    style: st,
    role: "group",
    "aria-label": "Controles de reprodu\xE7\xE3o"
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "skip-back",
    label: "Toque anterior",
    variant: v,
    size: "lg",
    iconSize: compact ? 24 : 22,
    onClick: onPrev,
    disabled: prevDisabled
  }), /*#__PURE__*/React.createElement(__ds_scope.PlayButton, {
    playing: playing,
    onToggle: onPlayToggle,
    size: compact ? 'sm' : 'lg'
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "skip-forward",
    label: "Pr\xF3ximo toque",
    variant: v,
    size: "lg",
    iconSize: compact ? 24 : 22,
    onClick: onNext,
    disabled: nextDisabled
  }), onLoopToggle && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "rotate-cw",
    label: "Repetir (loop)",
    variant: "surface",
    size: "lg",
    pressed: !!loop,
    onClick: () => onLoopToggle(!loop)
  }));
}
Object.assign(__ds_scope, { TransportControls });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/player/TransportControls.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/App.jsx
try { (() => {
// App shell: routing, fullscreen, responsive switch between desktop frame and mobile layout.
function App({
  layout = 'auto'
}) {
  const p = window.usePlayer();
  window.useSpaceToPlay(p.togglePlay);
  const [route, setRoute] = React.useState('toques');
  const [w, setW] = React.useState(window.innerWidth);
  const [fs, setFs] = React.useState(false);
  const rootRef = React.useRef(null);
  React.useEffect(() => {
    const r = () => setW(window.innerWidth);
    const f = () => setFs(!!document.fullscreenElement);
    window.addEventListener('resize', r);
    document.addEventListener('fullscreenchange', f);
    return () => {
      window.removeEventListener('resize', r);
      document.removeEventListener('fullscreenchange', f);
    };
  }, []);
  const toggleFs = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen();else rootRef.current && rootRef.current.requestFullscreen();
    } catch (e) {}
  };
  const mobile = layout === 'mobile' || layout === 'auto' && w < 760;
  if (mobile) return /*#__PURE__*/React.createElement("div", {
    ref: rootRef,
    style: {
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(MobileApp, {
    p: p,
    route: route,
    onNavigate: setRoute,
    fullscreen: fs,
    onFullscreen: toggleFs
  }));
  return /*#__PURE__*/React.createElement("div", {
    ref: rootRef,
    style: {
      height: '100%',
      padding: fs ? 0 : 24,
      background: 'var(--bg-app)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'grid',
      gridTemplateColumns: 'var(--sidebar-w) minmax(0,1fr)',
      background: 'var(--bg-app)',
      border: '1px solid var(--border-subtle)',
      borderRadius: fs ? 0 : 'var(--radius-xl)',
      boxShadow: 'var(--shadow-panel)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    route: route,
    onNavigate: setRoute
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      display: 'flex',
      minWidth: 0,
      minHeight: 0
    }
  }, route === 'toques' ? /*#__PURE__*/React.createElement(DesktopPlayer, {
    p: p,
    fullscreen: fs,
    onFullscreen: toggleFs
  }) : /*#__PURE__*/React.createElement(EmptyScreen, {
    title: route === 'sobre' ? 'Sobre' : 'Contato',
    icon: route === 'sobre' ? 'info' : 'mail'
  }))));
}
Object.assign(window, {
  App
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/DesktopPlayer.jsx
try { (() => {
// Desktop "Toques" player: title + toolbar, transport, sequencer, footer bar.
function PlayerHeader({
  p
}) {
  const {
    Select,
    ToggleButton
  } = window.FanfarraStudioDesignSystem_fca01a;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 24,
      flexWrap: 'wrap',
      padding: '36px 24px 0 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-title)',
      color: 'var(--fg-1)'
    }
  }, p.toque.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-meta)',
      color: 'var(--fg-2)',
      marginTop: 8
    }
  }, p.toque.group)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Andamento",
    icon: "music-2",
    value: p.bpm,
    options: p.bpmOptions,
    onChange: p.setBpm
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Compasso",
    icon: "drum",
    value: p.sig,
    options: p.sigOptions,
    onChange: p.setSig
  }), /*#__PURE__*/React.createElement(ToggleButton, {
    icon: "rotate-cw",
    pressed: p.loop,
    onPressedChange: p.setLoop
  }, "Loop")));
}
function PlayerFooter({
  p,
  fullscreen,
  onFullscreen
}) {
  const {
    Icon,
    VolumeSlider,
    IconButton
  } = window.FanfarraStudioDesignSystem_fca01a;
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      minHeight: 72,
      padding: '0 24px 0 40px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-panel)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      color: 'var(--fg-2)',
      font: 'var(--type-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 20
  }), /*#__PURE__*/React.createElement("span", null, p.tracks.length, " instrumentos \xB7 ", p.bars, " compassos")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(VolumeSlider, {
    value: p.volume,
    onChange: p.setVolume,
    muted: p.muted,
    onMuteToggle: p.setMuted,
    width: 160
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: fullscreen ? 'shrink' : 'expand',
    label: fullscreen ? 'Sair da tela cheia' : 'Tela cheia',
    onClick: onFullscreen
  })));
}
function DesktopPlayer({
  p,
  fullscreen,
  onFullscreen
}) {
  const {
    TransportControls,
    StepSequencer
  } = window.FanfarraStudioDesignSystem_fca01a;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(PlayerHeader, {
    p: p
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '20px 0 20px'
    }
  }, /*#__PURE__*/React.createElement(TransportControls, {
    playing: p.playing,
    onPlayToggle: p.setPlaying,
    onPrev: p.prev,
    onNext: p.next
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflow: 'auto',
      marginRight: 16,
      background: 'var(--bg-sunken)'
    }
  }, /*#__PURE__*/React.createElement(StepSequencer, {
    tracks: p.tracks,
    bars: p.bars,
    stepsPerBar: p.spb,
    playhead: p.pos,
    playing: p.playing,
    onToggleStep: p.toggleStep,
    onMuteToggle: p.toggleMute,
    minCellWidth: 22
  })), /*#__PURE__*/React.createElement(PlayerFooter, {
    p: p,
    fullscreen: fullscreen,
    onFullscreen: onFullscreen
  }));
}
Object.assign(window, {
  DesktopPlayer,
  PlayerHeader,
  PlayerFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/DesktopPlayer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/MobileApp.jsx
try { (() => {
// Mobile layout (≤ 760px or inside the device frame): header + drawer, compact player.
function MobileApp({
  p,
  route,
  onNavigate,
  fullscreen,
  onFullscreen
}) {
  const {
    IconButton,
    Select,
    TransportControls,
    StepSequencer,
    VolumeSlider,
    NavItem
  } = window.FanfarraStudioDesignSystem_fca01a;
  const [menu, setMenu] = React.useState(false);
  const go = id => {
    onNavigate(id);
    setMenu(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-app)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 12px 10px 18px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/brand/logo-horizontal-transparent.png",
    alt: "Fanfarra Studio",
    style: {
      height: 40,
      width: 'auto',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "menu",
    label: "Abrir menu",
    size: "lg",
    iconSize: 24,
    onClick: () => setMenu(true),
    style: {
      color: 'var(--fg-1)'
    }
  })), route === 'toques' ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '20px 16px 0 6px'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "arrow-left",
    label: "Voltar",
    size: "lg",
    iconSize: 24,
    style: {
      color: 'var(--fg-1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '700 20px/1.2 var(--font-display)'
    }
  }, p.toque.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13px/1.3 var(--font-mono)',
      color: 'var(--fg-2)',
      marginTop: 4
    }
  }, p.toque.group))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      padding: '20px 16px 0'
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Andamento",
    icon: "music-2",
    value: p.bpm,
    options: p.bpmOptions,
    onChange: p.setBpm,
    size: "lg"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Compasso",
    icon: "drum",
    value: p.sig,
    options: p.sigOptions,
    onChange: p.setSig,
    size: "lg"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 16px 20px 24px'
    }
  }, /*#__PURE__*/React.createElement(TransportControls, {
    size: "sm",
    spread: true,
    playing: p.playing,
    onPlayToggle: p.setPlaying,
    onPrev: p.prev,
    onNext: p.next,
    loop: p.loop,
    onLoopToggle: p.setLoop
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement(StepSequencer, {
    compact: true,
    tracks: p.tracks,
    bars: p.bars,
    stepsPerBar: p.spb,
    playhead: p.pos,
    playing: p.playing,
    onToggleStep: p.toggleStep,
    onMuteToggle: p.toggleMute,
    minCellWidth: 18
  })), /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 12px 40px 16px',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(VolumeSlider, {
    value: p.volume,
    onChange: p.setVolume,
    muted: p.muted,
    onMuteToggle: p.setMuted
  })), /*#__PURE__*/React.createElement(IconButton, {
    icon: fullscreen ? 'shrink' : 'expand',
    label: "Tela cheia",
    onClick: onFullscreen
  }))) : /*#__PURE__*/React.createElement(EmptyScreen, {
    title: route === 'sobre' ? 'Sobre' : 'Contato',
    icon: route === 'sobre' ? 'info' : 'mail'
  }), /*#__PURE__*/React.createElement("div", {
    onClick: () => setMenu(false),
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(5,5,10,.6)',
      backdropFilter: 'blur(2px)',
      opacity: menu ? 1 : 0,
      pointerEvents: menu ? 'auto' : 'none',
      transition: 'opacity var(--dur-slow) var(--ease-out)',
      zIndex: 80
    }
  }), /*#__PURE__*/React.createElement("aside", {
    "aria-hidden": !menu,
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '78%',
      maxWidth: 320,
      background: 'var(--surface-panel)',
      borderLeft: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-pop)',
      transform: menu ? 'none' : 'translateX(105%)',
      transition: 'transform var(--dur-slow) var(--ease-out)',
      zIndex: 81,
      display: 'flex',
      flexDirection: 'column',
      padding: '56px 16px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "x",
    label: "Fechar menu",
    onClick: () => setMenu(false),
    tabIndex: menu ? 0 : -1
  })), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Principal",
    style: {
      display: 'grid',
      gap: 6
    }
  }, window.FS_NAV.map(n => /*#__PURE__*/React.createElement(NavItem, {
    key: n.id,
    inset: true,
    icon: n.icon,
    label: n.label,
    active: route === n.id,
    onClick: () => go(n.id),
    tabIndex: menu ? 0 : -1
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      textAlign: 'center',
      font: '400 12px/1.2 var(--font-body)',
      color: 'var(--fg-2)'
    }
  }, "Aprenda. Toque. Evolua.")));
}
Object.assign(window, {
  MobileApp
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/MobileApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Sidebar.jsx
try { (() => {
// Desktop sidebar: stacked logo, primary nav, tagline footer.
const FS_NAV = [{
  id: 'toques',
  icon: 'music',
  label: 'Toques'
}, {
  id: 'sobre',
  icon: 'info',
  label: 'Sobre'
}, {
  id: 'contato',
  icon: 'mail',
  label: 'Contato'
}];
function Sidebar({
  route,
  onNavigate
}) {
  const {
    NavItem,
    Icon
  } = window.FanfarraStudioDesignSystem_fca01a;
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--border-subtle)',
      background: 'var(--bg-app)',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      placeItems: 'center',
      padding: '28px 0 40px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/brand/logo-stacked-transparent.png",
    alt: "Fanfarra Studio",
    style: {
      width: 104,
      height: 'auto',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Principal",
    style: {
      display: 'grid',
      gap: 8,
      paddingRight: 16
    }
  }, FS_NAV.map(n => /*#__PURE__*/React.createElement(NavItem, {
    key: n.id,
    icon: n.icon,
    label: n.label,
    active: route === n.id,
    onClick: () => onNavigate(n.id)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      padding: '0 20px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-default)',
      paddingTop: 20,
      display: 'grid',
      justifyItems: 'center',
      gap: 10,
      color: 'var(--fg-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chart-no-axes-column",
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 12px/1.2 var(--font-body)',
      color: 'var(--fg-2)',
      whiteSpace: 'nowrap'
    }
  }, "Aprenda. Toque. Evolua."))));
}
function EmptyScreen({
  title,
  icon
}) {
  const {
    Icon,
    StatusMessage
  } = window.FanfarraStudioDesignSystem_fca01a;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'grid',
      alignContent: 'start',
      gap: 24,
      padding: '36px 40px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-title)',
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 28
  }), title), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 520
    }
  }, /*#__PURE__*/React.createElement(StatusMessage, {
    variant: "banner",
    tone: "warning",
    title: "Tela n\xE3o inclu\xEDda na refer\xEAncia",
    message: 'O layout de “' + title + '” ainda não foi enviado. Envie a referência para recriá-la fielmente.'
  })));
}
Object.assign(window, {
  Sidebar,
  EmptyScreen,
  FS_NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/audio.js
try { (() => {
// Fanfarra Studio — tiny Web Audio drum synth for the UI kit (no samples). window.FanfarraAudio
(function () {
  let ctx = null,
    master = null,
    noise = null,
    vol = 0.7;
  function ensure() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -10;
        comp.ratio.value = 4;
        master = ctx.createGain();
        master.gain.value = vol;
        master.connect(comp);
        comp.connect(ctx.destination);
        const len = ctx.sampleRate * 1.5;
        noise = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = noise.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) {
      ctx = null;
    }
    return ctx;
  }
  const env = (g, t, peak, dur) => {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  };
  function tone(t, type, f0, f1, sweep, peak, dur) {
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + sweep);
    env(g, t, peak, dur);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  function hiss(t, ftype, freq, q, peak, dur) {
    const s = ctx.createBufferSource(),
      f = ctx.createBiquadFilter(),
      g = ctx.createGain();
    s.buffer = noise;
    f.type = ftype;
    f.frequency.value = freq;
    f.Q.value = q;
    env(g, t, peak, dur);
    s.connect(f);
    f.connect(g);
    g.connect(master);
    s.start(t);
    s.stop(t + dur + 0.05);
  }
  const voices = {
    bumbo: t => {
      tone(t, 'sine', 130, 42, 0.22, 1.0, 0.5);
      hiss(t, 'lowpass', 900, 0.7, 0.25, 0.04);
    },
    surdo: t => {
      tone(t, 'sine', 92, 64, 0.35, 0.85, 0.75);
      hiss(t, 'lowpass', 500, 0.7, 0.18, 0.06);
    },
    tarol: t => {
      hiss(t, 'highpass', 1800, 0.6, 0.55, 0.17);
      hiss(t, 'bandpass', 4200, 1.2, 0.25, 0.1);
      tone(t, 'triangle', 240, 170, 0.06, 0.32, 0.08);
    },
    repique: t => {
      tone(t, 'triangle', 460, 330, 0.1, 0.55, 0.2);
      hiss(t, 'highpass', 3500, 0.8, 0.2, 0.03);
    },
    prato: t => {
      hiss(t, 'highpass', 6500, 0.5, 0.28, 1.1);
      hiss(t, 'bandpass', 9000, 2, 0.15, 0.6);
    }
  };
  window.FanfarraAudio = {
    ensure,
    now: () => ctx ? ctx.currentTime : performance.now() / 1000,
    play(id, when) {
      if (!ensure() || !voices[id]) return;
      try {
        voices[id](Math.max(when ?? ctx.currentTime, ctx.currentTime));
      } catch (e) {}
    },
    setVolume(v) {
      vol = v;
      if (master) master.gain.setTargetAtTime(v, ctx.currentTime, 0.02);
    }
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/audio.js", error: String((e && e.message) || e) }); }

// ui_kits/web-app/data.js
try { (() => {
// Fanfarra Studio — sample content for the web-app UI kit. Patterns are step indexes (0-based) over bars × (beats × 2) eighth-note steps.
window.FS_INSTRUMENTS = [{
  id: 'bumbo',
  name: 'Bumbo',
  color: 'var(--inst-bumbo)'
}, {
  id: 'prato',
  name: 'Prato',
  color: 'var(--inst-prato)'
}, {
  id: 'tarol',
  name: 'Tarol',
  color: 'var(--inst-tarol)'
}, {
  id: 'surdo',
  name: 'Surdo',
  color: 'var(--inst-surdo)'
}, {
  id: 'repique',
  name: 'Repique',
  color: 'var(--inst-repique)'
}];
window.FS_TOQUES = [{
  id: 'marcha-de-entrada',
  title: 'Marcha de Entrada',
  group: 'Fanfarra Municipal',
  bpm: 120,
  sig: '4/4',
  bars: 4,
  pattern: {
    bumbo: [0, 6, 8, 14, 20, 24, 28],
    prato: [2, 3, 10, 16, 22, 29],
    tarol: [0, 4, 6, 8, 10, 12, 14, 18, 20, 24, 26, 30],
    surdo: [2, 8, 16, 24],
    repique: [6, 12, 20, 22, 28, 30]
  }
}, {
  id: 'dobrado-de-desfile',
  title: 'Dobrado de Desfile',
  group: 'Banda Marcial',
  bpm: 110,
  sig: '4/4',
  bars: 4,
  pattern: {
    bumbo: [0, 4, 8, 12, 16, 20, 24, 28],
    prato: [0, 16, 30],
    tarol: [2, 3, 6, 10, 11, 14, 18, 19, 22, 26, 27, 28, 29, 30, 31],
    surdo: [4, 12, 20, 28],
    repique: [7, 15, 23, 31]
  }
}, {
  id: 'marcha-batida',
  title: 'Marcha Batida',
  group: 'Fanfarra Escolar',
  bpm: 130,
  sig: '4/4',
  bars: 4,
  pattern: {
    bumbo: [0, 3, 8, 11, 16, 19, 24, 27],
    prato: [4, 12, 20, 28],
    tarol: [0, 2, 4, 6, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 25, 26, 28, 29, 30, 31],
    surdo: [6, 14, 22, 30],
    repique: [5, 13, 21, 29, 30]
  }
}, {
  id: 'toque-de-avancar',
  title: 'Toque de Avançar',
  group: 'Fanfarra Municipal',
  bpm: 100,
  sig: '2/4',
  bars: 4,
  pattern: {
    bumbo: [0, 4, 8, 12],
    prato: [0, 8],
    tarol: [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15],
    surdo: [2, 6, 10, 14],
    repique: [3, 7, 11, 15]
  }
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/web-app/ios-frame.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).

/* BEGIN USAGE */
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports (to window): IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
//
// Usage — wrap your screen content in <IOSDevice> to get the bezel, status bar
// and home indicator (props: title, dark, keyboard):
//
//   <IOSDevice title="Settings">
//     ...your screen content...
//   </IOSDevice>
//   <IOSDevice dark title="Search" keyboard>…</IOSDevice>
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return (
    /*#__PURE__*/
    // data-om-starter: inert presence marker — Claude Design's starter-usage
    // probe reads it; it renders nothing. Keep it on this root element.
    React.createElement("div", {
      "data-om-starter": "ios-frame",
      style: {
        width,
        height,
        borderRadius: 48,
        overflow: 'hidden',
        position: 'relative',
        background: dark ? '#000' : '#F2F2F7',
        boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
        fontFamily: '-apple-system, system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 11,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 126,
        height: 37,
        borderRadius: 24,
        background: '#000',
        zIndex: 50
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }
    }, /*#__PURE__*/React.createElement(IOSStatusBar, {
      dark: dark
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }
    }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
      title: title,
      dark: dark
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflow: 'auto'
      }
    }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
      dark: dark
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        height: 34,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 8,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 139,
        height: 5,
        borderRadius: 100,
        background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
      }
    })))
  );
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/ios-frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/usePlayer.jsx
try { (() => {
// usePlayer — sequencer state + look-ahead audio scheduler shared by desktop and mobile layouts.
const FS_SIGS = ['2/4', '3/4', '4/4'];
const FS_BPMS = [80, 90, 100, 110, 120, 130, 140, 150, 160];
function fsBuildTracks(toque) {
  const total = toque.bars * parseInt(toque.sig, 10) * 2;
  return window.FS_INSTRUMENTS.map(ins => ({
    ...ins,
    muted: false,
    steps: Array.from({
      length: total
    }, (_, i) => (toque.pattern[ins.id] || []).includes(i))
  }));
}
function fsConvertSig(tracks, bars, fromSpb, toSpb) {
  return tracks.map(t => ({
    ...t,
    steps: Array.from({
      length: bars * toSpb
    }, (_, i) => {
      const b = Math.floor(i / toSpb),
        s = i % toSpb;
      return s < fromSpb ? !!t.steps[b * fromSpb + s] : false;
    })
  }));
}
function usePlayer() {
  const toques = window.FS_TOQUES;
  const A = window.FanfarraAudio;
  const [idx, setIdx] = React.useState(0);
  const [tracks, setTracks] = React.useState(() => fsBuildTracks(toques[0]));
  const [bpm, setBpm] = React.useState(toques[0].bpm);
  const [sig, setSig] = React.useState(toques[0].sig);
  const [loop, setLoop] = React.useState(true);
  const [playing, setPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(70);
  const [muted, setMuted] = React.useState(false);
  const [pos, setPos] = React.useState(0);
  const toque = toques[idx];
  const bars = toque.bars;
  const spb = parseInt(sig, 10) * 2;
  const total = bars * spb;
  const live = React.useRef({});
  live.current = {
    tracks,
    total,
    loop,
    pos
  };
  const eng = React.useRef({
    anchorPos: 0,
    anchorTime: 0,
    stepDur: 60 / bpm / 2,
    nextAbs: 0
  });
  const posAt = t => eng.current.anchorPos + (t - eng.current.anchorTime) / eng.current.stepDur;
  React.useEffect(() => {
    const e = eng.current,
      t = A.now();
    if (playing) {
      e.anchorPos = posAt(t);
      e.anchorTime = t;
    }
    e.stepDur = 60 / bpm / 2;
  }, [bpm]);
  React.useEffect(() => {
    A.setVolume(muted ? 0 : volume / 100);
  }, [volume, muted]);
  React.useEffect(() => {
    if (!playing || loop) return;
    const e = eng.current,
      p = posAt(A.now()),
      k = Math.floor(p / total) * total;
    e.anchorPos -= k;
    e.nextAbs -= k;
  }, [loop]);
  React.useEffect(() => {
    if (!playing) return;
    A.ensure();
    const e = eng.current;
    e.anchorTime = A.now() + 0.05;
    e.anchorPos = live.current.pos;
    e.nextAbs = Math.ceil(e.anchorPos - 1e-6);
    const sched = () => {
      const now = A.now();
      const L = live.current;
      for (;;) {
        const tt = e.anchorTime + (e.nextAbs - e.anchorPos) * e.stepDur;
        if (tt > now + 0.12 || !L.loop && e.nextAbs >= L.total) break;
        const st = e.nextAbs % L.total;
        if (tt >= now - 0.03) L.tracks.forEach(tr => {
          if (!tr.muted && tr.steps[st]) A.play(tr.id, tt);
        });
        e.nextAbs++;
      }
    };
    sched();
    const iv = setInterval(sched, 25);
    let raf;
    const tick = () => {
      const L = live.current;
      const p = Math.max(0, posAt(A.now()));
      if (!L.loop && p >= L.total) {
        setPlaying(false);
        setPos(0);
        return;
      }
      setPos(p % L.total);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      clearInterval(iv);
      cancelAnimationFrame(raf);
    };
  }, [playing]);
  const resetPos = () => {
    const e = eng.current;
    e.anchorPos = 0;
    e.anchorTime = A.now() + 0.05;
    e.nextAbs = 0;
    setPos(0);
    live.current.pos = 0;
  };
  const loadToque = i => {
    const n = (i + toques.length) % toques.length,
      t = toques[n];
    setIdx(n);
    setTracks(fsBuildTracks(t));
    setBpm(t.bpm);
    setSig(t.sig);
    resetPos();
  };
  return {
    toque,
    toques,
    idx,
    tracks,
    bpm,
    sig,
    loop,
    playing,
    volume,
    muted,
    pos,
    bars,
    spb,
    total,
    bpmOptions: FS_BPMS.map(v => ({
      value: v,
      label: v + ' BPM'
    })),
    sigOptions: FS_SIGS,
    setBpm,
    setLoop,
    setVolume,
    setMuted,
    setPlaying: p => {
      if (p) A.ensure();
      setPlaying(p);
    },
    togglePlay: () => {
      A.ensure();
      setPlaying(p => !p);
    },
    prev: () => loadToque(idx - 1),
    next: () => loadToque(idx + 1),
    setSig: s => {
      const to = parseInt(s, 10) * 2;
      setTracks(ts => fsConvertSig(ts, bars, spb, to));
      setSig(s);
      resetPos();
    },
    toggleStep: (id, i, on) => {
      setTracks(ts => ts.map(t => t.id === id ? {
        ...t,
        steps: t.steps.map((s, j) => j === i ? on : s)
      } : t));
      if (on && !playing) A.play(id);
    },
    toggleMute: (id, m) => setTracks(ts => ts.map(t => t.id === id ? {
      ...t,
      muted: m
    } : t))
  };
}
function useSpaceToPlay(toggle) {
  const ref = React.useRef(toggle);
  ref.current = toggle;
  React.useEffect(() => {
    const onKey = e => {
      if (e.code !== 'Space' || e.repeat) return;
      const el = e.target;
      if (el.closest && el.closest('input,textarea,select,button,a,[role=slider],[role=listbox],[contenteditable=true]')) return;
      e.preventDefault();
      ref.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
Object.assign(window, {
  usePlayer,
  useSpaceToPlay
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/usePlayer.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.PlayButton = __ds_scope.PlayButton;

__ds_ns.ToggleButton = __ds_scope.ToggleButton;

__ds_ns.StatusMessage = __ds_scope.StatusMessage;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Slider = __ds_scope.Slider;

__ds_ns.VolumeSlider = __ds_scope.VolumeSlider;

__ds_ns.ICON_PATHS = __ds_scope.ICON_PATHS;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.NavItem = __ds_scope.NavItem;

__ds_ns.StepSequencer = __ds_scope.StepSequencer;

__ds_ns.TrackHeader = __ds_scope.TrackHeader;

__ds_ns.TransportControls = __ds_scope.TransportControls;

})();
