// components/contact/ContactHero.tsx

type Props = {
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
};

const ContactHero = ({ title, description, image, reverse }: Props) => {
  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <div
        className={`grid md:grid-cols-2 gap-10 items-center ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* IMAGE */}
        <div>
          <img
            src={image}
            className="rounded-2xl shadow-lg w-full"
            alt="section"
          />
        </div>

        {/* TEXT */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>

          <p className="mt-4 text-gray-600">{description}</p>

          <ul className="mt-6 space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              ✓ Quick response within hours
            </li>
            <li className="flex items-center gap-2">
              ✓ Friendly customer support
            </li>
            <li className="flex items-center gap-2">✓ Available every day</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactHero;
