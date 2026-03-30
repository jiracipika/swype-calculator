// src/components/Button.tsx
import { useState, useRef, useCallback } from "react";
import { jsx } from "react/jsx-runtime";
var SCHEMES = {
  number: {
    bg: "linear-gradient(175deg, #3E3E42 0%, #2A2A2D 100%)",
    pressed: "linear-gradient(175deg, #5A5A5E 0%, #484849 100%)",
    text: "#FFFFFF",
    shadow: "0 2px 8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
    shadowPressed: "inset 0 2px 5px rgba(0,0,0,0.4)"
  },
  operator: {
    bg: "linear-gradient(175deg, #FFAC1C 0%, #FF9500 100%)",
    pressed: "linear-gradient(175deg, #FFB830 0%, #E88600 100%)",
    text: "#FFFFFF",
    shadow: "0 2px 12px rgba(255,149,0,0.28), inset 0 1px 0 rgba(255,255,255,0.28)",
    shadowPressed: "0 1px 4px rgba(255,149,0,0.15), inset 0 2px 5px rgba(0,0,0,0.15)"
  },
  function: {
    bg: "linear-gradient(175deg, #6C6C70 0%, #545456 100%)",
    pressed: "linear-gradient(175deg, #888888 0%, #6E6E72 100%)",
    text: "#FFFFFF",
    shadow: "0 2px 8px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)",
    shadowPressed: "inset 0 2px 5px rgba(0,0,0,0.35)"
  },
  special: {
    bg: "linear-gradient(175deg, #6C6C70 0%, #545456 100%)",
    pressed: "linear-gradient(175deg, #888888 0%, #6E6E72 100%)",
    text: "#FFFFFF",
    shadow: "0 2px 8px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)",
    shadowPressed: "inset 0 2px 5px rgba(0,0,0,0.35)"
  }
};
var Button = ({
  value,
  onPress,
  onLongPress,
  type = "number",
  active = false,
  disabled = false,
  className = "",
  style = {},
  children
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [justReleased, setJustReleased] = useState(false);
  const longPressTimer = useRef();
  const didLongPress = useRef(false);
  const scheme = SCHEMES[type] ?? SCHEMES.number;
  const getBackground = () => {
    if (disabled) return "#1C1C1E";
    if (active) return "#FFFFFF";
    if (isPressed) return scheme.pressed;
    return scheme.bg;
  };
  const getColor = () => {
    if (disabled) return "#48484A";
    if (active) return type === "operator" ? "#FF9500" : "#1C1C1E";
    return scheme.text;
  };
  const getBoxShadow = () => {
    if (disabled) return "none";
    if (active && type === "operator") return "0 0 18px rgba(255,149,0,0.35)";
    if (isPressed) return scheme.shadowPressed;
    return scheme.shadow;
  };
  const getFontSize = () => {
    if (type === "number") return "28px";
    if (value.length > 2) return "16px";
    return "22px";
  };
  const getFontWeight = () => {
    if (type === "number") return "300";
    if (type === "operator") return "400";
    return "400";
  };
  const handlePointerDown = useCallback((e) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    didLongPress.current = false;
    setIsPressed(true);
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onLongPress?.();
      setIsPressed(false);
    }, 500);
  }, [disabled, onLongPress]);
  const handlePointerUp = useCallback(() => {
    if (disabled) return;
    clearTimeout(longPressTimer.current);
    setIsPressed(false);
    if (!didLongPress.current) {
      setJustReleased(true);
      onPress?.();
      setTimeout(() => setJustReleased(false), 380);
    }
  }, [disabled, onPress]);
  const handlePointerCancel = useCallback(() => {
    clearTimeout(longPressTimer.current);
    setIsPressed(false);
  }, []);
  const transform = isPressed ? "scale(0.93)" : "scale(1)";
  return /* @__PURE__ */ jsx(
    "button",
    {
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      disabled,
      className,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "20px",
        fontSize: getFontSize(),
        fontWeight: getFontWeight(),
        fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
        letterSpacing: type === "number" ? "-0.5px" : "-0.2px",
        height: "100%",
        width: "100%",
        background: getBackground(),
        color: getColor(),
        boxShadow: getBoxShadow(),
        transform,
        animation: justReleased ? "ios-spring 0.38s cubic-bezier(0.34,1.56,0.64,1) forwards" : void 0,
        transition: isPressed ? "transform 0.07s ease-out, box-shadow 0.07s ease-out" : "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease-out, background 0.15s ease-out",
        willChange: "transform",
        ...style
      },
      children: children || value
    }
  );
};

