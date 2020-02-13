function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function conquer(max, items, i, res, best) {
  const n = res.reduce((a, c) => a + items[c], 0);
  if (n > best.n && n < max) {
    best.n = n;
    best.res = res;
  }
  if (n >= max || i == items.length) return;
  conquer(max, items, i + 1, [...res], best);
  conquer(max, items, i + 1, [...res, i], best);
}

function divide(max, items, size) {
  const overall = { n: 0, res: [] };
  let n, smax;
  smax = items.length >= size ? Math.round(max / (items.length / size)) : max;
  for (let i = 0; i < items.length; i += size) {
    if (i + size > items.length) {
      n = i + (items.length % size);
      smax = max - smax * (i / size);
    } else {
      n = i + size;
    }
    const best = { n: 0, res: [] };
    conquer(smax, items.slice(i, n), 0, [], best);
    overall.res.push(...best.res.map(idx => (idx += i)));
    overall.n += best.n;
  }
  return overall;
}

function linear(max, items) {
  const res = [];
  let n = 0;
  for (let i = items.length - 1; i >= 0 && n + items[i] < max; i -= 1) {
    res.push(i);
    n += items[i];
  }
  for (let i = 0; i < items.length && n + items[i] < max; i += 1) {
    res.push(i);
    n += items[i];
  }
  return { n, res };
}

function linearDivideConquer(max, items) {
  const res = [];
  let n = 0,
    i;
  for (i = items.length - 1; i >= 0 && n + items[i] < max; i -= 1) {
    res.push(i);
    n += items[i];
  }
  const best = { n, res };
  conquer(max - n, items.slice(i), 0, [], best);
  return best;
}

const readline = require("readline"),
  fs = require("fs");
const rl = readline.createInterface({
  input: fs.createReadStream(process.argv[2])
});

const items = [];
let i = 0;
let max;
const delim = /\s+/;

rl.on("line", line => {
  const nums = line.split(delim);
  if (i == 0) max = Number(nums[0]);
  else items.push(...nums.map(n => Number(n)));
  i += 1;
});

rl.on("close", () => {
  console.log("Input:");
  console.log(max, items.length);
  //   console.log(items);
  const best1 = linear(max, items);
  const best2 = linearDivideConquer(max, items);
  const best3 = divide(max, shuffle(items), 8);
  console.log("Output:");
  console.log(best1.n, best1.res.length);
  console.log(best2.n, best2.res.length);
  console.log(best3.n, best3.res.length);
  //   console.log(best1.res);
  //   console.log(best2.res);
});
