"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/math/constants.ts
function getConstant(name) {
  const constants = {
    \u03C0: PI,
    pi: PI,
    PI,
    e: E,
    E,
    \u03C6: GOLDEN_RATIO,
    phi: GOLDEN_RATIO,
    \u03A6: GOLDEN_RATIO
  };
  return constants[name];
}
var PI, E, GOLDEN_RATIO;
var init_constants = __esm({
  "src/math/constants.ts"() {
    "use strict";
    PI = Math.PI;
    E = Math.E;
    GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
  }
});

// src/calculator/parser.ts
var parser_exports = {};
__export(parser_exports, {
  buildAST: () => buildAST,
  parse: () => parse,
  tokenize: () => tokenize
});
function tokenize(expression) {
  const tokens = [];
  let i = 0;
  while (i < expression.length) {
    const char = expression[i];
    if (/\s/.test(char)) {
      i++;
      continue;
    }
    if (/\d/.test(char) || char === "-" && i === 0) {
      let numStr = char;
      i++;
      while (i < expression.length && /[\d.]/.test(expression[i])) {
        numStr += expression[i];
        i++;
      }
      tokens.push({ type: "number", value: numStr });
      continue;
    }
    if (OPERATORS.includes(char)) {
      tokens.push({ type: "operator", value: char });
      i++;
      continue;
    }
    if (/[a-zA-Z]/.test(char)) {
      let funcStr = "";
      while (i < expression.length && /[a-zA-Z]/.test(expression[i])) {
        funcStr += expression[i];
        i++;
      }
      if (FUNCTIONS.includes(funcStr.toLowerCase())) {
        tokens.push({ type: "function", value: funcStr.toLowerCase() });
      } else {
        const constant = getConstant(funcStr);
        if (constant !== void 0) {
          tokens.push({ type: "constant", value: funcStr });
        } else {
          throw new Error(`Unknown function or constant: ${funcStr}`);
        }
      }
      continue;
    }
    if (char === "(" || char === ")") {
      tokens.push({ type: "parenthesis", value: char });
      i++;
      continue;
    }
    i++;
  }
  return tokens;
}
function buildAST(tokens) {
  const output = [];
  const operators = [];
  for (const token of tokens) {
    switch (token.type) {
      case "number":
      case "constant":
        output.push({ type: token.type, value: token.value });
        break;
      case "function":
        operators.push(token.value);
        break;
      case "operator":
        while (operators.length > 0 && operators[operators.length - 1] !== "(" && OPERATOR_PRECEDENCE[operators[operators.length - 1]] >= OPERATOR_PRECEDENCE[token.value]) {
          const op = operators.pop();
          const right = output.pop();
          const left = output.pop();
          output.push({ type: "operator", value: op, left, right });
        }
        operators.push(token.value);
        break;
      case "parenthesis":
        if (token.value === "(") {
          operators.push(token.value);
        } else {
          while (operators.length > 0 && operators[operators.length - 1] !== "(") {
            const op = operators.pop();
            const right = output.pop();
            const left = output.pop();
            output.push({ type: "operator", value: op, left, right });
          }
          operators.pop();
          if (operators.length > 0 && FUNCTIONS.includes(operators[operators.length - 1])) {
            const funcName = operators.pop();
            const arg = output.pop();
            output.push({ type: "function", value: funcName, args: [arg] });
          }
        }
        break;
    }
  }
  while (operators.length > 0) {
    const op = operators.pop();
    const right = output.pop();
    const left = output.pop();
    output.push({ type: "operator", value: op, left, right });
  }
  if (output.length !== 1) {
    throw new Error("Invalid expression");
  }
  return output[0];
}
function parse(expression) {
  const tokens = tokenize(expression);
  return buildAST(tokens);
}
var FUNCTIONS, OPERATORS, OPERATOR_PRECEDENCE;
var init_parser = __esm({
  "src/calculator/parser.ts"() {
    "use strict";
    init_constants();
    FUNCTIONS = ["sin", "cos", "tan", "asin", "acos", "atan", "sqrt", "log", "ln", "pow", "factorial"];
    OPERATORS = ["+", "-", "\xD7", "\xF7", "^", "mod"];
    OPERATOR_PRECEDENCE = {
      "+": 1,
      "-": 1,
      "\xD7": 2,
      "\xF7": 2,
      "^": 3,
      "mod": 2
    };
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  CalculatorHistory: () => CalculatorHistory,
  DEFAULT_GESTURE_MAPPINGS: () => DEFAULT_GESTURE_MAPPINGS,
  E: () => E,
  GOLDEN_RATIO: () => GOLDEN_RATIO,
  PI: () => PI,
  acos: () => acos,
  add: () => add,
  addGestureMapping: () => addGestureMapping,
  applyOperation: () => applyOperation,
  asin: () => asin,
  atan: () => atan,
  buildAST: () => buildAST,
  cos: () => cos,
  distanceBetween: () => distanceBetween,
  divide: () => divide,
  evaluate: () => evaluate,
  evaluateNode: () => evaluateNode,
  evaluateWithPrecision: () => evaluateWithPrecision,
  factorial: () => factorial,
  getAllMappings: () => getAllMappings,
  getConstant: () => getConstant,
  isOperation: () => isOperation,
  ln: () => ln,
  log: () => log,
  mapGesture: () => mapGesture,
  multiply: () => multiply,
  negate: () => negate,
  parse: () => parse,
  pathLength: () => pathLength,
  percent: () => percent,
  power: () => power,
  recognizeGesture: () => recognizeGesture,
  removeGestureMapping: () => removeGestureMapping,
  resamplePoints: () => resamplePoints,
  sin: () => sin,
  smoothBezier: () => smoothBezier,
  smoothMovingAverage: () => smoothMovingAverage,
  sqrt: () => sqrt,
  subtract: () => subtract,
  tan: () => tan,
  tokenize: () => tokenize
});
module.exports = __toCommonJS(index_exports);

// src/math/basic.ts
function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}
function negate(num) {
  return -num;
}
function applyOperation(a, b, op) {
  switch (op) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "\xD7":
      return multiply(a, b);
    case "\xF7":
      return divide(a, b);
    default:
      throw new Error(`Unknown operation: ${op}`);
  }
}
function isOperation(char) {
  return ["+", "-", "\xD7", "\xF7"].includes(char);
}

