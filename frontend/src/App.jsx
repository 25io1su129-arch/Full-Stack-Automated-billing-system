import { useState,useEffect } from 'react';



function App() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('http://localhost:5000/api/products')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    })
    .then((data) => {
      setProducts(data);
    })
    .catch((error) => {
      console.error('Products API error:', error);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

  function addToCart(product) {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);

      if (found) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...current, { ...product, qty: 1 }];
    });
  }

  function changeQty(id, amount) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, qty: item.qty + amount }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>🛒 Smart Billing Cart</h1>
          <p>Smart shopping, easy billing.</p>
        </div>
        <div className="cart-count">Cart: {totalItems} items</div>
      </header>

      <main className="layout">
        <section className="products-section">
          <h2>Available Products</h2>

          <input
            className="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
         {loading && <p>Loading products...</p>}
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-emoji">{product.emoji}</div>
                <h3>{product.name}</h3>
                <p>{product.category}</p>
                <strong>₹{product.price.toFixed(2)}</strong>
                <button onClick={() => addToCart(product)}>
                  + Add to Cart
                </button>
              </article>
            ))}
          </div>
        </section>

        <aside className="bill-section">
          <h2>🧾 Your Bill</h2>

          {cart.length === 0 ? (
            <p className="empty">Your cart is empty. Add some products!</p>
          ) : (
            cart.map((item) => (
              <div className="bill-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p>₹{item.price} × {item.qty}</p>
                </div>

                <div className="quantity">
                  <button onClick={() => changeQty(item.id, -1)}>
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)}>
                    +
                  </button>
                </div>

                <strong>₹{(item.price * item.qty).toFixed(2)}</strong>
              </div>
            ))
          )}

          <div className="total">
            <span>Total Amount</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>

          <button
            className="clear-button"
            onClick={() => setCart([])}
          >
            Clear Cart
          </button>
        </aside>
      </main>
    </div>
  );
}

export default App;