import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
} from "sequelize";

export class UserCourses extends Model<
  InferAttributes<UserCourses>,
  InferCreationAttributes<UserCourses>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare courseId: number;
  declare status: "active" | "inactive";
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initClass = (sequelize: Sequelize) => {
    UserCourses.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          allowNull: false,
        },
        courseId: {
          type: DataTypes.INTEGER,
          references: {
            model: "courses",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM("active", "inactive"),
          defaultValue: "active",
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "userCourses",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        name: {
          singular: "userCourse",
          plural: "userCourses",
        },
      }
    );
  };
}