// src/math/scientific.ts
function sin(angle, degrees = true) {
  const radians = degrees ? angle * Math.PI / 180 : angle;
  return Math.sin(radians);
}
function cos(angle, degrees = true) {
  const radians = degrees ? angle * Math.PI / 180 : angle;
  return Math.cos(radians);
}
function tan(angle, degrees = true) {
  const radians = degrees ? angle * Math.PI / 180 : angle;
  return Math.tan(radians);
}
function asin(value, degrees = true) {
  const result = Math.asin(value);
  return degrees ? result * 180 / Math.PI : result;
}
function acos(value, degrees = true) {
  const result = Math.acos(value);
  return degrees ? result * 180 / Math.PI : result;
}
function atan(value, degrees = true) {
  const result = Math.atan(value);
  return degrees ? result * 180 / Math.PI : result;
}
function sqrt(value) {
  if (value < 0) {
    throw new Error("Square root of negative number");
  }
  return Math.sqrt(value);
}
function power(base, exponent) {
  return Math.pow(base, exponent);
}
function log(value, base = 10) {
  if (value <= 0) {
    throw new Error("Logarithm of non-positive number");
  }
  return Math.log(value) / Math.log(base);
}
function ln(value) {
  if (value <= 0) {
    throw new Error("Natural logarithm of non-positive number");
  }
  return Math.log(value);
}
function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error("Factorial requires non-negative integer");
  }
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
function percent(value) {
  return value / 100;
}

