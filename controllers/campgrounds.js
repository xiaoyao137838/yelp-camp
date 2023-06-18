const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

const index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/list', { campgrounds });
}

const renderNew = (req, res) => {
    res.render('campgrounds/newCamp');
}

const createCamp = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    console.log(geoData.body.features[0].geometry)
  
    const camp = new Campground(req.body.campground);
    camp.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    camp.author = req.user;
    camp.geometry = geoData.body.features[0].geometry;
    await camp.save();
    console.log(camp);

    req.flash('success', 'Successfully make a new campground');
    res.redirect(`/campgrounds/${camp._id}`);
}

const showCamp = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).
    populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    res.render('campgrounds/show', { campground });
}

const updateCamp = async (req, res) => {
    const id = req.params.id;
    const uploadedImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    const { deleteImages } = req.body;
    if (deleteImages) {

    
        for (let filename of deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
    }

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground, $pull: { images: { filename: { $in: deleteImages } } } });
    campground.images.push(...uploadedImages);

    await campground.save();
    req.flash('success', 'Successfully update the campground');
    res.redirect(`/campgrounds/${ id }`);
}

const deleteCamp = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}

const renderEdit = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}

module.exports = { index, renderNew, createCamp, showCamp, updateCamp, deleteCamp, renderEdit };