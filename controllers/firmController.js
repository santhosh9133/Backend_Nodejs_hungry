const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination directory where images will be stored
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using the original name and current timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

const addFirm = async(req, res) => {
    
    try {
        const { firmName, area, category, region, offer } = req.body;

        const image = req.file ? req.file.filename : undefined;

        const vendor = await Vendor.findById(req.vendorId);

        if(!vendor){
            res.status(404).json({message: "vendor not found"})
        }

        const firm = new Firm({
          firmName,
          area,
          category,
          region,
          offer,
          image,
          vendor: vendor._id,
        });

        const savedFirm = await firm.save();

        vendor.firm.push(savedFirm)

        await vendor.save()

        return res.status(200).json({message: "Firm Added successfully"})
    } catch (error) {
        console.error(error)
        res.status(500).json("Internal server error")
    }
}

const deleteFirmById = async (req, res) => {
  try {
    const productId = req.parms.firmId;

    const deletedProduct = await Firm.findByIdAndDeletw(firmId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "No Product Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
};

module.exports = { addFirm : [upload.single('image'), addFirm], deleteFirmById};