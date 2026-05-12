module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    'Booking',
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      room_id: { type: DataTypes.INTEGER, allowNull: false },
      start_time: { type: DataTypes.DATE, allowNull: false },
      end_time: { type: DataTypes.DATE, allowNull: false },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },
      priority: {
        type: DataTypes.ENUM('normal', 'urgent'),
        allowNull: false,
        defaultValue: 'normal'
      },
      notes: DataTypes.TEXT,
      deleted_at: DataTypes.DATE
    },
    {
      tableName: 'bookings',
      underscored: true,
      paranoid: true,
      deletedAt: 'deleted_at'
    }
  );

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, { foreignKey: 'user_id' });
    Booking.belongsTo(models.Room, { foreignKey: 'room_id' });
    Booking.belongsToMany(models.Resource, {
      through: models.BookingResource,
      foreignKey: 'booking_id',
      otherKey: 'resource_id'
    });
  };

  return Booking;
};
