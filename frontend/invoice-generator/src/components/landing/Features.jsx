import { FEATURES } from "../../utils/data";

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <header className="text-center mb-20">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-3">
            Powerful Features to Run Your Business
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Everything you need to manage your invoicing and get paid.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <feature.icon className="w-10 h-10 text-blue-700" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
