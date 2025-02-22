import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
} from "sequelize";

export class CategoryTutorCourses extends Model<
  InferAttributes<CategoryTutorCourses>,
  InferCreationAttributes<CategoryTutorCourses>
> {
  declare id: CreationOptional<number>;
  declare categoryId: number;
  declare tutorCourseId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initClass = (sequelize: Sequelize) => {
    CategoryTutorCourses.init(
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
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "categoryTutorCourses",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        name: {
          singular: "categoryTutorCourse",
          plural: "categoryTutorCourses",
        },
      }
    );
  };
}
