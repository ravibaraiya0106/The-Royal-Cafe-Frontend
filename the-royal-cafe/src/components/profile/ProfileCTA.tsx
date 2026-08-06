import { Link } from "react-router-dom";

type Props = {
  title?: string;
  description?: string;
  buttonText?: string;
  redirectTo: string;
};

const ProfileCTA = ({
  title = "Ready for your next order?",
  description = "Explore our delicious menu and enjoy the royal taste again.",
  buttonText = "Explore Menu",
  redirectTo,
}: Props) => {
  return (
    <section className="py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        {/* TITLE */}
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>

        {/* DESCRIPTION */}
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">{description}</p>

        {/* BUTTON */}
        <Link
          to={redirectTo}
          className="inline-block mt-6 bg-brand text-white px-6 py-3 rounded-[5px] hover:opacity-90 transition"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
};

export default ProfileCTA;
