"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  Layers, 
  CheckCircle, 
  X,
  Package
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  created_at: string;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
}

function getApiUrl(path: string): string {
  const host = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";
  return `${host}${path}`;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All"); // All, InStock, LowStock, OutOfStock
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/products"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setSku("");
    setPrice("");
    setQuantity("");
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setPrice(p.price.toString());
    setQuantity(p.quantity.toString());
    setError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const url = editingProduct 
        ? getApiUrl(`/api/products/${editingProduct.id}`) 
        : getApiUrl("/api/products");
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({
          name,
          sku,
          price: parseFloat(price),
          quantity: parseInt(quantity)
        }),
        credentials: "include"
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const errData = await res.json();
        setError(errData.message || "Failed to save product.");
      }
    } catch (err) {
      setError("An unexpected connection error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/products/${id}`), {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        credentials: "include"
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (stockFilter === "InStock") return p.quantity >= 10;
    if (stockFilter === "LowStock") return p.quantity > 0 && p.quantity < 10;
    if (stockFilter === "OutOfStock") return p.quantity === 0;
    return true;
  });

  // KPI stats
  const totalSku = products.length;
  const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity < 10).length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Products & Stock Catalogue</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Manage your SKU database, monitor unit levels, and handle automated inventory updates.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-brand-500 flex items-center justify-center border border-pink-100">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total SKUs Registered</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{totalSku} Items</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Low Stock Alerts</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{lowStockCount} SKUs</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Out of Stock</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{outOfStockCount} SKUs</h3>
          </div>
        </div>
      </div>

      {/* Table filters */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex gap-2">
            {["All", "InStock", "LowStock", "OutOfStock"].map((tab) => {
              const label = tab === "InStock" ? "In Stock" : tab === "LowStock" ? "Low Stock" : tab === "OutOfStock" ? "Out of Stock" : "All Products";
              return (
                <button
                  key={tab}
                  onClick={() => setStockFilter(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    stockFilter === tab 
                      ? "bg-brand-500 text-white shadow-sm" 
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product or SKU..."
              className="bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500 w-64"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-12 text-center text-gray-400 font-bold text-sm">
              Loading SKU inventory catalogue...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-gray-400 font-bold text-sm">
              No products match search criteria.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  <th className="py-4 px-6 rounded-l-xl">SKU / Product Info</th>
                  <th className="py-4 px-6">Listing Price</th>
                  <th className="py-4 px-6">Stock Status</th>
                  <th className="py-4 px-6">Stock Level</th>
                  <th className="py-4 px-6 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-800">
                {filteredProducts.map((p) => {
                  let statusLabel = "In Stock";
                  let statusColor = "bg-green-50 text-green-700 border border-green-100";
                  if (p.quantity === 0) {
                    statusLabel = "Out of Stock";
                    statusColor = "bg-red-50 text-red-700 border border-red-100";
                  } else if (p.quantity < 10) {
                    statusLabel = "Low Stock";
                    statusColor = "bg-amber-50 text-amber-700 border border-amber-100 animate-pulse";
                  }

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-extrabold text-gray-900">{p.name}</p>
                        <span className="text-[10px] text-brand-500 font-extrabold block mt-0.5">{p.sku}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-900 font-black">{p.price.toLocaleString()} MAD</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-black text-gray-900">{p.quantity} Units</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(p)}
                            className="p-2 hover:bg-gray-50 rounded-xl text-gray-500 hover:text-gray-900 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-2 hover:bg-gray-50 rounded-xl text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] border border-gray-100 shadow-2xl p-8 max-w-md w-full relative space-y-6">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">
                {editingProduct ? "Modify Product Details" : "Register Product"}
              </h3>
              <p className="text-xs font-semibold text-gray-500">
                {editingProduct ? "Update information for this SKU inventory block." : "Add a new SKU package to the store catalog."}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F3F4F6]/50 px-4 py-3 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium"
                  placeholder="e.g. Eco Leather Wallet Premium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  SKU Identifier (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-[#F3F4F6]/50 px-4 py-3 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium"
                  placeholder="e.g. ECO-WLT-BLK"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Unit Price (MAD)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#F3F4F6]/50 px-4 py-3 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium"
                    placeholder="e.g. 199.00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-[#F3F4F6]/50 px-4 py-3 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium"
                    placeholder="e.g. 150"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl py-3 text-sm font-bold shadow-md shadow-brand-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : editingProduct ? "Save Changes" : "Register Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
