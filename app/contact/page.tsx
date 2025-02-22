/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Xử lý logic gửi form ở đây, ví dụ gửi tới backend hoặc API
    console.log("Form data submitted:", formData);
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="container mx-auto px-6 py-12 bg-gray-100 rounded-lg shadow-lg">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Liên Hệ
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tên */}
          <div>
            <label
              className="block text-lg font-medium text-gray-700 mb-2"
              htmlFor="name"
            >
              Họ và tên
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition duration-200 ease-in-out"
              placeholder="Nhập họ và tên của bạn"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="block text-lg font-medium text-gray-700 mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition duration-200 ease-in-out"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Chủ đề */}
          <div>
            <label
              className="block text-lg font-medium text-gray-700 mb-2"
              htmlFor="subject"
            >
              Chủ đề
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition duration-200 ease-in-out"
              placeholder="Nhập chủ đề"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          {/* Tin nhắn */}
          <div>
            <label
              className="block text-lg font-medium text-gray-700 mb-2"
              htmlFor="message"
            >
              Tin nhắn
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition duration-200 ease-in-out"
              placeholder="Nhập tin nhắn của bạn"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Nút gửi */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105"
            >
              Gửi tin nhắn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;
