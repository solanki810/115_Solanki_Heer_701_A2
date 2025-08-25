const btcBtn = document.getElementById('btn-btc');
const btcResult = document.getElementById('btc-result');
const catBtn = document.getElementById('btn-cat');
const catResult = document.getElementById('cat-result');

btcBtn.addEventListener('click', async () => {
  btcResult.textContent = 'Loading…';
  try {
    const res = await fetch('/api/bitcoin');
    if(!res.ok) throw new Error('Network error');
    const data = await res.json();
    btcResult.textContent = `BTC Price: $${data.price} (Updated: ${data.updated})`;
  } catch (e) {
    btcResult.textContent = 'Failed to fetch BTC price.';
  }
});

catBtn.addEventListener('click', async () => {
  catResult.textContent = 'Loading…';
  try {
    const res = await fetch('https://catfact.ninja/fact');
    if(!res.ok) throw new Error('Network error');
    const data = await res.json();
    catResult.textContent = data.fact;
  } catch (e) {
    catResult.textContent = 'Failed to fetch cat fact.';
  }
});
