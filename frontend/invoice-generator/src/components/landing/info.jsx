import React from "react";

const PersonalInfo = () => {
  return (
    <section
      id="info"
      className="py-24 lg:py-32 bg-gradient-to-br from-blue-100 via-white to-purple-50"
    >
      <div className="max-w-2xl mx-auto px-6">
        <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 flex flex-col items-center text-center border border-gray-100 hover:shadow-blue-200 transition-shadow duration-300">
          {/* Profile Glow */}
          <div className="absolute -top-12 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400 to-violet-500 blur-2xl opacity-30"></div>

          {/* Name */}
          <h2 className="text-3xl font-extrabold text-blue-900 mb-1">
            Hrishikesh Badgujar
          </h2>

          {/* Title */}
          <p className="text-lg text-gray-700 font-medium mb-6">
            AI & Full Stack Developer | Problem Solver | Tech Innovator
          </p>

          {/* Education */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl px-6 py-3 mb-8 w-fit mx-auto border border-blue-200">
            <span className="block font-semibold text-blue-900">
              B-Tech, Computer Science
            </span>
            <span className="block text-blue-700">Ajeenkya DY Patil University, Pune</span>
          </div>

          {/* Skills Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { name: "GenAI", color: "green" },
              { name: "MERN Stack", color: "blue" },
              { name: "Python", color: "yellow" },
              { name: "Prompt Engineering", color: "pink" },
            ].map((skill) => (
              <span
                key={skill.name}
                className={`inline-block bg-${skill.color}-100 text-${skill.color}-800 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm hover:scale-105 transition-transform`}
              >
                {skill.name}
              </span>
            ))}
          </div>

          {/* Contact Info */}
          <div className="text-gray-700 space-y-2">
            <p>
              <span className="font-semibold text-gray-600">📞 Phone:</span>{" "}
              <a
                href="tel:XXXXXXXXXX"
                className="text-blue-800 underline hover:text-blue-900"
              >
                9404755864
              </a>
            </p>
            
          </div>

          {/* Decorative Gradient Line */}
          <div className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default PersonalInfo;
