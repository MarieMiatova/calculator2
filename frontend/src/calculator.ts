
function normalizeOp(ch: string): string {
  if (ch === "×") return "*";
  if (ch === "÷") return "/";
  if (ch === "−") return "-"; 
  return ch;
}


const precedence: { [key: string]: number } = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "%": 2,
  "^": 3,
  "u-": 4,
};


const associativity: { [key: string]: boolean } = {
  "+": false, 
  "-": false, 
  "*": false, 
  "/": false, 
  "%": false, 
  "^": true, 
  "u-": true, 
};


function tokenize(expr: string): (number | string)[] {
  const tokens: (number | string)[] = [];
  let i = 0;
  const s = expr.trim().replace(/\s+/g, "");
  if (s.length === 0) return [];

  while (i < s.length) {
    const ch = s[i];


    if (/[0-9.]/.test(ch)) {
      let j = i;
      let dotCount = 0;
      while (j < s.length && (/[0-9.]/.test(s[j]))) {
        if (s[j] === '.') dotCount++;
        j++;
      }
      if (dotCount > 1) throw new Error("Некорректное число: более одной десятичной точки.");
      const raw = s.substring(i, j);
      const val = parseFloat(raw);
      if (isNaN(val)) throw new Error("Некорректное число");
      tokens.push(val);
      i = j;
      continue;
    }

    const op = normalizeOp(ch);
    switch (op) {
      case "+":
      case "*":
      case "/":
      case "%":
      case "^":
      case "(":
      case ")":
        tokens.push(op);
        i++;
        break;
      case "-":
        const prevToken = tokens.length > 0 ? tokens[tokens.length - 1] : undefined;
        if (tokens.length === 0 ||
            prevToken === "(" ||
            (typeof prevToken === "string" && ["+", "-", "*", "/", "%", "^"].includes(prevToken))) {
          tokens.push("u-"); 
        } else {
          tokens.push("-"); 
        }
        i++;
        break;
      default:
        throw new Error(`Неизвестный символ: ${ch}`);
    }
  }

  return tokens;
}


function toRPN(tokens: (number | string)[]): (number | string)[] {
  const outputQueue: (number | string)[] = [];
  const operatorStack: string[] = [];

  for (const token of tokens) {
    if (typeof token === "number") {
      outputQueue.push(token);
    } else if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      let foundOpeningParen = false;
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(") {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] === "(") {
        operatorStack.pop();
        foundOpeningParen = true;
      }
      if (!foundOpeningParen) {
        throw new Error("Несогласованные скобки: отсутствует открывающая скобка.");
      }
    } else { 
      const op1 = token;
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "(" &&
        (precedence[operatorStack[operatorStack.length - 1]] > precedence[op1] ||
         (precedence[operatorStack[operatorStack.length - 1]] === precedence[op1] && !associativity[op1]))
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(op1);
    }
  }

  while (operatorStack.length > 0) {
    const op = operatorStack.pop()!;
    if (op === "(" || op === ")") {
      throw new Error("Несогласованные скобки: отсутствует закрывающая скобка.");
    }
    outputQueue.push(op);
  }

  return outputQueue;
}


function evalRPN(rpnTokens: (number | string)[]): number {
  const stack: number[] = [];

  for (const token of rpnTokens) {
    if (typeof token === "number") {
      stack.push(token);
    } else { 
      let op2: number | undefined;
      let op1: number | undefined;

      switch (token) {
        case "u-":
          if (stack.length < 1) throw new Error("Недостаточно операндов для унарного минуса.");
          op1 = stack.pop()!;
          stack.push(-op1);
          break;
        case "+":
        case "-":
        case "*":
        case "/":
        case "%":
        case "^":
          if (stack.length < 2) throw new Error(`Недостаточно операндов для операции ${token}.`);
          op2 = stack.pop()!;
          op1 = stack.pop()!;
          let res: number;
          switch (token) {
            case "+": res = op1 + op2; break;
            case "-": res = op1 - op2; break;
            case "*": res = op1 * op2; break;
            case "/":
              if (op2 === 0) throw new Error("Деление на ноль.");
              res = op1 / op2;
              break;
            case "%": res = op1 % op2; break;
            case "^":
              res = Math.pow(op1, op2);
              if (!Number.isFinite(res)) throw new Error("Некорректное вычисление степени.");
              break;
            default:
              throw new Error(`Неподдерживаемая операция: ${token}.`);
          }
          stack.push(res);
          break;
        default:
          throw new Error(`Неизвестный токен в RPN: ${token}.`);
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error("Некорректное выражение: осталось более одного элемента в стеке после вычисления RPN.");
  }

  const finalResult = stack[0];
  if (!Number.isFinite(finalResult)) {
      throw new Error("Результат вычисления не является конечным числом.");
  }
  return finalResult;
}


export function evaluateExpression(expr: string): number {
  const tokens = tokenize(expr);
  if (tokens.length === 0) throw new Error("Пустое выражение");
  const firstToken = tokens[0];
  if (typeof firstToken === 'string' && !["u-", "("].includes(firstToken)) {
      throw new Error("Выражение должно начинаться с числа, унарного минуса или открывающей скобки.");
  }

  const rpn = toRPN(tokens);
  return evalRPN(rpn);
}


export function computeExpressionAsString(expr: string): string {
  try {
    const res = evaluateExpression(expr);
    if (Number.isInteger(res)) return res.toString();

    const s = res.toFixed(12);
    const trimmed = parseFloat(s).toString(); 
    return trimmed;
  } catch (e: any) {
    return "Error";
  }
}
