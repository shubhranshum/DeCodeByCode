import React from 'react';

const team = [
  {
    name: 'Shubhranshu Mishra',
    role: 'Founder & Developer',
    bio: 'Passionate about building impactful web applications and fostering coding communities.',
    img: 'https://i.pravatar.cc/150?img=3'
  },
  {
    name: 'Aarav Verma',
    role: 'UI/UX Designer',
    bio: 'Creates user-friendly and magical designs that enchant users.',
    img: 'https://i.pravatar.cc/150?img=10'
  },
  {
    name: 'Meera Kapoor',
    role: 'Backend Engineer',
    bio: 'Handles the server spells and data potions with elegance and efficiency.',
    img: 'https://i.pravatar.cc/150?img=5'
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 pt-20 pb-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-purple-300">✨ About Us</h1>

        <p className="text-lg text-gray-300 mb-10 text-center">
          We are a passionate team of developers, designers, and thinkers who believe in creating platforms
          that empower people to ask, answer, and grow. Our goal is to make learning magical and engaging.
        </p>

        <h2 className="text-3xl font-semibold mb-6 text-yellow-400 text-center">🚀 Our Mission</h2>
        <p className="text-gray-400 mb-10 text-center">
          To connect curious minds and promote collaborative knowledge sharing in the most enchanting way possible.
        </p>

        <h2 className="text-3xl font-semibold mb-6 text-yellow-400 text-center">🧠 Meet the Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:scale-[1.02] transition duration-300"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 mx-auto rounded-full mb-4 border-4 border-purple-500"
              />
              <h3 className="text-xl font-bold text-purple-200">{member.name}</h3>
              <p className="text-sm text-yellow-300 mb-2">{member.role}</p>
              <p className="text-gray-400 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} MakeYourView. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
