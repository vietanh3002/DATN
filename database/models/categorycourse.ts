import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
} from "sequelize";

export class CategoryCourses extends Model<
  InferAttributes<CategoryCourses>,
  InferCreationAttributes<CategoryCourses>
> {
  declare id: CreationOptional<number>;
  declare categoryId: number;
  declare courseId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initClass = (sequelize: Sequelize) => {
    CategoryCourses.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        categoryId: {
          type: DataTypes.INTEGER,
          references: {
            model: "categories",
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
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "categoryCourses",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        name: {
          singular: "categoryCourse",
          plural: "categoryCourses",
        },
      }
    );
  };
}
