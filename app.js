const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
	User.findByPk(1)
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => {
			console.log("err", err);
		});
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
	.sync()
	.then(() => {
		return User.findByPk(1);
	})
	.then((user) => {
		if (!user) {
			return User.create({
				id: 1,
				name: "Ahmed Elhady",
				age: 22,
				email: "ahmed@elhady.com",
			});
		}
		return user;
	})
	.then((user) => {
		return Cart.findByPk(1);
	})
	.then((cart) => {
		if (!cart) {
			return Cart.create({ id: 1, userId: 1 });
		}
		return cart;
	})
	.then((cart) => {
		app.listen(3000);
	})
	.catch((err) => console.log(err));
