const Tour = require("../model/tourModel");
const factory = require("./handlerFactory");
const multerUpload = require("../config/cloudinary");
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.createTour = factory.createOne(Tour);
