module.exports = (sequelize, DataTypes) => {
  const RoomType = sequelize.define(
    'RoomType',
    {
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      deleted_at: DataTypes.DATE
    },
    {
      tableName: 'room_types',
      underscored: true,
      paranoid: true,
      deletedAt: 'deleted_at'
    }
  );

  RoomType.associate = (models) => {
    RoomType.hasMany(models.Room, { foreignKey: 'room_type_id' });
  };

  return RoomType;
};
