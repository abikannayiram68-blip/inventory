const resourceService = require('../services/resourceService');

const list = async (req, res, next) => {
  try {
    res.json(await resourceService.listResources());
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    res.status(201).json(await resourceService.createResource(req.body));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    res.json(await resourceService.updateResource(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await resourceService.deleteResource(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { list, create, update, remove };
