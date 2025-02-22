/* eslint-disable @typescript-eslint/no-unused-vars */
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tutoringSessions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tutorCourseId: {
        type: Sequelize.INTEGER,
        references: {
          model: "tutorCourses",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        allowNull: false,
      },
      tutoringDay: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      startTime: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      linkMeet: {
        type: Sequelize.STRING,
      },
      document: {
        type: Sequelize.STRING,
      },
      absenceReason: {
        type: Sequelize.TEXT,
      },
      studyStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "noStarted",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tutoringSessions");
  },
};
