module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    'Room',
    {
      name: { type: DataTypes.STRING, allowNull: false },
      capacity: { type: DataTypes.INTEGER, allowNull: false },
      floor_number: { type: DataTypes.INTEGER, allowNull: false },
      has_projector: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      availability_status: {
        type: DataTypes.ENUM('available', 'unavailable'),
        allowNull: false,
        defaultValue: 'available'
      },
      room_type_id: DataTypes.INTEGER,
      deleted_at: DataTypes.DATE
    },
    {
      tableName: 'rooms',
      underscored: true,
      paranoid: true,
      deletedAt: 'deleted_at'
    }
  );

  Room.associate = (models) => {
    Room.belongsTo(models.RoomType, { foreignKey: 'room_type_id' });
    Room.hasMany(models.Booking, { foreignKey: 'room_id' });
  };

  return Room;
};