// src/components/CalculatorGrid.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var CalculatorGrid = ({
  items,
  onButtonPress,
  onButtonLongPress,
  gridTemplateColumns = "repeat(4, 1fr)",
  gap = "var(--ios-gap, 8px)",
  className = ""
}) => {
  const rows = Math.max(...items.map((item) => item.position.row)) + 1;
  const sortedItems = [...items].sort((a, b) => {
    if (a.position.row !== b.position.row) return a.position.row - b.position.row;
    return a.position.col - b.position.col;
  });
  return /* @__PURE__ */ jsx2(
    "div",
    {
      className: `calculator-grid ${className}`,
      style: {
        display: "grid",
        gridTemplateColumns,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap,
        padding: "var(--ios-pad, 16px)",
        paddingBottom: "max(var(--ios-pad, 16px), env(safe-area-inset-bottom))",
        flex: 1
      },
      children: sortedItems.map((item, index) => /* @__PURE__ */ jsx2(
        "div",
        {
          style: {
            gridRow: item.position.row + 1,
            gridColumn: item.colSpan ? `${item.position.col + 1} / span ${item.colSpan}` : item.position.col + 1,
            minHeight: "64px"
          },
          children: /* @__PURE__ */ jsx2(
            Button,
            {
              value: item.value,
              type: item.type,
              onPress: () => onButtonPress(item.value),
              onLongPress: () => onButtonLongPress?.(item.value),
              children: item.label ?? item.value
            }
          )
        },
        `${item.value}-${index}`
      ))
    }
  );
};
var createDefaultGridItems = () => [
  // Row 0 — scientific functions + backspace
  { value: "sin", type: "function", position: { row: 0, col: 0 } },
  { value: "cos", type: "function", position: { row: 0, col: 1 } },
  { value: "tan", type: "function", position: { row: 0, col: 2 } },
  { value: "\u232B", type: "function", position: { row: 0, col: 3 } },
  // Row 1 — parentheses + clear + divide
  { value: "(", type: "function", position: { row: 1, col: 0 } },
  { value: ")", type: "function", position: { row: 1, col: 1 } },
  { value: "C", type: "function", position: { row: 1, col: 2 } },
  { value: "\xF7", type: "operator", position: { row: 1, col: 3 } },
  // Row 2
  { value: "7", type: "number", position: { row: 2, col: 0 } },
  { value: "8", type: "number", position: { row: 2, col: 1 } },
  { value: "9", type: "number", position: { row: 2, col: 2 } },
  { value: "\xD7", type: "operator", position: { row: 2, col: 3 } },
  // Row 3
  { value: "4", type: "number", position: { row: 3, col: 0 } },
  { value: "5", type: "number", position: { row: 3, col: 1 } },
  { value: "6", type: "number", position: { row: 3, col: 2 } },
  { value: "-", type: "operator", position: { row: 3, col: 3 }, label: "\u2212" },
  // Row 4
  { value: "1", type: "number", position: { row: 4, col: 0 } },
  { value: "2", type: "number", position: { row: 4, col: 1 } },
  { value: "3", type: "number", position: { row: 4, col: 2 } },
  { value: "+", type: "operator", position: { row: 4, col: 3 } },
  // Row 5 — zero spans 2 columns
  { value: "0", type: "number", position: { row: 5, col: 0 }, colSpan: 2 },
  { value: ".", type: "number", position: { row: 5, col: 2 } },
  { value: "=", type: "operator", position: { row: 5, col: 3 } }
];

