const Sequelize = require("sequelize");
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getAddProduct = (req, res, next) => {
	res.render("admin/edit-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		edit: false,
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;

	req.user
		.createProduct(
			{
				title: title,
				price: price,
				description: description,
				imageUrl: imageUrl,
			}
		)
		.then((result) => {
			console.log(result);
			res.redirect("/");
		})
		.catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
	const prodId = req.params.productId;
	const editMode = req.query.edit;

	if (!editMode) {
		res.redirect("/products");
	}

	req.user
		.getProducts({ where: { id: prodId } })
		.then((products) => {
			const product = products[0];
			if (!product) {
				return res.redirect("/admin/products");
			}
			res.render("admin/edit-product", {
				pageTitle: "Update Product",
				path: "/admin/edit-product",
				edit: editMode,
				product: product,
			});
		})
		.catch((err) => {
			console.log("err", err);
		});
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDesc = req.body.description;

	Product.findByPk(prodId)
		.then((product) => {
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.imageUrl = updatedImageUrl;
			product.description = updatedDesc;
			return product.save();
		})
		.then((result) => {
			console.log("result", result);
			res.redirect("/admin/products");
		})
		.catch((err) => {
			console.log("err", err);
		});
};

exports.getProducts = (req, res, next) => {
	req.user.getProducts()
		.then((products) => {
			res.render("admin/products", {
				prods: products,
				pageTitle: "Admin Products",
				path: "/admin/products",
			});
		})
		.catch((err) => {
			console.log("err", err);
		});
};

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findByPk(prodId)
		.then((product) => {
			return product.destroy();
		})
		.then((result) => {
			res.redirect("/admin/products");
		})
		.catch((err) => {
			console.log("err", err);
		});
};
