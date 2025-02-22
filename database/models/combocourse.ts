import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
} from "sequelize";

export class ComboCourses extends Model<
  InferAttributes<ComboCourses>,
  InferCreationAttributes<ComboCourses>
> {
  declare id: CreationOptional<number>;
  declare comboId: number;
  declare courseId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initClass = (sequelize: Sequelize) => {
    ComboCourses.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        comboId: {
          type: DataTypes.NUMBER,
          references: {
            model: "combos",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          allowNull: false,
        },
        courseId: {
          type: DataTypes.NUMBER,
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
        tableName: "comboCourses",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        name: {
          singular: "comboCourse",
          plural: "comboCourses",
        },
      }
    );
  };
}
