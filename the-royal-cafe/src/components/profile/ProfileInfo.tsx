type Props = {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone_no?: string;
    [key: string]: unknown;
  };
};

const ProfileInfo = ({ user }: Props) => {
  return (
    <section className="py-10">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* TEXT */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Your Profile Information
            </h2>

            <div className="mt-6 space-y-3 text-gray-700">
              <p>
                <strong>Name:</strong> {user.first_name} {user.last_name}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p>
                <strong>Phone:</strong> {user.phone_no || "-"}
              </p>
            </div>
          </div>

          {/* IMAGE */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
              className="rounded-2xl shadow-lg w-full"
              alt="Cafe"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileInfo;
