module.exports = (sequelize, DataTypes) => {
  const BookingResource = sequelize.define(
    'BookingResource',
    {
      booking_id: { type: DataTypes.INTEGER, allowNull: false },
      resource_id: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
      tableName: 'booking_resources',
      underscored: true,
      timestamps: true
    }
  );

  return BookingResource;
};
