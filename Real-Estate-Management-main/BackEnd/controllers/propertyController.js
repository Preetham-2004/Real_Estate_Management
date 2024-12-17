// propertyController.js

const Property = require("../models/Property");

exports.createProperty = async (req, res) => {
    try {
        const { title, description, image, contact, price, area } = req.body;

        if (!title || !image || !price || !area || !description || !contact) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const newProperty = new Property({
            title,
            description,
            image,
            contact,
            price,
            area
        });

        const savedProperty = await newProperty.save();
        res.status(201).json(savedProperty);
    } catch (error) {
        console.error("Error adding property:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProperty = async (req, res) => {
    try {
        const { title, description, image, contact, price, area } = req.body;

        if (!title || !description || !image || !contact || !price || !area) {
            return res.status(400).json({ message: "Incomplete property data" });
        }

        const property = await Property.findByIdAndUpdate(req.params.id, {
            title,
            description,
            image,
            contact,
            price,
            area,
        }, { new: true });

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        res.json(property);
    } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        res.json({ message: "Property deleted", deletedProperty: property });
    } catch (error) {
        console.error("Error deleting property:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};