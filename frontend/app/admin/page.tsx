"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductImage from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, apiRequest, clearAuthSession, fetchProducts, getAuthToken, hasValidAdminSession } from "@/lib/api";
import { getAllCategories } from "@/lib/data";
import { findMainCategory, getSizesForCategory, joinCategory, splitCategory } from "@/lib/catalog";
import { Product } from "@/lib/types";

interface ProductForm {
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
}

const emptyForm: ProductForm = { name: "", description: "", category: "", price: "", stock: "" };
const NEW_CATEGORY_OPTION = "__new_category__";

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [subcategory, setSubcategory] = useState("");

  // Categories products already use that are not in the catalog (e.g. older ones)
  const otherCategories = Array.from(new Set(products.map((product) => splitCategory(product.category).main)))
    .filter((name) => name && !findMainCategory(name))
    .sort((a, b) => a.localeCompare(b));
  const subcategoryOptions = isCreatingCategory ? [] : findMainCategory(form.category)?.subcategories ?? [];
  const selectedSizes = subcategory ? getSizesForCategory(joinCategory(form.category, subcategory)) : [];

  async function loadProducts() {
    setProducts(await fetchProducts());
  }

  useEffect(() => {
    // Not signed in as an admin (or the login expired): go to the login page
    if (!hasValidAdminSession()) {
      if (getAuthToken()) clearAuthSession();
      router.replace("/login");
      return;
    }

    setIsAdmin(true);
    loadProducts()
      .catch((loadError: Error) => setError(loadError.message))
      .finally(() => setIsCheckingAccess(false));
  }, [router]);

  async function handleCreateProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const category = isCreatingCategory ? newCategory.trim() : joinCategory(form.category, subcategory || undefined);
    if (!image) {
      setError("Choose an image file for this product.");
      return;
    }
    if (!category) {
      setError("Select a category or enter a new one.");
      return;
    }

    const body = new FormData();
    body.append("name", form.name);
    body.append("description", form.description);
    body.append("category", category);
    body.append("price", form.price);
    body.append("stock", form.stock);
    body.append("image", image);

    setError(null);
    setNotice(null);
    setIsSubmitting(true);
    try {
      await apiRequest<{ message: string; product: unknown }>(
        "/api/products",
        { method: "POST", body },
        true
      );
      setForm(emptyForm);
      setSubcategory("");
      setNewCategory("");
      setIsCreatingCategory(false);
      setImage(null);
      formElement.reset();
      await loadProducts();
      setNotice("Product created successfully.");
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        clearAuthSession();
        router.replace("/login");
        return;
      }
      setError(requestError instanceof Error ? requestError.message : "Could not create product.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteProduct(product: Product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product.id);
    setError(null);
    setNotice(null);
    try {
      await apiRequest<{ message: string }>(
        `/api/products/${encodeURIComponent(product.id)}`,
        { method: "DELETE" },
        true
      );
      await loadProducts();
      setNotice("Product deleted.");
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        clearAuthSession();
        router.replace("/login");
        return;
      }
      setError(requestError instanceof Error ? requestError.message : "Could not delete product.");
    } finally {
      setDeletingId(null);
    }
  }

  if (isCheckingAccess) {
    return <main className="min-h-screen bg-white p-8 text-center text-[#281E18]">Checking administrator access...</main>;
  }

  if (!isAdmin) {
    return <main className="min-h-screen bg-white p-8 text-center text-[#281E18]">Redirecting to login...</main>;
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-[#281E18] md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">NardiShop</p>
            <h1 className="text-3xl font-bold">Admin dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline"><Link href="/">View store</Link></Button>
            <Button
              variant="outline"
              onClick={() => {
                clearAuthSession();
                router.replace("/login");
              }}
            >
              Log out
            </Button>
          </div>
        </header>

        <section className="mb-10 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold">Add a product</h2>
          <form onSubmit={handleCreateProduct} className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              Product name
              <Input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label className="space-y-2 text-sm">
              Category
              <select
                required
                value={isCreatingCategory ? NEW_CATEGORY_OPTION : form.category}
                onChange={(event) => {
                  const value = event.target.value;
                  setIsCreatingCategory(value === NEW_CATEGORY_OPTION);
                  setForm({ ...form, category: value === NEW_CATEGORY_OPTION ? "" : value });
                  setSubcategory("");
                }}
                className="h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-base text-[#281E18] outline-none focus:border-[#D4AF37]"
              >
                <option value="" disabled>Select a category</option>
                {getAllCategories().map((category) => (
                  <option key={category.name} value={category.name}>{category.name}</option>
                ))}
                {otherCategories.length > 0 && (
                  <optgroup label="Other categories in use">
                    {otherCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </optgroup>
                )}
                <option value={NEW_CATEGORY_OPTION}>Add a new category...</option>
              </select>
            </label>
            {subcategoryOptions.length > 0 && (
              <label className="space-y-2 text-sm">
                Subcategory
                <select
                  required
                  value={subcategory}
                  onChange={(event) => setSubcategory(event.target.value)}
                  className="h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-base text-[#281E18] outline-none focus:border-[#D4AF37]"
                >
                  <option value="" disabled>Select a subcategory</option>
                  {subcategoryOptions.map((sub) => (
                    <option key={sub.name} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
                {selectedSizes.length > 0 && (
                  <span className="block text-xs text-zinc-600">
                    Shoppers will choose a size: {selectedSizes.join(", ")}
                  </span>
                )}
              </label>
            )}
            {isCreatingCategory && (
              <label className="space-y-2 text-sm">
                New category name
                <Input
                  required
                  maxLength={80}
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  placeholder="Enter a category name"
                />
              </label>
            )}
            <label className="space-y-2 text-sm">
              Price
              <Input required type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
            </label>
            <label className="space-y-2 text-sm">
              Stock
              <Input required type="number" min="0" step="1" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
            </label>
            <label className="space-y-2 text-sm">
              Product image
              <Input
                required
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="text-[#281E18] file:text-[#281E18]"
                onChange={(event) => setImage(event.target.files?.[0] ?? null)}
              />
              <span className="block text-xs text-zinc-600">JPEG, PNG, or WebP; maximum size 5 MB.</span>
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
              Description
              <textarea
                required
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="min-h-24 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-[#281E18] outline-none focus:border-[#D4AF37]"
              />
            </label>
            {error && <p role="alert" className="text-sm text-red-400 md:col-span-2">{error}</p>}
            {notice && <p role="status" className="text-sm text-green-400 md:col-span-2">{notice}</p>}
            <div className="md:col-span-2">
              <Button disabled={isSubmitting} style={{ backgroundColor: "#D4AF37", color: "#212121" }}>
                {isSubmitting ? "Adding product..." : "Add product"}
              </Button>
            </div>
          </form>
        </section>

        <section>
          <h2 className="mb-5 text-xl font-semibold">Products ({products.length})</h2>
          {products.length === 0 ? (
            <p className="rounded-xl border border-zinc-200 p-6 text-zinc-600">No products found.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <article key={product.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                  <div className="relative aspect-square">
                    <ProductImage src={product.image} alt={product.name} className="object-contain" />
                  </div>
                  <div className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{product.name}</h3>
                      <p className="text-sm text-zinc-600">{product.category}</p>
                      <p className="text-sm text-zinc-600">{product.price.toFixed(2)} ETB</p>
                    </div>
                    <Button
                      variant="outline"
                      disabled={deletingId === product.id}
                      onClick={() => void handleDeleteProduct(product)}
                    >
                      {deletingId === product.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
