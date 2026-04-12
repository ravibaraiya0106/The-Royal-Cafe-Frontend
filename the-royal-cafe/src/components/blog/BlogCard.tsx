import { Link } from "react-router-dom";
import { PrimaryButton } from "../common/form/Button";

type Blog = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <Link
      to={`/blogs/${blog.id}`}
      className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
    >
      {/* Image */}
      <div className="w-full md:w-60 h-60 md:h-60 flex-shrink-0 overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={blog.image}
          alt={blog.title}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-5 flex-1">
        <div>
          <h5 className="mb-2 text-xl font-bold text-gray-800">{blog.title}</h5>

          <p className="mb-4 text-gray-600 text-sm line-clamp-3">
            {blog.description}
          </p>
        </div>

        <PrimaryButton label="Read More" fullWidth={false} />
      </div>
    </Link>
  );
};

export default BlogCard;
