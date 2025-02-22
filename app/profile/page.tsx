/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function ProfilePage() {
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    email: session?.user?.email,
    image: null,
    description: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const getInfo = async () => {
    const response = await fetch(`/api/infos`, {
      headers: {
        Authorization: `Bearer ${(session as any)?.token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setFormData({
        email: data.data.email,
        image:
          data.data.infos.length > 0
            ? data.data.infos[0].image
            : data.data.avatar,
        description:
          data.data.infos.length > 0 ? data.data.infos[0].description : "",
      });
      setImagePreview(
        data.data.infos.length > 0 ? data.data.infos[0].image : data.data.avatar
      );
    }
  };

  const handleChange = (event: any) => {
    const { name, value, files } = event.target;
    if (name === "image") {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [name]: reader.result });
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const response = await fetch("/api/infos", {
      method: "PUT",
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      alert("Cập nhật thông tin thành công");
    } else {
      alert("Cập nhật thông tin thất bại");
    }
  };

  useEffect(() => {
    if (session && (session as any).token) getInfo();
  }, [session]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Thông Tin Cá Nhân</h2>
      <div className="flex items-center space-x-4">
        <img
          src={
            imagePreview ||
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwcHBg0NBwgREBAJDQoNCwoKDRUIEQ8KFxEiFhURExMYKCgsGBolGxMTITEhJSk3Oi4uFx8zOD8sNygtLisBCgoKDQ0NDg0NDi0dHxkrKysrKystKysrKysrLS0rKysrKystKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAM0A0QMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAgUBBAYDB//EADQQAQACAgECAgcHAwUBAAAAAAABAgMRBAUhMUESIjJRcXKRFUJTYZKisTShwRMzUoHhJP/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABcRAQEBAQAAAAAAAAAAAAAAAAABESH/2gAMAwEAAhEDEQA/APoGLFjw4q0w1itcda1rSsejEVjyTBpkAAAAAAAAAAAAAAAAAAAAAAAAAFABAAAAAAAAAAAAAAAAAAAAAAAAAAUAEAAAAAAAAAAAAAAAAAAAAAAAAABQAQAAAAAAA8QGxg4XJz+xTt/yt6sLHp3Ta1iL543M94pPhC0iIiO0JauKanRrzHr5Ij4R6SU9F7ds/wC3/wBW4auKHL0rkUj1NW/KJ7tK+O+O2r11MeUurePI42LkV1kj4W84NTHMDY5nFtxcup8J71t74a6oAAAAAAAAACgAgAAAAAA3+k8aM2f0rx2p3+Nmg6HpWOMfDr29vvKUjcARoAAABr87jxyMExMd4jdZ/NzUxMT38uzrXOdTxxj5ltR7XeFiVqgKgAAAAAAAKACAAAAAADqcFYrirEeUVhyzq6Tuka90JViQCKAAAAKXrldZaT762j6LpT9en18f5Rf/AAsSqoBUAAAAAAABQAQAAAAAAdNwrxk4tJ99e7mVv0Xkbiccz4d6pVi2ARQAAABRdayelytR9yP3LrLeuPHNreFYmZcxnyWy5bWn707WJUAFQAAAAAAAFABAAAAAABLFkthyRak96ztEB03E5FOTii1Z+aPdL3cvxuRk42T0sc/GPKarvi9RwZ49afRn3W9WEsWVuhExMdhFCfB55c2LDG8l4j4yqOd1OckTXB2jwm3nKjPVuZF5/wBPHPaJ9aY85VgKyAAAAAAAAACgAgAAAAAAPbFxORm/28c/HybVOkcifamI/cauK8Wn2Nf8aPpJ9i3/ABo/SbDFfTkZqexkmPhKc8zlTHfNb6t37Fv+NH6T7Fv+NH6U2HVZa1rT60/VhafYt/xo/SfYt/xo/SuwVYs56NliO2SPp6Lwy9N5WOO1d/L6xpjTEr0vSdXrrXlKIgAAAAAAAKACAAANrgcO3Kyd/Zr7Ug8+LxMvJtqkdvO0+ELrjdNwYe8x6Ux528G1ix0xU9HHGohNLVw1qOwCKAAAAAAAA882HHmrrJTfxVPM6Vakelx53Ed5pPiuhdHJTExPePDxiRe9Q4Fc9ZtjjVo+kqK0TWdTHeO0xKy6yAAAAACgAgAD04+G2fLFax4z3/KrpcGKuHHFaR7MfVXdGwxXHOSY729WPlWe0qxLZtHZtFZ2bY2bBI2js2CWzaOzYJbNo7Ngls2js2DO2do7NgltU9Y4ka/1aR88R/K02jetb0mLR2tFon4LODlh6cnFOHPas/dn9rzVkAAAFABAiNz2Hpxo3npE+dqx/cHQ8ekY8Nax92unojvszuUVkY2xsEhHZsEhHZsEhjZsGRHZsEhHbOwZEdmwSGNsbBU9ax6zVtH362if+lcuOsxE4Kz7p1/ZTrEAAABQAQevE/qsfz0/l5PTi/1NPmr/ACDotm0RFS2bRAS2bRAS2bRAS2bRAS2bRAS2bRAS2bRAS2bRAafV5/8Alj56/wASp1v1b+nj5q/5VCxAAAAXH//Z"
          }
          alt="Profile"
          className="w-32 h-32 rounded-full border-2 border-gray-300"
        />
        <div>
          <p className="text-lg font-semibold">
            {session?.user?.name || "Tên người dùng"}
          </p>
          <p className="text-gray-600">
            {session?.user?.email || "Email người dùng"}
          </p>
        </div>
      </div>
      {/* Add more update info user  */}
      <form className="mt-4" onSubmit={handleSubmit}>
        <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">
          Avatar
        </label>
        <input
          type="file"
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={handleChange}
          name="image"
          required
        />
        <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">
          Mô tả
        </label>
        <textarea
          placeholder="Mô tả"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={formData.description}
          onChange={handleChange}
          name="description"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 mt-4 rounded-md"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
