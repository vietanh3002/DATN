import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
} from "sequelize";

export class TutorCourses extends Model<
  InferAttributes<TutorCourses>,
  InferCreationAttributes<TutorCourses>
> {
  declare id: CreationOptional<number>;
  declare authorId: number;
  declare type: "online" | "offline";
  declare title: string;
  declare videoIntro: string;
  declare thumbnail: string;
  declare maximumQuantity: number;
  declare pricePer: number;
  declare description: string;
  declare otherInfo: string;
  declare status: "draft" | "pending" | "published" | "reject";
  declare totalRate: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initClass = (sequelize: Sequelize) => {
    TutorCourses.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
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
        type: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "online",
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
        maximumQuantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        pricePer: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT("medium"),
          allowNull: false,
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
        tableName: "tutorCourses",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        name: {
          singular: "tutorCourse",
          plural: "tutorCourses",
        },
      }
    );
  };
}
