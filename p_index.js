const express = require('express');
const mongoose = require('mongoose');
const Farm = require('./p_models/farm');
const Product = require('./p_models/product');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const app = express();

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/farmstand')
.then(() => console.log('DB connected successfully'))
.catch(e => console.log('DB is not connected'));

app.set('views', path.join(__dirname, 'p_views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const categories = ['fruit', 'veg', 'others'];

app.get('/farms', catchAsync(async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms });
}));

app.post('/farms', catchAsync(async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    res.redirect('/farms');
}));

app.get('/farms/new', (req, res) => {
    res.render('farms/new');

});

app.get('/farms/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    if (!farm) {
        throw new ExpressError('This farm not found', 404);
    }
    res.render('farms/edit', { farm });
}));

app.get('/farms/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id).populate('products');
    if (!farm) {
        throw new ExpressError('This farm not found', 404);
    }
    res.render('farms/show', { farm });
}));

app.put('/farms/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Farm.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect(`/farms/${ id }`);
}));

app.delete('/farms/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Farm.findByIdAndDelete(id);
    res.redirect('/farms');
}));

// Product
app.get('/farms/:id/products', catchAsync(async (req, res) => {
    const { id } = req.params;
    const { category } = req.query;

    if (category) {
        const products = await Product.find({ farm: id, category: category });
        return res.render('products/index', { id, products, category });
    }
    const farm = await Farm.findById(id).populate('products');
    
    res.render('products/index', { id, products: farm.products, category: 'All' });
}));

app.get('/farms/:id/products/new', catchAsync(async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    if (!farm) {
        throw new ExpressError('This farm not found', 404);
    }
    res.render('products/new', { id, farm, categories });
}));

app.post('/farms/:id/products', catchAsync(async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    if (!farm) {
        throw new ExpressError('This farm not found', 404);
    }
    const product = new Product(req.body);
    product.farm = farm;
    farm.products.push(product);
    await product.save();
    await farm.save();
    return res.redirect(`/farms/${ id }/products`);
}));

app.get('/products/:productId/edit', catchAsync(async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
        throw new ExpressError('This product not found', 404);
    }
    res.render('products/edit', { product, categories });
}));

app.delete('/farms/:id/products/:productId', catchAsync(async (req, res) => {
    const { id, productId } = req.params;
    await Product.findByIdAndDelete(productId);
    return res.redirect(`/farms/${ id }/products`);
}));

app.get('/products/:productId', catchAsync(async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate('farm');
    if (!product) {
        throw new ExpressError('This product not found', 404);
    }
    res.render('products/show', { product });
}));

app.patch('/products/:productId', catchAsync(async (req, res) => {
    const { productId } = req.params;
    await Product.findByIdAndUpdate(productId, req.body, { runValidators: true });
    res.redirect(`/products/${ productId }`);
}));

app.use((req, res) => {
    throw new ExpressError('This route does not exist', 404);
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something wrong with server' } = err;
 
    const expressError = new ExpressError(message, status);
    res.status(status).render('error', { error: expressError });
})


app.listen(3000, () => console.log('Listening at port 3000'));


