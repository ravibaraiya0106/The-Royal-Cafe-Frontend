import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import ItemCard from "@/components/items/ItemCard";

const items = [
  {
    id: 1,
    name: "Cappuccino",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
  },
  {
    id: 2,
    name: "Cold Coffee",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
  },
  {
    id: 3,
    name: "Chocolate Cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
  },
  {
    id: 4,
    name: "Sandwich",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
  },
];

const Items = () => {
  return (
    <>
      <Navbar />

      <div className="mt-10 mb-10 px-4 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-brand mb-10">
          Our Menu
        </h1>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Items;
