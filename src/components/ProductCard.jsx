import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  images = [],
  variants = [],
  inStock = true,
  onAdd,
  detailsTo,
  detailsLabel = "View Details",
}) {
  const imageRef = React.useRef(null);

  const gallery = images && images.length > 0 ? images : [imageUrl];
  const [imageIndex, setImageIndex] = React.useState(0);
  const currentImage = gallery[Math.max(0, Math.min(imageIndex, gallery.length - 1))];

  const firstAvailable = React.useMemo(() => {
    if (!variants || variants.length === 0) return null;
    const found = variants.find((v) => v.available !== false);
    return found || variants[0];
  }, [variants]);

  const [selectedVariant, setSelectedVariant] = React.useState(firstAvailable);
  React.useEffect(() => {
    setSelectedVariant(firstAvailable);
  }, [firstAvailable]);

  const displayPrice = selectedVariant?.price ?? price;
  const variantAvailable = selectedVariant ? selectedVariant.available !== false : true;
  const canAdd = inStock && variantAvailable;

  const hoverTimerRef = React.useRef(null);
  const startHoverCycle = React.useCallback(() => {
    if (gallery.length < 2 || hoverTimerRef.current) return;
    hoverTimerRef.current = setInterval(() => {
      setImageIndex((i) => (i + 1) % gallery.length);
    }, 900);
  }, [gallery.length]);
  const stopHoverCycle = React.useCallback(() => {
    if (hoverTimerRef.current) {
      clearInterval(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);
  React.useEffect(() => {
    return () => stopHoverCycle();
  }, [stopHoverCycle]);

  const runFlyToCart = () => {
    const imgEl = imageRef.current;
    const cartBtn = document.getElementById("cart-button");
    if (!imgEl || !cartBtn) return;

    const imgRect = imgEl.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();

    const clone = document.createElement("div");
    clone.className = "fly-clone";
    clone.style.left = `${imgRect.left + imgRect.width / 2 - 28}px`;
    clone.style.top = `${imgRect.top + imgRect.height / 2 - 28}px`;
    clone.innerHTML = `<img src="${currentImage}" alt="" />`;
    document.body.appendChild(clone);

    const dx = cartRect.left + cartRect.width / 2 - (imgRect.left + imgRect.width / 2);
    const dy = cartRect.top + cartRect.height / 2 - (imgRect.top + imgRect.height / 2);

    clone.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.3)`, opacity: 0.2 }
    ], {
      duration: 1000,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
    }).onfinish = () => {
      clone.remove();
    };
  };

  const handleAdd = () => {
    const payload = {
      id,
      title: name,
      price: displayPrice,
      image: currentImage,
      variant: selectedVariant?.label ?? null,
    };
    onAdd && onAdd(payload);
    // Run a visual cue
    runFlyToCart();
  };

  const rootClassName = `card product-card text-center h-100${!inStock ? " out-of-stock" : ""}`;

  return (
    <div className={rootClassName}>
      <div
        className="image-wrapper"
        onMouseEnter={startHoverCycle}
        onMouseLeave={stopHoverCycle}
      >
        {!inStock && (
          <span className="badge bg-danger badge-out">Out of stock</span>
        )}
        <img key={currentImage} className="image-fade" ref={imageRef} src={currentImage} alt={name} />
        {gallery.length > 1 && (
          <div className="image-nav">
            <button
              type="button"
              className="image-nav-btn"
              aria-label="Previous image"
              onClick={() => setImageIndex((i) => Math.max(0, i - 1))}
              disabled={imageIndex === 0}
            >
              <i className="fa fa-chevron-left" />
            </button>
            <button
              type="button"
              className="image-nav-btn"
              aria-label="Next image"
              onClick={() => setImageIndex((i) => Math.min(gallery.length - 1, i + 1))}
              disabled={imageIndex === gallery.length - 1}
            >
              <i className="fa fa-chevron-right" />
            </button>
          </div>
        )}
      </div>
      {gallery.length > 1 && (
        <div className="image-dots" role="tablist" aria-label="Image selector">
          {gallery.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`image-dot ${i === imageIndex ? "active" : ""}`}
              role="tab"
              aria-label={`Go to image ${i + 1}`}
              aria-selected={i === imageIndex}
              onClick={() => setImageIndex(i)}
            />
          ))}
        </div>
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="product-title" title={name}>{name}</h5>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className={`lead mb-0 ${variantAvailable ? "" : "text-muted"}`}>
            $ {Number(displayPrice).toFixed(2)}
          </span>
          {variants?.length > 0 && (
            <select
              className="form-select form-select-sm w-auto variant-select"
              aria-label="Select a variant"
              value={selectedVariant?.label ?? ""}
              onChange={(e) => {
                const next = variants.find((v) => v.label === e.target.value);
                setSelectedVariant(next || null);
              }}
            >
              {variants.map((v) => (
                <option key={v.label} value={v.label} disabled={v.available === false}>
                  {v.label}{v.available === false ? " (Out of stock)" : ""}
                </option>
              ))}
            </select>
          )}
        </div>
        {!variantAvailable && (
          <small className="text-muted mb-2">Selected variant is out of stock</small>
        )}
        <div className="mt-auto d-grid gap-2">
          <button
            className="btn btn-dark w-100"
            disabled={!canAdd}
            onClick={handleAdd}
          >
            {canAdd ? "Add to Cart" : "Out of Stock"}
          </button>
          {detailsTo && (
            <Link to={detailsTo} className="btn btn-outline-dark w-100">
              {detailsLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 