// src/calculator/evaluator.ts
init_constants();
function evaluateNode(node) {
  switch (node.type) {
    case "number":
      return parseFloat(node.value);
    case "constant":
      const constant = getConstant(node.value);
      if (constant === void 0) {
        throw new Error(`Unknown constant: ${node.value}`);
      }
      return constant;
    case "operator":
      if (!node.left || !node.right) {
        throw new Error("Operator requires two operands");
      }
      const left = evaluateNode(node.left);
      const right = evaluateNode(node.right);
      switch (node.value) {
        case "+":
          return add(left, right);
        case "-":
          return subtract(left, right);
        case "\xD7":
          return multiply(left, right);
        case "\xF7":
          return divide(left, right);
        case "^":
          return power(left, right);
        case "mod":
          return left % right;
        default:
          throw new Error(`Unknown operator: ${node.value}`);
      }
    case "function":
      if (!node.args || node.args.length === 0) {
        throw new Error("Function requires arguments");
      }
      const arg = evaluateNode(node.args[0]);
      switch (node.value) {
        case "sin":
          return sin(arg);
        case "cos":
          return cos(arg);
        case "tan":
          return tan(arg);
        case "asin":
          return asin(arg);
        case "acos":
          return acos(arg);
        case "atan":
          return atan(arg);
        case "sqrt":
          return sqrt(arg);
        case "log":
          return log(arg);
        case "ln":
          return ln(arg);
        case "pow":
          if (node.args.length !== 2) {
            throw new Error("pow requires two arguments");
          }
          return power(arg, evaluateNode(node.args[1]));
        case "factorial":
          return factorial(arg);
        default:
          throw new Error(`Unknown function: ${node.value}`);
      }
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}
function evaluate(expression) {
  const { parse: parse2 } = (init_parser(), __toCommonJS(parser_exports));
  const ast = parse2(expression);
  return evaluateNode(ast);
}
function evaluateWithPrecision(expression, precision = 10) {
  const result = evaluate(expression);
  return Math.round(result * Math.pow(10, precision)) / Math.pow(10, precision);
}

// src/index.ts
init_parser();

// src/calculator/history.ts
var CalculatorHistory = class {
  constructor(maxSize = 50) {
    this.entries = [];
    this.maxSize = maxSize;
  }
  add(expression, result) {
    const entry = {
      expression,
      result,
      timestamp: Date.now()
    };
    this.entries.unshift(entry);
    if (this.entries.length > this.maxSize) {
      this.entries.pop();
    }
  }
  getAll() {
    return [...this.entries];
  }
  getRecent(count) {
    return this.entries.slice(0, count);
  }
  clear() {
    this.entries = [];
  }
  get(index) {
    return this.entries[index];
  }
  size() {
    return this.entries.length;
  }
  undo() {
    return this.entries.shift();
  }
  getLast() {
    return this.entries[0];
  }
};

// src/index.ts
init_constants();

// src/gesture/smoothing.ts
function smoothBezier(points, tension = 0.5) {
  if (points.length < 3) {
    return points;
  }
  const smoothed = [points[0]];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[Math.min(points.length - 1, i + 1)];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1 = {
      x: p1.x + (p2.x - p0.x) * tension * 0.5,
      y: p1.y + (p2.y - p0.y) * tension * 0.5
    };
    const cp2 = {
      x: p2.x - (p3.x - p1.x) * tension * 0.5,
      y: p2.y - (p3.y - p1.y) * tension * 0.5
    };
    const segments = 5;
    for (let j = 1; j <= segments; j++) {
      const t = j / segments;
      const point = cubicBezier(p1, cp1, cp2, p2, t);
      smoothed.push(point);
    }
  }
  smoothed.push(points[points.length - 1]);
  return smoothed;
}
function cubicBezier(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y
  };
}
function smoothMovingAverage(points, windowSize = 3) {
  if (points.length < windowSize) {
    return points;
  }
  const smoothed = [];
  const halfWindow = Math.floor(windowSize / 2);
  for (let i = 0; i < points.length; i++) {
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let j = -halfWindow; j <= halfWindow; j++) {
      const index = i + j;
      if (index >= 0 && index < points.length) {
        sumX += points[index].x;
        sumY += points[index].y;
        count++;
      }
    }
    smoothed.push({
      x: sumX / count,
      y: sumY / count
    });
  }
  return smoothed;
}
function resamplePoints(points, distance = 10) {
  if (points.length < 2) {
    return points;
  }
  const resampled = [points[0]];
  let accumulatedDistance = 0;
  for (let i = 1; i < points.length; i++) {
    const d = distanceBetween(points[i - 1], points[i]);
    accumulatedDistance += d;
    while (accumulatedDistance >= distance) {
      const ratio = (accumulatedDistance - distance) / d;
      const newPoint = {
        x: points[i].x + (points[i - 1].x - points[i].x) * ratio,
        y: points[i].y + (points[i - 1].y - points[i].y) * ratio
      };
      resampled.push(newPoint);
      accumulatedDistance -= distance;
    }
  }
  resampled.push(points[points.length - 1]);
  return resampled;
}
function distanceBetween(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
function pathLength(points) {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += distanceBetween(points[i - 1], points[i]);
  }
  return length;
}

