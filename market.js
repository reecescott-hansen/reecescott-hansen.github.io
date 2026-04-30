// Live market bar — Finnhub API
(function () {
  const KEY = 'd7paulpr01qlb0a9cjhgd7paulpr01qlb0a9cji0';

  const indices = [
    { symbol: 'SPY',  name: 'S&P 500',   labelId: 'mb-sp500',  priceId: 'mb-sp500-price',  changeId: 'mb-sp500-change'  },
    { symbol: 'QQQ',  name: 'Nasdaq',    labelId: 'mb-nasdaq', priceId: 'mb-nasdaq-price',  changeId: 'mb-nasdaq-change' },
    { symbol: 'DIA',  name: 'Dow Jones', labelId: 'mb-dow',    priceId: 'mb-dow-price',     changeId: 'mb-dow-change'    },
  ];

  async function fetchQuote(symbol) {
    const res  = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${KEY}`);
    const data = await res.json();
    return { price: data.c, change: data.dp };
  }

  function fmt(n) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  async function updateBar() {
    // Update label to show loading
    const label = document.querySelector('.market-label');
    if (label) label.textContent = 'Loading live data...';

    try {
      const results = await Promise.all(indices.map(i => fetchQuote(i.symbol)));

      indices.forEach((idx, i) => {
        const { price, change } = results[i];
        if (!price) return;

        const priceEl  = document.getElementById(idx.priceId);
        const changeEl = document.getElementById(idx.changeId);
        if (!priceEl || !changeEl) return;

        const up = change >= 0;
        priceEl.textContent  = fmt(price);
        changeEl.textContent = (up ? '▲ ' : '▼ ') + Math.abs(change).toFixed(2) + '%';
        changeEl.className   = up ? 'up' : 'down';
      });

      if (label) {
        const now = new Date();
        label.textContent = 'Live Market Data · ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        label.style.color = '#16a34a';
      }
    } catch (e) {
      if (label) label.textContent = 'Market Snapshot (Not Live Data)';
    }
  }

  window.addEventListener('load', updateBar);
})();
