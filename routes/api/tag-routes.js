const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try
  {
    // find all tags
    const allTagData = await Tag.findAll({
      // be sure to include its associated Product data
      include: [{
        model: Product,
        throug: ProductTag,
        as: 'products'
      }] 
    });

    res.send(200).json(allTagData);
  }catch(err)
  {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get('/:id', async (req, res) => {
  try
  {
    // find a single tag by its `id`
    const tagData = await Tag.findByPk(req.params.id,{
      // be sure to include its associated Product data
      include: [{
        model:Product, 
        through: ProductTag, 
        as: 'products'
      }]
    });
    
    res.status(200).json(tagData);
    console.log(tagData);

  }catch(err)
  {
    res.status(500).json(err);
    console.log(err);
  }
});

router.post('/', async (req, res) => {
    /* req.body should look like this...
    {
      tag_name: "Basketball",
      productIds: [1, 2, 3, 4]
    }
  */
  try
  {
    //create a new tag
    const newTag = await Tag.create(req.body);
    
    // if there's related products, we need to create pairings to bulk create in the ProductTag model
    if(req.body.productIds.length)
    {
      const productIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: newTag.id,
          product_id,
        }
      });

      const productPairings = await ProductTag.bulkCreate(productIdArr);
      console.log("Logging all created tag to product pairings:\n", productPairings);
    }
    
    res.status(200).json(newTag);

  }catch(err)
  {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try
  {
    // update a tag's name by its `id` value
    const updatedTag = await Tag.update(req.body,{
      where: {
        id: req.params.id,
      },
    })

    //finds all associated products from ProductTag
    const relatedProducts = await Product.findAll({
      where: {
        tag_id: req.params.id,
      },
    })
    // get list of current product_ids
    const relatedProductIds = relatedProducts.map(({product_id}) => product_id);
    console.log("Logging this on from relatedproducts map!!!!\n", relatedProductIds);

    // create filtered list of new tag_ids
    const newProductTags = req.body.productIds
    .filter((product_id) => !relatedProductIds.includes(product_id))
    .map((product_id) =>{
      return {
        tag_id: req.params.id,
        product_id,
      };
    });

    //figure out which ones to remove
    const productTagsToRemove = relatedProducts
    .filter(({ product_id }) => !req.body.productIds.includes(product_id))
    .map(({ id }) => id);

    //run both actions
    const updatedResults = Promise.all([
      Tag.destroy({where: {id: productTagsToRemove} }),
      Tag.bulkCreate(newProductTags),
    ]);

    res.status(200).json(updatedResults);
    console.log("Updated Results Here!\n", updatedResults)

  }catch(err)
  {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try
  {
    // delete on tag by its `id` value
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    res.status(200).json(deletedTag);
    console.log("The Following has been Destroyed: \n", deletedTag);

  }catch(err)
  {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
