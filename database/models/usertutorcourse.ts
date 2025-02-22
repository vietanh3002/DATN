import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
} from "sequelize";

export class UserTutorCourses extends Model<
  InferAttributes<UserTutorCourses>,
  InferCreationAttributes<UserTutorCourses>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare tutorCourseId: number;
  declare status: "active" | "inactive";
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initClass = (sequelize: Sequelize) => {
    UserTutorCourses.init(
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
        tutorCourseId: {
          type: DataTypes.INTEGER,
          references: {
            model: "tutorCourses",
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
        tableName: "userTutorCourses",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        name: {
          singular: "userTutorCourse",
          plural: "userTutorCourses",
        },
      }
    );
  };
}
