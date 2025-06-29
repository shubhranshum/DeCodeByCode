import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Navbar from "./Navbar/navbar";
import { useUser } from "../context/userContext";

export default function LandingPage() {
  window.href = "/";
  const { user } = useUser();
    const goToSignUp = () => {
      if(!user) window.location.href = "/signup";
      else window.location.href = "/home";
    }
  return (
    <>
    <Navbar activePage={""}/>
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white flex flex-col items-center justify-center px-6">
      {/* Animated Header */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-extrabold text-center mb-6"
      >
        Welcome to <span className="text-orange-400">CodeVerse</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-10"
      >
        Your ultimate hub for Competitive Programming – practice problems, contests, discussions, and progress tracking, all in one place.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="flex gap-4"
      >
        <Button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 text-lg font-medium rounded-xl" onClick = {goToSignUp}>
          Get Started
        </Button>
        <Button variant="outline" className="border-white text-black px-6 py-3 font-medium rounded-xl">
          Learn More
        </Button>
      </motion.div>

      {/* Footer Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 2, delay: 2 }}
        className="text-sm text-gray-400 mt-16"
      >
        Built with 💙 by Competitive Programmers for Competitive Programmers.
      </motion.p>
    </main>
    </>
  );
}
