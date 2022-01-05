const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try
  {
    // find all categories
    const allCategories = await Category.findAll({
      // be sure to include its associated Products
      include: [{model: Product}],
    });

    res.status(200).json(allCategories);
    console.log("Logging all Category Data: \n", allCategories);

  }catch(err)
  {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try
  {
    // find one category by its `id` value
    const categoryData = await Category.findByPk(req.params.id, {
      // be sure to include its associated Products
      include: [{model: Product}],
    });

    res.status(200).json(categoryData);
    console.log("Logging selected Category Data: \n", categoryData);

  }catch(err)
  {
    console.log(err);
    res.status(500).json(err);
  }
});

// create new category
router.post('/', async (req, res) => {
  try
  {
    const newCategory = await Category.create(req.body);

    res.status(201).json(newCategory);
    console.log("New Category Has Been Created Successfully! \n", newCategory);
  }catch(err)
  {
    res.status(500).json(err);
    console.log(err);
  }
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try
  {
    const updatedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    res.status(204).send('Category Has Been Successfully Updated!');
    console.log("Category Has Been Successfully Updated!\n", updatedCategory);

  }catch(err)
  {
    res.status(500).json(err);
    console.log(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  console.log("Logging from line 83!!!!!!!!!!");
  try
  {
    const deletedCategory = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    res.status(204).json(deletedCategory);
    console.log("The Following Category Has Been Destroyed: \n", deletedCategory);

  }catch(err)
  {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;
