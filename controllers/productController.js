const Product = require('../models/Product')
const Firm = require('../models/Firm');
const multer = require('multer');

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

const addProduct = async(req, res) => {
    try {
        const {productName, price, category, bestseller, description} = req.body;
        const image = req.file ? req.file.filename : undefined;

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if(!firm){
            return res.status(404).json({error: "No firm found"})
        }

        const product = new Product({
          productName,
          price,
          category,
          bestseller,
          description,
          image,
          firm: firm._id
        });

        const savedProduct = await product.save();

        firm.products.push(savedProduct);

        await firm.save();

        res.status(200).json(savedProduct)
    } catch (error) {
        console.error(error);
        res.status(500).json({error : 'internal server error'})
    }
}

const getProductByFirm = async(req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if(!firm){
      return res.ststus(404).json({error: "No firm found"});
    }

    const restaurantName = firm.firmName;
    const products =  await Product.find({firm: firmId});
    res.status(200).json({ restaurantName, products });
  } catch (error) {
    console.error(error);
        res.status(500).json({error : 'internal server error'})
  }
}

const deleteProductById = async(req, res)=> {
  try {
    const productId = req.parms.productId;

    const deletedProduct = await Product.findByIdAndDeletw(productId);

    if(!deletedProduct){
      return res.status(404).json({error : "No Product Found"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
}

module.exports = {addProduct: [upload.single('image'), addProduct,], getProductByFirm, deleteProductById};