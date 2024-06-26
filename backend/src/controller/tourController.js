const Tour = require("../model/tourModel");
const factory = require("./handlerFactory");
const multerUpload = require("../config/cloudinary");
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.createTour = factory.createOne(Tour);
//  async (req, res) => {
//   try {
//     await multerUpload.array("images", 6)(req, res, async (err) => {
//       if (err) {
//         return res.json({ success: false, message: err.message });
//       }
//       // add the image url to the request body
//       req.body.images = req.files.map((file) => file.path || file.location);
//       const doc = await factory.createOne(Tour)(req, res);
//       res.status(201).json({
//         status: "success",
//         data: {
//           data: doc,
//         },
//       });
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };
