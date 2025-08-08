import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted) {
        setData(await response.clone().json());
        setFilter(await response.json());
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        {filter.map((product) => {
          const isOutOfStock = product.rating.count <= 0; // Simulation stock
          const ratingStars = "⭐".repeat(Math.round(product.rating.rate));

          // Simuler une promo si le prix > 100
          const isOnSale = product.price > 100;

          return (
            <div
              id={product.id}
              key={product.id}
              className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4"
            >
              <div className="card product-card h-100 border-0 shadow-sm position-relative">

                {/* Badge promo / rupture */}
                {isOutOfStock && (
                  <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                    Out of Stock
                  </span>
                )}
                {isOnSale && !isOutOfStock && (
                  <span className="badge bg-success position-absolute top-0 start-0 m-2">
                    -20%
                  </span>
                )}

                {/* Image avec effet hover */}
                <div className="overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="card-img-top p-3 product-image"
                    style={{ height: "250px", objectFit: "contain" }}
                  />
                </div>

                {/* Infos */}
                <div className="card-body d-flex flex-column">
                  <h6 className="text-muted small text-uppercase mb-1">
                    {product.category}
                  </h6>
                  <h5 className="fw-bold">
                    {product.title.length > 25
                      ? product.title.substring(0, 25) + "..."
                      : product.title}
                  </h5>
                  <p className="text-warning mb-1 small">{ratingStars}</p>
                  <p className="text-muted small flex-grow-1">
                    {product.description.substring(0, 60)}...
                  </p>

                  {/* Prix */}
                  <div className="mb-3">
                    <span className="text-primary fw-bold">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Boutons */}
                  {isOutOfStock ? (
                    <button className="btn btn-secondary w-100" disabled>
                      Out of Stock
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-dark w-100 mb-2"
                        onClick={() => {
                          toast.success("Added to cart");
                          addProduct(product);
                        }}
                      >
                        Add to Cart
                      </button>
                      <Link
                        to={`/product/${product.id}`}
                        className="btn btn-outline-dark w-100"
                      >
                        View Details
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

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
