import { useState } from "react";
import { useUser } from "../../context/UserContext";
import Navbar from "../Navbar/navbar.jsx";

export default function LoginPage() {
  window.href = "/login"; // Set the current URL to /login
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const redirectToHome = () => {
    window.location.href = "/home"; // Redirect to the home page
  }
  const redirectToSignUp = () => {
    window.location.href = "/signup"; // Redirect to the sign-up page
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials : "include", // Include cookies for session management
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        // const user = await fetch("http://localhost:3000/home", {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   credentials : "include", // Include cookies for session management
        // })
        // const userData = await user.json();
        // // console.log("User data:", userData);
        // setUser(userData); // 🔥 update global state
        redirectToHome();
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl w-full max-w-md shadow-xl"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>

        <div className="mb-4">
          <label className="text-white block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-gray-800 focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="text-white block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-gray-800 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-lg font-semibold cursor-pointer"
        >
          Log In
        </button>
        <div className="text-center text-white pt-4 hover:text-gray-300 cursor-pointer" onClick={redirectToSignUp}>
          Don't have an account?{" "}
        </div>
      </form>
    </div>
    </>
  );
}