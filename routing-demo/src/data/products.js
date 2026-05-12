// In-memory product catalog. The "loader" + "action" demos pretend to talk
// to a backend, complete with a small artificial delay so the pending UI
// (useNavigation) is visible without throttling the network.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PRODUCTS = [
  { id: 'p-101', name: 'React 19 hardcover', price: 49, stock: 12, description: 'The book the docs site wishes it was.' },
  { id: 'p-102', name: 'RR v7 sticker pack', price: 5, stock: 240, description: 'Three loaders, three actions, three vibes.' },
  { id: 'p-103', name: 'Compiler T-shirt', price: 25, stock: 0, description: 'Auto-memoizing your wardrobe.' },
  { id: 'p-104', name: 'TanStack mug', price: 18, stock: 31, description: 'Holds queries hot for up to 30 seconds.' },
];

export async function listProducts() {
  await sleep(300);
  return PRODUCTS.map(({ id, name, price, stock }) => ({ id, name, price, stock }));
}

export async function getProduct(id) {
  await sleep(250);
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) {
    const err = new Error('Product not found');
    err.status = 404;
    throw err;
  }
  return { ...product };
}

export async function buyProduct(id, qty = 1) {
  await sleep(400);
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) {
    const err = new Error('Product not found');
    err.status = 404;
    throw err;
  }
  if (product.stock < qty) {
    const err = new Error(`Only ${product.stock} in stock — can't buy ${qty}.`);
    err.status = 400;
    throw err;
  }
  product.stock -= qty;
  return { id, name: product.name, qty, remaining: product.stock };
}
