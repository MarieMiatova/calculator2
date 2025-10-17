// Простой леволинейный (left-to-right) вычислитель, но корректный парсер чисел и операторов.
// При ошибке кидает Error.

function normalizeOp(ch: string): string {
  if (ch === "×") return "*";
  if (ch === "÷") return "/";
  if (ch === "−") return "-";
  return ch;
}

export function evaluateLeftToRight(expr: string): number {
  // Удаляем лишние пробелы, заменяем unicode-операторы
  const s = expr.trim().replace(/\s+/g, " ");
  if (s.length === 0) throw new Error("Пустое выражение");

  // Токенизация: числа (включая десятичную точку и знак) и операторы
  const tokens: (number | string)[] = [];
  let i = 0;

  while (i < s.length) {
    const ch = s[i];
    if (ch === " ") { i++; continue; }

    // число (возможно со знаком, но если знак - идет после числа — это оператор)
    if (/[0-9.]/.test(ch) || (ch === "-" && i + 1 < s.length && /[0-9.]/.test(s[i + 1]) && (tokens.length === 0 || typeof tokens[tokens.length - 1] === "string"))) {
      // читаем число (поддерживаем знак в начале если это унарный минус)
      let j = i;
      if (s[j] === "-") j++;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const raw = s.substring(i, j);
      const val = parseFloat(raw);
      if (isNaN(val)) throw new Error("Некорректное число");
      tokens.push(val);
      i = j;
      continue;
    }

    // оператор один символ (может быть unicode)
    if (["+", "-", "*", "/", "%", "^", "×", "÷", "−"].includes(ch)) {
      tokens.push(normalizeOp(ch));
      i++;
      continue;
    }

    // пробелы уже обработаны — если попали сюда, то неизвестный символ
    throw new Error(`Неизвестный символ: ${ch}`);
  }

  if (tokens.length === 0) throw new Error("Пустое выражение");

  // Ожидаем чередование: number, operator, number, operator...
  if (typeof tokens[0] !== "number") throw new Error("Выражение должно начинаться с числа");

  let acc = Number(tokens[0]);

  for (let idx = 1; idx < tokens.length; idx += 2) {
    const op = tokens[idx] as string;
    const next = tokens[idx + 1];
    if (typeof next !== "number") throw new Error("Некорректная последовательность операторов и чисел");
    const val = Number(next);

    switch (op) {
      case "+":
        acc = acc + val;
        break;
      case "-":
        acc = acc - val;
        break;
      case "*":
        acc = acc * val;
        break;
      case "/":
        if (val === 0) throw new Error("Деление на ноль");
        acc = acc / val;
        break;
      case "%":
        acc = acc % val;
        break;
      case "^":
        acc = Math.pow(acc, val);
        break;
      default:
        throw new Error(`Неподдерживаемая операция: ${op}`);
    }
  }

  if (!isFinite(acc)) throw new Error("Некорректное вычисление");
  return acc;
}

export function computeExpressionAsString(expr: string): string {
  try {
    const res = evaluateLeftToRight(expr);
    // Убираем лишнюю дробную часть, если целое
    if (Number.isInteger(res)) return res.toString();
    // Ограничим до 12 знаков после запятой для краткости
    return parseFloat(res.toFixed(12)).toString();
  } catch (e) {
    return "Error";
  }
}
