import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfileModal = ({ profile, onClose, onUpdate }) => {
  // const navigator = Navigate();
  const [editFormData, setEditFormData] = useState({
    profilePicture: profile.profilePicture || "",
    username: profile.username || "",
    about: profile.about || "",
    city: profile.city || "",
    state: profile.state || "",
    country: profile.country || "",
    college: profile.college || "",
    skills: profile.skills || [],
    email: profile.email || "",
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    age: profile.age || "",
    
  });

  const [newSkill, setNewSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTab, setSelectedTab] = useState("basic");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editFormData.skills.includes(newSkill.trim())) {
      setEditFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:3000/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        onUpdate(updatedProfile);
        onClose();
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setIsSubmitting(false);
    }
    // navigator("/profile");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto transition-colors">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100">
              Edit Profile
            </h2>
            <button
              onClick={onClose}
              className="text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-gray-700 mb-6">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                selectedTab === "basic"
                  ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-300"
              }`}
              onClick={() => setSelectedTab("basic")}
            >
              Basic Info
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                selectedTab === "personal"
                  ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-300"
              }`}
              onClick={() => setSelectedTab("personal")}
            >
              Personal Details
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                selectedTab === "skills"
                  ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-300"
              }`}
              onClick={() => setSelectedTab("skills")}
            >
              Skills & About
            </button>
          </div>

          <form onSubmit={handleSubmitEdit}>
            {selectedTab === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2 flex flex-col items-center">
                  <div className="relative mb-4">
                    <img
                      src={
                        editFormData.profilePicture ||
                        "https://via.placeholder.com/150"
                      }
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                    />
                    <button
                      type="button"
                      className="absolute bottom-2 right-2 bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="w-full max-w-xs">
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Profile Picture URL
                    </label>
                    <input
                      type="text"
                      name="profilePicture"
                      value={editFormData.profilePicture}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-300 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editFormData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editFormData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={editFormData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
                    required
                    readOnly = {true}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
                    required
                    readOnly = {true}
                  />
                </div>
              </div>
            )}

            {selectedTab === "personal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Title/Position
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
                    placeholder="Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={editFormData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
                    placeholder="Tech Company Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={editFormData.age}
                    onChange={handleInputChange}
                    min="16"
                    max="100"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={editFormData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    College/University
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={editFormData.college}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
                    placeholder="University Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={editFormData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={editFormData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={editFormData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
                    placeholder="United States"
                  />
                </div>
              </div>
            )}

            {selectedTab === "skills" && (
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    About Me
                  </label>
                  <textarea
                    name="about"
                    value={editFormData.about}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-300 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
                    placeholder="Tell others about yourself..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Skills & Expertise
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {editFormData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1.5 text-indigo-500 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-1 px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-700 dark:text-gray-300 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
                      placeholder="Add a new skill (e.g. JavaScript)"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 flex justify-between items-center border-t border-slate-200 dark:border-gray-700">
              <div className="text-sm text-slate-500 dark:text-gray-400">
                {selectedTab === "basic" && "Step 1 of 3: Basic Information"}
                {selectedTab === "personal" && "Step 2 of 3: Personal Details"}
                {selectedTab === "skills" && "Step 3 of 3: Skills & About"}
              </div>
              <div className="flex gap-3">
                {selectedTab !== "basic" && (
                  <button
                    type="button"
                    onClick={() => setSelectedTab(selectedTab === "skills" ? "personal" : "basic")}
                    className="px-6 py-3 text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-300 font-medium"
                  >
                    Back
                  </button>
                )}
                {selectedTab !== "skills" ? (
                  <button
                    type="button"
                    onClick={() => setSelectedTab(selectedTab === "basic" ? "personal" : "skills")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;