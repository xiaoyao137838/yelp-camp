const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry:{
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/ddlx3o9sj/image/upload/v1685109062/YelpCamp/nmpb43bhqcu4n8p3vv33.jpg',
                  filename: 'YelpCamp/nmpb43bhqcu4n8p3vv33',
                },
                {
                  url: 'https://res.cloudinary.com/ddlx3o9sj/image/upload/v1685109064/YelpCamp/zx5ymqoznjoxyzxk6wbi.jpg',
                  filename: 'YelpCamp/zx5ymqoznjoxyzxk6wbi',
                }
            ],
            description:'Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            price: price,
            author: '64170fa9d5ac2880c82d7fb2'
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});