// src/components/Display.tsx
import { useEffect, useRef as useRef2, useState as useState2 } from "react";
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var formatResult = (value) => {
  if (typeof value === "number") {
    if (Math.abs(value) > 1e12 || Math.abs(value) < 1e-9 && value !== 0) {
      return value.toExponential(4);
    }
    const rounded = Math.round(value * 1e10) / 1e10;
    return rounded.toLocaleString("en-US", { maximumFractionDigits: 10 });
  }
  return value;
};
var getResultFontSize = (text) => {
  const len = text.replace(/[,\s]/g, "").length;
  if (len <= 6) return 84;
  if (len <= 9) return 68;
  if (len <= 12) return 54;
  if (len <= 15) return 42;
  return 32;
};
var Display = ({
  expression = "",
  result = "",
  showResult = false,
  className = ""
}) => {
  const formatted = showResult && result !== "" ? formatResult(result) : "0";
  const fontSize = getResultFontSize(formatted);
  const prevResult = useRef2(formatted);
  const [animKey, setAnimKey] = useState2(0);
  useEffect(() => {
    if (formatted !== prevResult.current) {
      prevResult.current = formatted;
      setAnimKey((k) => k + 1);
    }
  }, [formatted]);
  const letterSpacing = fontSize >= 68 ? "-4px" : fontSize >= 54 ? "-2.5px" : "-1.5px";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `calc-display ${className}`,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        padding: "0 22px 24px",
        minHeight: "220px",
        flexShrink: 0,
        position: "relative"
      },
      children: [
        /* @__PURE__ */ jsx3(
          "div",
          {
            style: {
              position: "absolute",
              bottom: "16px",
              right: "-20px",
              width: "200px",
              height: "120px",
              background: "radial-gradient(ellipse at 80% 60%, rgba(255,159,10,0.06) 0%, transparent 70%)",
              pointerEvents: "none"
            }
          }
        ),
        /* @__PURE__ */ jsx3(
          "div",
          {
            style: {
              fontSize: "22px",
              fontWeight: "300",
              color: "rgba(255,255,255,0.38)",
              textAlign: "right",
              lineHeight: 1.35,
              marginBottom: "6px",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
              letterSpacing: "-0.5px",
              minHeight: "30px",
              transition: "opacity 0.2s ease-out",
              opacity: expression ? 1 : 0
            },
            children: expression || "\xA0"
          }
        ),
        /* @__PURE__ */ jsx3(
          "div",
          {
            style: {
              fontSize: `${fontSize}px`,
              fontWeight: "200",
              color: "#FFFFFF",
              textAlign: "right",
              lineHeight: 1,
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
              letterSpacing,
              transition: "font-size 0.22s cubic-bezier(0.25,0.8,0.25,1), letter-spacing 0.22s ease",
              animation: "result-appear 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards",
              textShadow: "0 0 40px rgba(255,255,255,0.06)"
            },
            children: formatted
          },
          animKey
        )
      ]
    }
  );
};

