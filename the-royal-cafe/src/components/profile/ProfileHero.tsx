type Props = {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone_no?: string;
    [key: string]: unknown;
  };
};

const ProfileHero = ({ user }: Props) => {
  const getAvatar = () => {
    return `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=6b0f0f&color=fff&size=512`;
  };

  return (
    <section className="py-10">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* AVATAR */}
          <div className="flex justify-center md:justify-start">
            <img
              src={getAvatar()}
              className="rounded-[500px] shadow-lg w-48 h-48 md:w-64 md:h-64 object-cover"
              alt="User Avatar"
            />
          </div>

          {/* TEXT */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.first_name}
            </h2>

            <p className="mt-4 text-gray-600">
              This is your personal space at The Royal Cafe.
            </p>

            <ul className="mt-6 space-y-3 text-gray-700">
              <li>✓ Personalized experience</li>
              <li>✓ Fast & secure account</li>
              <li>✓ Order tracking & history</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHero;