// src/gesture/recognizer.ts
var SWIPE_THRESHOLD = 50;
var SWIPE_CONFIDENCE_THRESHOLD = 0.6;
var CIRCLE_CONFIDENCE_THRESHOLD = 0.5;
function recognizeGesture(points) {
  if (points.length < 2) {
    return {
      type: "tap",
      confidence: 1,
      points,
      start: points[0],
      end: points[points.length - 1],
      duration: 0
    };
  }
  const start = points[0];
  const end = points[points.length - 1];
  const duration = points[points.length - 1].timestamp ? points[points.length - 1].timestamp - points[0].timestamp : 0;
  const totalDistance = pathLength(points);
  const displacement = distanceBetween(start, end);
  if (totalDistance < SWIPE_THRESHOLD) {
    return {
      type: "tap",
      confidence: 1,
      points,
      start,
      end,
      duration
    };
  }
  const swipeGesture = recognizeSwipe(points, start, end, totalDistance, displacement);
  if (swipeGesture.confidence >= SWIPE_CONFIDENCE_THRESHOLD) {
    return swipeGesture;
  }
  const circleGesture = recognizeCircle(points, start, end);
  if (circleGesture.confidence >= CIRCLE_CONFIDENCE_THRESHOLD) {
    return circleGesture;
  }
  return {
    type: "unknown",
    confidence: 0,
    points,
    start,
    end,
    duration
  };
}
function recognizeSwipe(points, start, end, totalDistance, displacement) {
  const linearity = displacement / totalDistance;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  let gestureType = "unknown";
  let confidence = linearity;
  let normalizedAngle = angle;
  if (normalizedAngle < 0) {
    normalizedAngle += 360;
  }
  if (normalizedAngle >= 315 || normalizedAngle < 45) {
    gestureType = "swipe-right";
    confidence *= Math.cos(normalizedAngle * Math.PI / 180);
  } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
    gestureType = "swipe-down";
    confidence *= Math.sin(normalizedAngle * Math.PI / 180);
  } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
    gestureType = "swipe-left";
    confidence *= Math.abs(Math.cos(normalizedAngle * Math.PI / 180));
  } else if (normalizedAngle >= 225 && normalizedAngle < 315) {
    gestureType = "swipe-up";
    confidence *= Math.abs(Math.sin(normalizedAngle * Math.PI / 180));
  }
  return {
    type: gestureType,
    confidence: Math.max(0, Math.min(1, confidence)),
    points,
    start,
    end,
    duration: points[points.length - 1].timestamp ? points[points.length - 1].timestamp - points[0].timestamp : 0
  };
}
function recognizeCircle(points, start, end) {
  if (points.length < 8) {
    return {
      type: "unknown",
      confidence: 0,
      points,
      start,
      end,
      duration: 0
    };
  }
  let sumX = 0;
  let sumY = 0;
  for (const point of points) {
    sumX += point.x;
    sumY += point.y;
  }
  const centroid = {
    x: sumX / points.length,
    y: sumY / points.length
  };
  let sumRadius = 0;
  for (const point of points) {
    sumRadius += distanceBetween(point, centroid);
  }
  const avgRadius = sumRadius / points.length;
  let varianceSum = 0;
  for (const point of points) {
    const radius = distanceBetween(point, centroid);
    varianceSum += Math.pow(radius - avgRadius, 2);
  }
  const radiusVariance = varianceSum / points.length;
  const circularity = 1 / (1 + radiusVariance / avgRadius);
  let crossProductSum = 0;
  for (let i = 1; i < points.length; i++) {
    const p1 = points[i - 1];
    const p2 = points[i];
    crossProductSum += (p2.x - centroid.x) * (p1.y - centroid.y) - (p1.x - centroid.x) * (p2.y - centroid.y);
  }
  const isClockwise = crossProductSum < 0;
  const directionConfidence = Math.abs(crossProductSum) / (points.length * avgRadius * avgRadius);
  const gestureType = isClockwise ? "circle-clockwise" : "circle-counterclockwise";
  const closureDistance = distanceBetween(start, end);
  const closureScore = 1 - Math.min(1, closureDistance / (avgRadius * 2));
  const confidence = circularity * 0.5 + closureScore * 0.3 + directionConfidence * 0.2;
  return {
    type: gestureType,
    confidence: Math.max(0, Math.min(1, confidence)),
    points,
    start,
    end,
    duration: points[points.length - 1].timestamp ? points[points.length - 1].timestamp - points[0].timestamp : 0
  };
}

