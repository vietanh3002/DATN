import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
} from "sequelize";

export class Users extends Model<
  InferAttributes<Users>,
  InferCreationAttributes<Users>
> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare email: string;
  declare password: string;
  declare role: "user" | "admin" | "tutor" | "request-tutor";
  declare provider: "credentials" | "google" | "facebook";
  declare avatar: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initClass = (sequelize: Sequelize) => {
    Users.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: DataTypes.STRING,
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
        },
        role: {
          type: DataTypes.ENUM("user", "admin", "tutor", "request-tutor"),
          defaultValue: "user",
          allowNull: false,
        },
        provider: {
          type: DataTypes.ENUM("credentials", "google", "facebook"),
          defaultValue: "credentials",
          allowNull: false,
        },
        avatar: {
          type: DataTypes.TEXT("long"),
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "users",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        name: {
          singular: "user",
          plural: "users",
        },
      }
    );
  };
}
