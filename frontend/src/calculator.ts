export function evaluateLeftToRight(expr: string): number {
  const s = expr.replace(/\s+/g, '');
  if (s.length === 0) throw new Error('Пустое выражение');
  const tokens: (number | string)[] = [];
  let i = 0;

  const readNumber = (): number => {
    let j = i;
    if (s[j] === '-') j++;
    while (j < s.length && /[0-9.]/.test(s[j])) j++;
    const raw = s.substring(i, j);
    const val = parseFloat(raw);
    if (isNaN(val)) throw new Error('Некорректное число');
    i = j;
    return val;
  };

  const first = readNumber();
  tokens.push(first);
  while (i < s.length) {
    const op = s[i];
    if (!['+', '-', '*', '/', '%', '^'].includes(op)) {
      if (op === '×') { tokens.push('*'); i++; continue; }
      if (op === '÷') { tokens.push('/'); i++; continue; }
      if (op === '−') { tokens.push('-'); i++; continue; }
      throw new Error(`Неизвестная операция: ${op}`);
    }
    tokens.push(op);
    i++;
    const num = readNumber();
    tokens.push(num);
  }

  let acc = Number(tokens[0]);
  for (let idx = 1; idx < tokens.length; idx += 2) {
    const op = tokens[idx] as string;
    const val = Number(tokens[idx + 1]);
    switch (op) {
      case '+': acc = acc + val; break;
      case '-': acc = acc - val; break;
      case '*': acc = acc * val; break;
      case '/':
        if (val === 0) throw new Error('Деление на ноль');
        acc = acc / val; break;
      case '%':
        acc = acc % val; break;
      case '^':
        acc = Math.pow(acc, val); break;
      default:
        throw new Error(`Неподдерживаемая операция: ${op}`);
    }
  }
  if (!isFinite(acc)) throw new Error('Некорректное вычисление');
  return acc;
}
export function computeExpressionAsString(expr: string): string {
  try {
    const res = evaluateLeftToRight(expr);
    return res.toString();
  } catch {
    return 'Error';
  }
}