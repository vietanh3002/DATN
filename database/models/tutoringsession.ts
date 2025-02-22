import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
} from "sequelize";

export class TutoringSessions extends Model<
  InferAttributes<TutoringSessions>,
  InferCreationAttributes<TutoringSessions>
> {
  declare id: CreationOptional<number>;
  declare tutorCourseId: number;
  declare tutoringDay: Date;
  declare startTime: string;
  declare linkMeet: string;
  declare document: string;
  declare absenceReason: CreationOptional<string>;
  declare studyStatus: "noStarted" | "completed" | "droppedOut";
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initClass = (sequelize: Sequelize) => {
    TutoringSessions.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        tutorCourseId: {
          type: DataTypes.NUMBER,
          references: {
            model: "tutorCourses",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          allowNull: false,
        },
        tutoringDay: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        startTime: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        linkMeet: {
          type: DataTypes.STRING,
        },
        document: {
          type: DataTypes.STRING,
        },
        absenceReason: {
          type: DataTypes.TEXT,
        },
        studyStatus: {
          type: DataTypes.ENUM("noStarted", "completed", "droppedOut"),
          allowNull: false,
          defaultValue: "noStarted",
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "tutoringSessions",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        name: {
          singular: "tutoringSession",
          plural: "tutoringSessions",
        },
      }
    );
  };
}
