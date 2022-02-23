import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { isAutheticated } from "../auth/helper";
import { deleteCategory, getCategories } from "./helper/adminapicall";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);

  const { user, token } = isAutheticated();

  const preload = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  useEffect(() => {
    preload();
  }, []);

  const deleteACategory = (categoryId) => {
    deleteCategory(categoryId, token, user._id).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        preload();
      }
    });
  };

  return (
    <Base
      title="Manage Categories"
      description="Manage the categories for your product here."
    >
      <Link className="btn btn-info" to={`/admin/dashboard`}>
        <span className="">Admin Home</span>
      </Link>
      <h2 className="mb-4 pt-3">All Categories</h2>
      <div className="row">
        <div className="col-12">
          <h4 className="text-warning text-white my-3">
            Total Categories: {categories.length}
          </h4>
          {categories.map((category, index) => {
            return (
              <div className="row" key={index}>
                <div className="col-4">
                  <h3 className="text-white">{category.name}</h3>
                </div>
                <div className="col-4 d-flex justify-content-center align-items-center">
                  <Link
                    className="btn btn-success"
                    to={`/admin/category/update/${category._id}`}
                  >
                    <span className="">Update</span>
                  </Link>
                </div>
                <div className="col-4 d-flex justify-content-center align-items-center">
                  <button
                    onClick={() => {
                      deleteACategory(category._id);
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          <div className="row text-center mb-5 "></div>
        </div>
      </div>
    </Base>
  );
};

export default ManageCategories;
