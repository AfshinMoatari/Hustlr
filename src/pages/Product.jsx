import React, { useEffect, useState, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import ProductCard from "../components/ProductCard";

import { Footer, Navbar } from "../components";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  const buildImages = useCallback((p) => {
    if (!p || !p.image) return [];
    const base = p.image;
    return [base, base + "?v=2", base + "?v=3"]; // simple gallery
  }, []);

  const buildVariants = useCallback((p) => {
    const base = Number(p?.price) || 0;
    const cat = (p?.category || "").toLowerCase();
    if (cat.includes("clothing")) {
      return [
        { label: "S", price: base, available: true },
        { label: "M", price: base, available: (Number(p?.id) % 3) !== 0 },
        { label: "L", price: base, available: true },
        { label: "XL", price: base, available: (Number(p?.id) % 5) !== 0 },
      ];
    }
    if (cat.includes("electronic")) {
      return [
        { label: "64 GB", price: base, available: true },
        { label: "128 GB", price: base + 20, available: (Number(p?.id) % 4) !== 0 },
        { label: "256 GB", price: base + 40, available: true },
      ];
    }
    if (cat.includes("jewel")) {
      return [
        { label: "Silver", price: base, available: true },
        { label: "Gold", price: base + 30, available: (Number(p?.id) % 2) !== 0 },
      ];
    }
    return [{ label: "Default", price: base, available: (Number(p?.id) % 2) !== 0 }];
  }, []);

  const isOutOfStockProduct = useCallback((p) => {
    return Number(p?.id) % 7 === 0; // demo rule like list page
  }, []);

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setImages(buildImages(data));
      const v = buildVariants(data);
      setVariants(v);
      const firstAvailable = v.find((x) => x.available !== false) || v[0] || null;
      setSelectedVariant(firstAvailable);
      setLoading(false);
      const response2 = await fetch(
        `https://fakestoreapi.com/products/category/${data.category}`
      );
      const data2 = await response2.json();
      setSimilarProducts(data2);
      setLoading2(false);
    };
    getProduct();
  }, [id, buildImages, buildVariants]);

  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const displayPrice = selectedVariant?.price ?? product.price;
  const variantAvailable = selectedVariant ? selectedVariant.available !== false : true;
  const productInStock = !isOutOfStockProduct(product);
  const canAdd = productInStock && variantAvailable;
  const showOutOfStockOverlay = !productInStock || !variantAvailable;

  const ShowProduct = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 col-sm-12 py-3">
              <div className={`position-relative bg-light rounded-3 p-2 ${showOutOfStockOverlay ? "opacity-75" : ""}`}>
                {showOutOfStockOverlay && (
                  <span className="badge bg-danger position-absolute" style={{ top: 8, left: 8 }}>Out of stock</span>
                )}
                <div className="position-relative" style={{ paddingTop: "100%" }}>
                  <img
                    key={images[imageIndex]}
                    src={images[imageIndex]}
                    alt={product.title}
                    className="position-absolute w-100 h-100"
                    style={{ objectFit: "contain", inset: 0, padding: 8 }}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm btn-light border position-absolute"
                        style={{ top: "50%", left: 8, transform: "translateY(-50%)" }}
                        onClick={() => setImageIndex((i) => Math.max(0, i - 1))}
                        disabled={imageIndex === 0}
                        aria-label="Previous image"
                      >
                        <i className="fa fa-chevron-left" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-light border position-absolute"
                        style={{ top: "50%", right: 8, transform: "translateY(-50%)" }}
                        onClick={() => setImageIndex((i) => Math.min(images.length - 1, i + 1))}
                        disabled={imageIndex === images.length - 1}
                        aria-label="Next image"
                      >
                        <i className="fa fa-chevron-right" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {images.length > 0 && (
                <div className="d-flex gap-2 mt-3 flex-wrap">
                  {images.map((src, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`p-1 rounded ${idx === imageIndex ? "border border-2 border-dark" : "border"}`}
                      onClick={() => setImageIndex(idx)}
                      aria-label={`Select image ${idx + 1}`}
                      style={{ background: "#fff" }}
                    >
                      <img src={src} alt="thumb" width={64} height={64} style={{ objectFit: "contain" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="col-md-6 col-md-6 py-5">
              <h4 className="text-uppercase text-muted">{product.category}</h4>
              <h1 className="display-5">{product.title}</h1>
              <p className="lead">
                {product.rating && product.rating.rate}{" "}
                <i className="fa fa-star"></i>
              </p>
              <h3 className="display-6 my-4">${displayPrice}</h3>
              <p className="lead">{product.description}</p>
              <div className="d-flex align-items-center gap-2 mb-3">
                {variants?.length > 0 && (
                  <select
                    className="form-select form-select-sm w-auto"
                    aria-label="Select a variant"
                    value={selectedVariant?.label ?? ""}
                    onChange={(e) => {
                      const next = variants.find((v) => v.label === e.target.value) || null;
                      setSelectedVariant(next);
                    }}
                  >
                    {variants.map((v) => (
                      <option key={v.label} value={v.label}>
                        {v.label}{v.available === false ? " (Out of stock)" : ""}
                      </option>
                    ))}
                  </select>
                )}
                {!variantAvailable && (
                  <small className="text-muted">Selected variant is out of stock</small>
                )}
              </div>
              <button
                className="btn btn-dark"
                onClick={() => addProduct({ ...product, price: displayPrice, variant: selectedVariant?.label ?? null })}
                disabled={!canAdd}
              >
                {canAdd ? "Add to Cart" : "Out of Stock"}
              </button>
              <Link to="/cart" className="btn btn-outline-dark mx-3">
                Go to Cart
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <>
        <div className="py-4 my-4">
          <div className="d-flex">
            {similarProducts.map((item, idx) => {
              const simImages = buildImages(item);
              const simVariants = buildVariants(item);
              const simInStock = !isOutOfStockProduct(item);
              return (
                <div key={item.id} className="mx-3" style={{ display: "inline-block", width: 260 }}>
                  <ProductCard
                    id={item.id}
                    name={item.title.substring(0, 40)}
                    price={item.price}
                    imageUrl={item.image}
                    images={simImages}
                    variants={simVariants}
                    inStock={simInStock}
                    onAdd={(payload) => {
                      addProduct({ ...item, price: payload?.price ?? item.price, image: payload?.image ?? item.image, variant: payload?.variant ?? null });
                    }}
                    detailsTo={"/product/" + item.id}
                    detailsLabel="Buy Now"
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
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
          <h2 className="">You may also Like</h2>
            <Marquee
              pauseOnHover={true}
              pauseOnClick={true}
              speed={50}
            >
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