// src/gesture/mapping.ts
var DEFAULT_GESTURE_MAPPINGS = [
  { gesture: "swipe-right", operation: "+" },
  { gesture: "swipe-left", operation: "-" },
  { gesture: "swipe-up", operation: "\xD7" },
  { gesture: "swipe-down", operation: "\xF7" },
  { gesture: "circle-clockwise", operation: "=" },
  { gesture: "circle-counterclockwise", operation: "C" },
  { gesture: "tap", operation: "backspace", context: "backspace-area" },
  { gesture: "swipe-right", operation: "undo", context: "history" },
  { gesture: "swipe-left", operation: "redo", context: "history" }
];
function mapGesture(gesture, context) {
  const exactMatch = DEFAULT_GESTURE_MAPPINGS.find(
    (mapping) => mapping.gesture === gesture && mapping.context === context
  );
  if (exactMatch) {
    return exactMatch.operation;
  }
  const contextlessMatch = DEFAULT_GESTURE_MAPPINGS.find(
    (mapping) => mapping.gesture === gesture && !mapping.context
  );
  if (contextlessMatch) {
    return contextlessMatch.operation;
  }
  return null;
}
function addGestureMapping(mapping) {
  DEFAULT_GESTURE_MAPPINGS.push(mapping);
}
function removeGestureMapping(gesture, context) {
  const index = DEFAULT_GESTURE_MAPPINGS.findIndex(
    (mapping) => mapping.gesture === gesture && mapping.context === context
  );
  if (index !== -1) {
    DEFAULT_GESTURE_MAPPINGS.splice(index, 1);
    return true;
  }
  return false;
}
function getAllMappings() {
  return [...DEFAULT_GESTURE_MAPPINGS];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CalculatorHistory,
  DEFAULT_GESTURE_MAPPINGS,
  E,
  GOLDEN_RATIO,
  PI,
  acos,
  add,
  addGestureMapping,
  applyOperation,
  asin,
  atan,
  buildAST,
  cos,
  distanceBetween,
  divide,
  evaluate,
  evaluateNode,
  evaluateWithPrecision,
  factorial,
  getAllMappings,
  getConstant,
  isOperation,
  ln,
  log,
  mapGesture,
  multiply,
  negate,
  parse,
  pathLength,
  percent,
  power,
  recognizeGesture,
  removeGestureMapping,
  resamplePoints,
  sin,
  smoothBezier,
  smoothMovingAverage,
  sqrt,
  subtract,
  tan,
  tokenize
});
