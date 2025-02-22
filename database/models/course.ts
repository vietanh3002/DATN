import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
} from "sequelize";

export class Courses extends Model<
  InferAttributes<Courses>,
  InferCreationAttributes<Courses>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare videoIntro: string;
  declare thumbnail: string;
  declare price: number;
  declare unitPrice: number;
  declare authorId: number;
  declare description: string;
  declare otherInfo: string;
  declare status: "draft" | "pending" | "published" | "reject";
  declare totalRate: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initClass = (sequelize: Sequelize) => {
    Courses.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        videoIntro: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        thumbnail: {
          type: DataTypes.TEXT("medium"),
          allowNull: false,
        },
        price: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        unitPrice: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        authorId: {
          type: DataTypes.INTEGER,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT("medium"),
        },
        otherInfo: {
          type: DataTypes.TEXT,
        },
        status: {
          type: DataTypes.ENUM("draft", "pending", "published", "reject"),
          allowNull: false,
          defaultValue: "draft",
        },
        totalRate: {
          type: DataTypes.NUMBER,
          defaultValue: 5.0,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "courses",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        name: {
          singular: "course",
          plural: "courses",
        },
      }
    );
  };
}
