import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
} from "sequelize";

export class Infos extends Model<
  InferAttributes<Infos>,
  InferCreationAttributes<Infos>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare image: string;
  declare description: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initClass = (sequelize: Sequelize) => {
    Infos.init(
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
        image: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "infos",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        name: {
          singular: "info",
          plural: "infos",
        },
      }
    );
  };
}
