import { useState } from "react";

export default function SignUpPage() {
  window.href = "/signup"; // Ensure the URL is set correctly for the signup page
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const redirectToLogin = () => {
    window.location.href = "/login"; // Redirect to the login page
  }



  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log(formData.password, formData.confirmPassword);
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          college: formData.college || ""
        }),
        credentials: "include", // Include cookies for session management
      });
      const data = await response.json();
      if (response.ok) {
        alert("User registered successfully!");
       redirectToLogin();
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-6">
      <form
        onSubmit={handleSignUp}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl w-full max-w-md shadow-xl"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">Sign Up</h2>

        <div className="mb-4">
          <label className="text-white block mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-gray-800 focus:outline-none"
          />
        </div>

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

        <div className="mb-4">
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

        <div className="mb-4">
          <label className="text-white block mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-gray-800 focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="text-white block mb-1">College <span className="text-sm text-gray-300">(Optional)</span></label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-gray-800 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-lg font-semibold cursor-pointer"
        >
          Sign In
        </button>
        <div className="text-center text-white pt-4 hover:text-gray-300 cursor-pointer" onClick={redirectToLogin}>
          Already Have an account?{" "}
        </div>
      </form>
    </div>
  );
}