import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import toast from "react-hot-toast";
import ProductCard from "./ProductCard";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState("relevance");
  const [selectedCategories, setSelectedCategories] = useState([]); // multi-select

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  const applySort = useCallback((list, key) => {
    const cloned = [...list];
    switch (key) {
      case "price-asc":
        return cloned.sort((a, b) => Number(a.price) - Number(b.price));
      case "price-desc":
        return cloned.sort((a, b) => Number(b.price) - Number(a.price));
      case "newest":
        return cloned.sort((a, b) => Number(b.id) - Number(a.id));
      case "oldest":
        return cloned.sort((a, b) => Number(a.id) - Number(b.id));
      case "name-asc":
        return cloned.sort((a, b) => String(a.title).localeCompare(String(b.title)));
      case "name-desc":
        return cloned.sort((a, b) => String(b.title).localeCompare(String(a.title)));
      default:
        return cloned; // relevance (no-op)
    }
  }, []);

  // Fetch once
  useEffect(() => {
    let ignore = false;
    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://fakestoreapi.com/products/");
        const full = await response.json();
        if (!ignore) {
          setData(full);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    getProducts();
    return () => {
      ignore = true;
    };
  }, []);

  // Derive filtered + sorted list whenever inputs change
  useEffect(() => {
    const filtered = selectedCategories.length
      ? data.filter((item) => selectedCategories.includes(item.category))
      : data;
    setFilter(applySort(filtered, sortKey));
  }, [data, selectedCategories, sortKey, applySort]);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-12 col-sm-6 col-md-4 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-12 col-sm-6 col-md-4 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-12 col-sm-6 col-md-4 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) => {
      const exists = prev.includes(cat);
      if (exists) return prev.filter((c) => c !== cat);
      return [...prev, cat];
    });
  };

  const buildVariants = (product, idx) => {
    const base = Number(product.price) || 0;
    const cat = (product.category || "").toLowerCase();
    if (cat.includes("clothing")) {
      return [
        { label: "S", price: base, available: true },
        { label: "M", price: base, available: idx % 3 !== 0 },
        { label: "L", price: base, available: true },
        { label: "XL", price: base, available: idx % 5 !== 0 },
      ];
    }
    if (cat.includes("electronic")) {
      return [
        { label: "64 GB", price: base, available: true },
        { label: "128 GB", price: base + 20, available: idx % 4 !== 0 },
        { label: "256 GB", price: base + 40, available: true },
      ];
    }
    if (cat.includes("jewel")) {
      return [
        { label: "Silver", price: base, available: true },
        { label: "Gold", price: base + 30, available: idx % 2 !== 0 },
      ];
    }
    // default single variant to still show a selector
    return [{ label: "Default", price: base, available: idx % 2 !== 0 }];
  };

  const isOutOfStock = (product, index) => {
    // Mark every 7th product (including the first) as out of stock for demo
    return index % 7 === 0;
  };

  const buildImages = (product) => {
    const base = product.image;
    // Fake Store images are single; generate slight variations to demo carousel
    return [base, base + "?v=2", base + "?v=3"]; // cache-busting query to force reload
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between py-4">
            <div className="buttons text-center text-md-start mb-3 mb-md-0">
              <button
                className={`btn btn-sm m-2 ${selectedCategories.length === 0 ? "btn-dark" : "btn-outline-dark"}`}
                onClick={() => setSelectedCategories([])}
              >
                All
              </button>
              <button
                className={`btn btn-sm m-2 ${selectedCategories.includes("men's clothing") ? "btn-dark" : "btn-outline-dark"}`}
                onClick={() => toggleCategory("men's clothing")}
              >
                Men's Clothing
              </button>
              <button
                className={`btn btn-sm m-2 ${selectedCategories.includes("women's clothing") ? "btn-dark" : "btn-outline-dark"}`}
                onClick={() => toggleCategory("women's clothing")}
              >
                Women's Clothing
              </button>
              <button
                className={`btn btn-sm m-2 ${selectedCategories.includes("jewelery") ? "btn-dark" : "btn-outline-dark"}`}
                onClick={() => toggleCategory("jewelery")}
              >
                Jewelery
              </button>
              <button
                className={`btn btn-sm m-2 ${selectedCategories.includes("electronics") ? "btn-dark" : "btn-outline-dark"}`}
                onClick={() => toggleCategory("electronics")}
              >
                Electronics
              </button>
            </div>
            <div className="d-flex align-items-center gap-2 justify-content-md-end">
              <label htmlFor="sort-select" className="form-label mb-0 me-2">Sort by</label>
              <select
                id="sort-select"
                className="form-select form-select-sm w-auto"
                value={sortKey}
                onChange={(e) => {
                  const nextKey = e.target.value;
                  setSortKey(nextKey);
                }}
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="row g-4">
            {filter.map((product, idx) => {
              const variants = buildVariants(product, idx);
              const inStock = !isOutOfStock(product, idx);
              const images = buildImages(product);
              return (
                <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <ProductCard
                    id={product.id}
                    name={product.title.substring(0, 40)}
                    price={product.price}
                    imageUrl={product.image}
                    images={images}
                    variants={variants}
                    inStock={inStock}
                    onAdd={(payload) => {
                      toast.success("Added to cart");
                      addProduct({
                        ...product,
                        price: payload?.price ?? product.price,
                        image: payload?.image ?? product.image,
                        variant: payload?.variant ?? null,
                      });
                    }}
                    detailsTo={"/product/" + product.id}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
