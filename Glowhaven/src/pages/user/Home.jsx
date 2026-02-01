import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import { useNavigate, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchProducts } from "../../features/products/productSlice";
// import { addToCart } from "../../features/cart/cartSlice";
// import { addToWishlist } from "../../features/wishlist/wishlistSlice";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading } = useSelector((state) => state.products);

  // 🚀 Fetch products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featuredProducts = products?.filter((p) => p.isFeatured);

  // 🔐 SHOP NAVIGATION WITH AUTH CHECK
  const handleShopNavigation = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Please login to continue");
      navigate("/login");
    } else {
      navigate("/shop");
    }
  };

  if (loading) {
    return <p className="text-center py-5">Loading...</p>;
  }

  return (
    <>
      {/* ====================== HERO ====================== */}
      <div className="hero">
        <Swiper
          slidesPerView={1}
          modules={[Autoplay, EffectFade]}
          effect="fade"
          loop
          speed={1000}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
        >
          <SwiperSlide>
            <div className="hero-wrap hero-wrap1">
              <div className="hero-content">
                <h5>_ ESSENTIAL ITEMS</h5>
                <h1>Beauty Inspires by Real Life</h1>
                <p>Clean, non-toxic skincare for everyone.</p>
                <button onClick={handleShopNavigation} className="btn hero-btn">
                  Shop Now
                </button>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="hero-wrap hero-wrap2">
              <div className="hero-content">
                <h5>NEW COLLECTION</h5>
                <h1>Perfectly Hydrated Skin</h1>
                <button onClick={handleShopNavigation} className="btn hero-btn">
                  Shop Now
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* ====================== FEATURED PRODUCTS ====================== */}
      <div className="product-container py-5 my-5">
        <div className="container">
          <h2 className="text-center fw-semibold fs-1 mb-4">
            Our Featured Products
          </h2>
          <p className="text-center text-muted mb-5">
            Get the skin you want to feel
          </p>

          {products.length === 0 ? (
            <p className="text-center text-muted fs-5">
              No products available...
            </p>
          ) : (
            <Swiper
              spaceBetween={20}
              modules={[Navigation]}
              breakpoints={{
                1200: { slidesPerView: 4 },
                991: { slidesPerView: 3 },
                767: { slidesPerView: 2 },
                0: { slidesPerView: 2 },
              }}
            >
              {(featuredProducts?.length > 0
                ? featuredProducts
                : products
              ).map((product) => (
               <SwiperSlide key={product._id}>
  <Link
    to={`/product/${product._id}`}
    className="product-item text-decoration-none text-dark"
  >
    <div className="product-image-box">
      <img
        src={product.image || "/placeholder.jpg"}
        alt={product.name}
        className="product-img img-1"
      />

      {product.secondImage && (
        <img
          src={product.secondImage}
          alt={product.name}
          className="product-img img-2"
        />
      )}
    </div>

    <h4 className="product-title">{product.name}</h4>
    <p className="product-price">₹ {product.price}</p>
  </Link>
</SwiperSlide>

              ))}
            </Swiper>
          )}

          {/* VIEW ALL */}
          <div className="text-center mt-4">
            <button
              onClick={handleShopNavigation}
              className="btn btn-outline-dark px-4"
            >
              View All Products →
            </button>
          </div>
        </div>
      </div>

      {/* ====================== DISCOVER ====================== */}
      <section className="discover container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-semibold fs-1">More to Discover</h2>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-md-6 text-center">
            <div className="discover-box discover-img-1 d-flex align-items-center justify-content-center">
              <button
                onClick={handleShopNavigation}
                className="btn btn-light px-4 py-2"
              >
                Shop Now
              </button>
            </div>
            <h5 className="mt-3">Summer Collection</h5>
          </div>
        </div>
      </section>
 <ToastContainer
        position="top-right"
        autoClose={800}
        theme="colored"
      />
    </>
  );
}

export default Home;
