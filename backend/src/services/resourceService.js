const { Resource } = require('../models');
const AppError = require('../utils/AppError');

const listResources = () => Resource.findAll({ order: [['type', 'ASC'], ['name', 'ASC']] });

const getResource = async (id) => {
  const resource = await Resource.findByPk(id);
  if (!resource) throw new AppError('Resource not found', 404);
  return resource;
};

const createResource = (payload) => {
  if (!payload.name || !payload.type) {
    throw new AppError('Resource name and type are required', 400);
  }
  return Resource.create(payload);
};

const updateResource = async (id, payload) => {
  const resource = await getResource(id);
  await resource.update(payload);
  return resource;
};

const deleteResource = async (id) => {
  const resource = await getResource(id);
  await resource.destroy();
};

module.exports = { listResources, getResource, createResource, updateResource, deleteResource };
