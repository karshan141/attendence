const Designation = require("../models/Designation");
require("dotenv").config();

exports.addDesignation = async (req, res) => {
  try {
    // Extract designation from the request body
    const { designation } = req.body;

    // Check if designation is missing or empty
    if (!designation) {
      return res.status(200).json({
        success: false,
        message: "Designation is required",
      });
    }

    // Check if the designation already exists in the database
    const existingDesignation = await Designation.findOne({ designation });

    if (existingDesignation) {
      // Designation already exists, return a conflict response
      return res.status(200).json({
        success: false,
        message: "Designation already exists",
      });
    }

    // Create a new Designation document
    const newDesignation = new Designation({ designation });

    // Save the new designation document to the database
    const savedDesignation = await newDesignation.save();

    // Return a success response with the saved designation data
    return res.status(201).json({
      success: true,
      message: "Designation added successfully",
      data: savedDesignation,
    });
  } catch (error) {
    console.error("Error saving designation:", error);

    // Handle unexpected errors with a 500 Internal Server Error response
    return res.status(200).json({
      success: false,
      message: "Failed to add designation",
      error: error.message,
    });
  }
};

exports.getAllDesignation = async (req, res) => {
  try {
    const designation = await Designation.find();

    if (!designation) {
      return res.status(201).json({
        success: false,
        message: `No Category Awailabale`,
      });
    }

    return res.status(201).json({
      success: true,
      message: `Designation fetched successfully`,
      data: designation,
    });
  } catch (error) {
    console.log("first", error);
    return res.status(200).json({
      success: false,
      message: `Failed to load Designation Please try again`,
    });
  }
};

exports.editDesignation = async (req, res) => {
  try {
    const { id, designation } = req.body;

    // Use findByIdAndUpdate to update the document by ID
    const updatedDesignation = await Designation.findByIdAndUpdate(id, {
      designation,
    });

    if (updatedDesignation) {
      // The record was updated successfully
      // Handle the response
      return res.status(200).json({
        success: true,
        message: "Designation updated successfully",
        data: updatedDesignation,
      });
    } else {
      // Handle the case where the document with the given ID was not found
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }
  } catch (error) {
    console.error("Error editing designation:", error);

    // Handle unexpected errors with a 500 Internal Server Error response
    return res.status(200).json({
      success: false,
      message: "Failed to edit designation",
      error: error.message,
    });
  }
};

exports.deleteDesignation = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Designation.findByIdAndRemove(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    return res.json({
      success: true,
      message: "Designation deleted successfully",
    });
  } catch (error) {
    console.log("first", error);
    return res.status(200).json({
      success: false,
      message: `Failed to load Designation Please try again`,
    });
  }
};
