const Tour = require("../model/tourModel");
const asyncHandler = require("../util/asyncHandler");
const factory = require("./handlerFactory");
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.deleteAllTours = factory.deleteAll(Tour);
exports.createTour = factory.createOne(Tour);
exports.searchTour = asyncHandler(async (req, res, next) => {
  const { name, longitude, latitude, maxDistance } = req.query;
  // build qury object.
  let queryObj = {};
  //   autocomplete
  if (name) {
    queryObj.name = { $regex: name, $options: "i" };
  }
  // geospatial search.
  if (longitude && latitude && maxDistance) {
    // convert km=meter
    const maxDistanceMeters = Number(maxDistance) * 1000;
    queryObj.location = {
      $near: {
        $geometry: {
          type: "point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: maxDistanceMeters,
      },
    };
  }
  //   execute the query.
  const tours = await Tour.find(queryObj);
  res.status(200).json({
    status: "sucess",
    result: tours.length,
    data: tours,
  });
});
