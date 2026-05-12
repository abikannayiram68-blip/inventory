module.exports = (sequelize, DataTypes) => {
  const Resource = sequelize.define(
    'Resource',
    {
      name: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      status: {
        type: DataTypes.ENUM('available', 'unavailable', 'maintenance'),
        allowNull: false,
        defaultValue: 'available'
      },
      deleted_at: DataTypes.DATE
    },
    {
      tableName: 'resources',
      underscored: true,
      paranoid: true,
      deletedAt: 'deleted_at'
    }
  );

  Resource.associate = (models) => {
    Resource.belongsToMany(models.Booking, {
      through: models.BookingResource,
      foreignKey: 'resource_id',
      otherKey: 'booking_id'
    });
  };

  return Resource;
};
