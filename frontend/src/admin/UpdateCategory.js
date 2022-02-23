import React, { useEffect, useState } from "react";
import Base from "../core/Base";
import { isAutheticated } from "../auth/helper";
import { Link } from "react-router-dom";
import { getACategory, updateCategory } from "./helper/adminapicall";

const UpdateCategory = ({ match }) => {
    const [category, setCategory] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const { user, token } = isAutheticated();

    const goBack = () => (
        <div className="mt-5">
            <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">
                Admin Home
            </Link>
        </div>
    );

    const preload = categoryId => {
        getACategory(categoryId).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setCategory(data.name);
                setCategoryId(data._id);
            }
        });
    };

    useEffect(() => {
        preload(match.params.categoryId);
    }, []);

    const handleChange = event => {
        setError("");
        setCategory(event.target.value);
    };

    const onSubmit = event => {
        event.preventDefault();
        setError("");
        setSuccess(false);

        //backend request fired
        updateCategory(user._id, token, category, categoryId).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setError("");
                setSuccess(true);
                setCategory("");
            }
        });
    };

    const successMessage = () => {
        if (success) {
            return <h4 className="text-success">Category updated successfully</h4>;
        }
    };

    const warningMessage = () => {
        if (error) {
            return <h4 className="text-success">Failed to update category</h4>;
        }
    };

    const myCategoryForm = () => (
        <form>
            <div className="form-group">
                <p className="lead">Enter the category</p>
                <input
                    type="text"
                    className="form-control my-3"
                    onChange={handleChange}
                    value={category}
                    autoFocus
                    required
                />
                <button onClick={onSubmit} className="btn btn-outline-info">
                    Update Category
                </button>
            </div>
        </form>
    );

    return (
        <Base
            title="Update category here"
            description=""
            className="container bg-info p-4"
        >
            <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {myCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Base>
    );
};

export default UpdateCategory;
