import Link from "next/link";

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    totalRate: number;
    user: {
      username: string;
      email: string;
    };
  };
}

export default function CourseCard(props: CourseCardProps) {
  return (
    <Link
      href={`/courses/${props.course.id}`}
      className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105"
    >
      <img
        src={props.course.thumbnail}
        alt={props.course.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-bold mb-2">{props.course.title}</h3>
      <p className="text-gray-600 mb-2">Gia sư: {props.course.user.username}</p>
      <p className="text-gray-700 mb-2">Email: {props.course.user.email}</p>
      <p className="text-gray-800 font-bold mb-2">
        {props.course.price.toLocaleString()} VND
      </p>
      <p className="text-yellow-500">Đánh giá: {props.course.totalRate} ⭐</p>
    </Link>
  );
}