// src/components/HistoryPanel.tsx
import { Fragment, jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
var formatResult2 = (value) => {
  if (Math.abs(value) > 1e12 || Math.abs(value) < 1e-9 && value !== 0) {
    return value.toExponential(4);
  }
  return (Math.round(value * 1e10) / 1e10).toLocaleString("en-US", { maximumFractionDigits: 10 });
};
var formatTime = (timestamp) => {
  const diff = Date.now() - timestamp;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return new Date(timestamp).toLocaleDateString();
};
var HistoryPanel = ({
  history,
  onSelectHistory,
  onClearHistory,
  isOpen = false,
  onClose,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs2(Fragment, { children: [
    isOpen && /* @__PURE__ */ jsx4(
      "div",
      {
        onClick: onClose,
        style: {
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 900,
          animation: "backdrop-appear 0.28s ease-out forwards"
        }
      }
    ),
    /* @__PURE__ */ jsxs2(
      "div",
      {
        className,
        style: {
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(340px, 88vw)",
          height: "100%",
          /* Frosted glass */
          background: "rgba(14, 14, 16, 0.92)",
          backdropFilter: "saturate(180%) blur(28px)",
          WebkitBackdropFilter: "saturate(180%) blur(28px)",
          borderLeft: "0.5px solid rgba(255,255,255,0.1)",
          zIndex: 1e3,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.38s cubic-bezier(0.32,0,0.67,0)",
          willChange: "transform"
        },
        children: [
          /* @__PURE__ */ jsx4(
            "div",
            {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,159,10,0.4) 40%, rgba(255,159,10,0.15) 100%)"
              }
            }
          ),
          /* @__PURE__ */ jsxs2(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "22px 20px 18px",
                paddingTop: "max(22px, env(safe-area-inset-top))",
                borderBottom: "0.5px solid rgba(255,255,255,0.07)",
                flexShrink: 0
              },
              children: [
                /* @__PURE__ */ jsx4(
                  "span",
                  {
                    style: {
                      fontSize: "22px",
                      fontWeight: "600",
                      color: "#FFFFFF",
                      fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
                      letterSpacing: "-0.5px"
                    },
                    children: "Recents"
                  }
                ),
                /* @__PURE__ */ jsxs2("div", { style: { display: "flex", gap: "8px", alignItems: "center" }, children: [
                  history.length > 0 && /* @__PURE__ */ jsx4(
                    "button",
                    {
                      onClick: onClearHistory,
                      style: {
                        padding: "5px 14px",
                        borderRadius: "20px",
                        background: "rgba(255,59,48,0.12)",
                        color: "#FF453A",
                        fontSize: "13px",
                        fontWeight: "500",
                        letterSpacing: "-0.1px",
                        cursor: "default",
                        fontFamily: "-apple-system, system-ui, sans-serif",
                        transition: "background 0.15s",
                        border: "0.5px solid rgba(255,59,48,0.2)"
                      },
                      onPointerEnter: (e) => {
                        e.currentTarget.style.background = "rgba(255,59,48,0.22)";
                      },
                      onPointerLeave: (e) => {
                        e.currentTarget.style.background = "rgba(255,59,48,0.12)";
                      },
                      children: "Clear"
                    }
                  ),
                  /* @__PURE__ */ jsx4(
                    "button",
                    {
                      onClick: onClose,
                      style: {
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "default",
                        lineHeight: 1,
                        border: "0.5px solid rgba(255,255,255,0.1)",
                        transition: "background 0.15s"
                      },
                      onPointerEnter: (e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.14)";
                      },
                      onPointerLeave: (e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                      },
                      children: "\u2715"
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx4(
            "div",
            {
              className: "history-scroll",
              style: {
                flex: 1,
                overflowY: "auto",
                padding: "10px 12px",
                WebkitOverflowScrolling: "touch"
              },
              children: history.length === 0 ? /* @__PURE__ */ jsxs2(
                "div",
                {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    gap: "14px",
                    fontFamily: "-apple-system, system-ui, sans-serif"
                  },
                  children: [
                    /* @__PURE__ */ jsx4(
                      "div",
                      {
                        style: {
                          width: "56px",
                          height: "56px",
                          borderRadius: "18px",
                          background: "rgba(255,255,255,0.06)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "28px"
                        },
                        children: "\u23F1"
                      }
                    ),
                    /* @__PURE__ */ jsx4(
                      "div",
                      {
                        style: {
                          fontSize: "15px",
                          color: "rgba(255,255,255,0.25)",
                          fontWeight: "400",
                          letterSpacing: "-0.2px"
                        },
                        children: "No calculations yet"
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ jsx4("div", { style: { display: "flex", flexDirection: "column", gap: "3px" }, children: [...history].reverse().map((entry, index) => /* @__PURE__ */ jsxs2(
                "button",
                {
                  onClick: () => onSelectHistory?.(entry),
                  style: {
                    padding: "14px 16px",
                    borderRadius: "16px",
                    background: "transparent",
                    textAlign: "right",
                    width: "100%",
                    cursor: "default",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "4px",
                    transition: "background 0.12s ease-out",
                    fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
                    animation: `entry-appear 0.3s ease-out ${Math.min(index * 0.04, 0.2)}s both`
                  },
                  onPointerEnter: (e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  },
                  onPointerLeave: (e) => {
                    e.currentTarget.style.background = "transparent";
                  },
                  children: [
                    /* @__PURE__ */ jsx4(
                      "span",
                      {
                        style: {
                          fontSize: "13px",
                          color: "rgba(255,255,255,0.35)",
                          letterSpacing: "-0.1px",
                          lineHeight: 1.3
                        },
                        children: entry.expression
                      }
                    ),
                    /* @__PURE__ */ jsx4(
                      "span",
                      {
                        style: {
                          fontSize: "28px",
                          fontWeight: "200",
                          color: "#FFFFFF",
                          letterSpacing: "-1.5px",
                          lineHeight: 1.1
                        },
                        children: formatResult2(entry.result)
                      }
                    ),
                    /* @__PURE__ */ jsx4(
                      "span",
                      {
                        style: {
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.2)",
                          fontWeight: "400",
                          letterSpacing: "0.1px"
                        },
                        children: formatTime(entry.timestamp)
                      }
                    )
                  ]
                },
                index
              )) })
            }
          )
        ]
      }
    )
  ] });
};

// src/components/SwipeTrail.tsx
import { useRef as useRef3, useEffect as useEffect2, useCallback as useCallback2 } from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
var SwipeTrail = ({
  points,
  color = "rgba(0, 122, 255, 0.6)",
  lineWidth = 4,
  smoothing = true,
  className = "",
  style = {}
}) => {
  const canvasRef = useRef3(null);
  const drawTrail = useCallback2(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    if (smoothing && points.length > 2) {
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    } else {
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
    }
    ctx.stroke();
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      const gradient = ctx.createRadialGradient(
        lastPoint.x,
        lastPoint.y,
        0,
        lastPoint.x,
        lastPoint.y,
        lineWidth * 3
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, lineWidth * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [points, color, lineWidth, smoothing]);
  useEffect2(() => {
    drawTrail();
  }, [drawTrail]);
  const getCanvasSize = useCallback2(() => {
    if (points.length === 0) {
      return { width: 0, height: 0 };
    }
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const padding = lineWidth * 6;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;
    return {
      width: Math.max(width, 100),
      height: Math.max(height, 100)
    };
  }, [points, lineWidth]);
  const canvasSize = getCanvasSize();
  return /* @__PURE__ */ jsx5(
    "canvas",
    {
      ref: canvasRef,
      width: canvasSize.width,
      height: canvasSize.height,
      className,
      style: {
        pointerEvents: "none",
        ...style
      }
    }
  );
};

// src/hooks/useSwipe.ts
import { useState as useState3, useCallback as useCallback3, useRef as useRef4 } from "react";
import { smoothBezier, recognizeGesture } from "@swype-calc/core";
var useSwipe = (options = {}) => {
  const {
    onSwipeStart,
    onSwipeMove,
    onSwipeEnd,
    smoothing = true,
    sampleRate = 16
    // ~60fps
  } = options;
  const [isSwiping, setIsSwiping] = useState3(false);
  const pointsRef = useRef4([]);
  const lastSampleRef = useRef4(0);
  const startSwipe = useCallback3(
    (e) => {
      const point = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      };
      pointsRef.current = [point];
      setIsSwiping(true);
      lastSampleRef.current = Date.now();
      onSwipeStart?.(point);
    },
    [onSwipeStart]
  );
  const moveSwipe = useCallback3(
    (e) => {
      if (!isSwiping) return;
      const now = Date.now();
      if (now - lastSampleRef.current < sampleRate) {
        return;
      }
      const point = {
        x: e.clientX,
        y: e.clientY,
        timestamp: now
      };
      pointsRef.current.push(point);
      lastSampleRef.current = now;
      let currentPoints = pointsRef.current;
      if (smoothing && currentPoints.length >= 3) {
        currentPoints = smoothBezier(currentPoints);
      }
      onSwipeMove?.(currentPoints);
    },
    [isSwiping, onSwipeMove, smoothing, sampleRate]
  );
  const endSwipe = useCallback3(
    (e) => {
      if (!isSwiping) return;
      const point = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      };
      pointsRef.current.push(point);
      let finalPoints = pointsRef.current;
      if (smoothing && finalPoints.length >= 3) {
        finalPoints = smoothBezier(finalPoints);
      }
      const gesture = recognizeGesture(finalPoints);
      onSwipeEnd?.(gesture.type === "unknown" ? null : gesture.type, finalPoints);
      setIsSwiping(false);
      pointsRef.current = [];
    },
    [isSwiping, onSwipeEnd, smoothing]
  );
  const cancelSwipe = useCallback3(() => {
    if (!isSwiping) return;
    setIsSwiping(false);
    pointsRef.current = [];
  }, [isSwiping]);
  return {
    onPointerDown: startSwipe,
    onPointerMove: moveSwipe,
    onPointerUp: endSwipe,
    onPointerLeave: cancelSwipe,
    onPointerCancel: cancelSwipe
  };
};

// src/hooks/useCalculator.ts
import { useState as useState4, useCallback as useCallback4 } from "react";
import { CalculatorHistory, evaluate } from "@swype-calc/core";
var useCalculator = () => {
  const [state, setState] = useState4({
    expression: "",
    result: "0",
    showResult: false,
    history: [],
    error: null
  });
  const historyRef = useState4(new CalculatorHistory())[0];
  const addToExpression = useCallback4((value) => {
    setState((prev) => ({
      ...prev,
      expression: prev.expression + value,
      showResult: false,
      error: null
    }));
  }, []);
  const clearExpression = useCallback4(() => {
    setState({
      expression: "",
      result: "0",
      showResult: false,
      history: state.history,
      error: null
    });
  }, [state.history]);
  const backspace = useCallback4(() => {
    setState((prev) => {
      const newExpression = prev.expression.slice(0, -1);
      return {
        ...prev,
        expression: newExpression,
        showResult: false
      };
    });
  }, []);
  const calculate = useCallback4(() => {
    setState((prev) => {
      try {
        if (!prev.expression || prev.expression.trim() === "") {
          return {
            ...prev,
            result: "0",
            showResult: true,
            error: null
          };
        }
        const result = evaluate(prev.expression);
        const formattedResult = formatNumber(result);
        historyRef.add(prev.expression, result);
        return {
          ...prev,
          result: formattedResult,
          showResult: true,
          history: historyRef.getAll(),
          error: null
        };
      } catch (error) {
        return {
          ...prev,
          error: error instanceof Error ? error.message : "Calculation error",
          showResult: false
        };
      }
    });
  }, [historyRef]);
  const toggleSign = useCallback4(() => {
    setState((prev) => {
      if (prev.showResult) {
        const num = parseFloat(prev.result);
        const toggled = -num;
        return {
          ...prev,
          result: formatNumber(toggled)
        };
      } else {
        const newExpression = prev.expression.replace(/(-?\d+(\.\d+)?)$/, (match) => {
          const num = parseFloat(match);
          return formatNumber(-num);
        });
        return {
          ...prev,
          expression: newExpression
        };
      }
    });
  }, []);
  const useFromHistory = useCallback4((entry) => {
    setState((prev) => ({
      ...prev,
      expression: entry.expression,
      result: formatNumber(entry.result),
      showResult: true,
      error: null
    }));
  }, []);
  const clearHistory = useCallback4(() => {
    historyRef.clear();
    setState((prev) => ({
      ...prev,
      history: []
    }));
  }, [historyRef]);
  const handleInput = useCallback4((value) => {
    switch (value) {
      case "C":
        clearExpression();
        break;
      case "=":
        calculate();
        break;
      case "\u232B":
        backspace();
        break;
      case "\xB1":
        toggleSign();
        break;
      default:
        addToExpression(value);
    }
  }, [addToExpression, clearExpression, calculate, backspace, toggleSign]);
  return {
    ...state,
    addToExpression,
    clearExpression,
    backspace,
    calculate,
    toggleSign,
    useFromHistory,
    clearHistory,
    handleInput
  };
};
function formatNumber(num) {
  if (Math.abs(num) > 1e10 || Math.abs(num) < 1e-10 && num !== 0) {
    return num.toExponential(6);
  }
  const rounded = Math.round(num * 1e10) / 1e10;
  return rounded.toString();
}

// src/styles/colors.ts
var colors = {
  bg: {
    primary: "rgba(255, 255, 255, 0.8)",
    secondary: "rgba(255, 255, 255, 0.6)",
    glass: "rgba(255, 255, 255, 0.4)",
    dark: "rgba(30, 30, 32, 0.9)",
    darkGlass: "rgba(30, 30, 32, 0.6)"
  },
  accent: {
    blue: "#007AFF",
    pink: "#FF2D55",
    green: "#34C759",
    orange: "#FF9500",
    purple: "#AF52DE",
    teal: "#5AC8FA"
  },
  text: {
    primary: "#1C1C1E",
    secondary: "#8E8E93",
    dark: "#FFFFFF",
    darkSecondary: "#AEAEB2"
  },
  trail: {
    default: "rgba(0, 122, 255, 0.6)",
    blue: "rgba(0, 122, 255, 0.8)",
    pink: "rgba(255, 45, 85, 0.8)",
    green: "rgba(52, 199, 89, 0.8)"
  },
  button: {
    normal: "rgba(255, 255, 255, 0.6)",
    active: "rgba(255, 255, 255, 0.8)",
    operator: "rgba(240, 240, 245, 0.9)",
    function: "rgba(230, 230, 235, 0.9)"
  },
  shadow: "rgba(0, 0, 0, 0.1)"
};

// src/styles/animations.ts
var easings = {
  smooth: "cubic-bezier(0.25, 0.8, 0.25, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)"
};
var durations = {
  fast: 150,
  normal: 300,
  slow: 400,
  trail: 16
  // ~60fps
};
var animations = {
  buttonPress: {
    duration: durations.fast,
    easing: easings.spring
  },
  modeToggle: {
    duration: durations.normal,
    easing: easings.smooth
  },
  historyPanel: {
    duration: durations.slow,
    easing: easings.smooth
  },
  trailDraw: {
    duration: durations.trail,
    easing: "linear"
  },
  resultUpdate: {
    duration: durations.normal,
    easing: easings.easeOut
  }
};
var keyframes = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 }
  },
  scaleIn: {
    from: { transform: "scale(0.95)" },
    to: { transform: "scale(1)" }
  },
  slideUp: {
    from: { transform: "translateY(100%)" },
    to: { transform: "translateY(0)" }
  },
  slideDown: {
    from: { transform: "translateY(0)" },
    to: { transform: "translateY(100%)" }
  }
};
export {
  Button,
  CalculatorGrid,
  Display,
  HistoryPanel,
  SwipeTrail,
  animations,
  colors,
  createDefaultGridItems,
  durations,
  easings,
  keyframes,
  useCalculator,
  useSwipe
};
