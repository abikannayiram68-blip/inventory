module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM('admin', 'employee'),
        allowNull: false,
        defaultValue: 'employee'
      },
      phone_number: DataTypes.STRING,
      profile_image: DataTypes.STRING,
      deleted_at: DataTypes.DATE
    },
    {
      tableName: 'users',
      underscored: true,
      paranoid: true,
      deletedAt: 'deleted_at'
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Booking, { foreignKey: 'user_id' });
  };

  return User;
};
