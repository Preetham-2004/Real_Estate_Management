const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true, default: "No description provided" },
    image: { type: String, required: true },
    contact: { type: String, required: true, default: "No contact provided" },
    price: { type: Number, required: true },
    area: { type: Number, required: true },
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
