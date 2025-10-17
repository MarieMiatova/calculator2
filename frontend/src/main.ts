import { computeExpressionAsString } from './calculator';
import { fetchHistory, postHistory } from './api';
import { API_BASE_URL } from './config';
import type { HistoryEntry } from './types';

document.addEventListener('DOMContentLoaded', async () => {
  const display = document.getElementById('display') as HTMLElement;
  const historyList = document.getElementById('history-list') as HTMLElement;
  const buttonsArea = document.querySelector('.buttons') as HTMLElement;

  // загрузить историю
  const history = await fetchHistory();
  history.forEach(h => {
    const li = document.createElement('li');
    li.textContent = `${h.expression} = ${h.result}`;
    historyList.prepend(li);
  });

  let currentExpression = '';

  buttonsArea.addEventListener('click', async (e) => {
    const btn = e.target as HTMLElement;
    if (!btn || btn.tagName !== 'BUTTON') return;
    const key = btn.textContent?.trim() ?? '';

    if (!isNaN(Number(key)) || key === '.') {
      currentExpression += key;
      display.textContent = currentExpression || '0';
      return;
    }

    if (['+', '−', '×', '÷', '^'].includes(key)) {
      currentExpression += ' ' + key + ' ';
      display.textContent = currentExpression;
      return;
    }

    if (key === '=') {
      if (!currentExpression) return;
      const result = computeExpressionAsString(currentExpression);
      display.textContent = result;
      const entry: HistoryEntry = { expression: currentExpression, result };
      await postHistory(entry);
      const li = document.createElement('li');
      li.textContent = `${currentExpression} = ${result}`;
      historyList.prepend(li);
      currentExpression = result === 'Error' ? '' : result;
      return;
    }

    if (key === 'C' || key === 'C/CE') {
      currentExpression = '';
      display.textContent = '0';
      return;
    }

    if (key === 'OFF') {
      display.textContent = '';
      return;
    }

    if (key === '√') {
      const v = parseFloat(display.textContent || '0');
      const r = Number.isFinite(v) ? Math.sqrt(v) : NaN;
      const result = Number.isFinite(r) ? r.toString() : 'Error';
      currentExpression = result;
      display.textContent = result;
      await postHistory({ expression: `√(${v})`, result });
      const li = document.createElement('li');
      li.textContent = `√(${v}) = ${result}`;
      historyList.prepend(li);
      return;
    }

    if (key === '%') {
      const v = parseFloat(display.textContent || '0');
      const r = v / 100;
      const result = isFinite(r) ? r.toString() : 'Error';
      currentExpression = result;
      display.textContent = result;
      await postHistory({ expression: `${v}%`, result });
      const li = document.createElement('li');
      li.textContent = `${v}% = ${result}`;
      historyList.prepend(li);
      return;
    }

    if (key.startsWith('M')) {
      return;
    }
  });
});