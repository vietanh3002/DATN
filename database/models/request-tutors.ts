import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
} from "sequelize";

export class RequestTutors extends Model<
  InferAttributes<RequestTutors>,
  InferCreationAttributes<RequestTutors>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare proposedCourses: string;
  declare expertise: string;
  declare experience: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initClass = (sequelize: Sequelize) => {
    RequestTutors.init(
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
        proposedCourses: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        expertise: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        experience: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "requestTutors",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        name: {
          singular: "requestTutor",
          plural: "requestTutors",
        },
      }
    );
  };
}
