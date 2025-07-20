import SubmissionCodeEditor from "@/components/Tasks/submissionCodeEditor";
import React, { useState } from "react";

const EditProfileModal = ({ profile, onClose, onUpdate }) => {
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
    title: profile.title || "",
    company: profile.company || "",
    website: profile.website || ""
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
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transition-all">
        <div className="p-5">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Edit Profile
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
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
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-5">
            {["basic", "personal", "skills"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                  selectedTab === tab
                    ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab === "basic" && "Basic Info"}
                {tab === "personal" && "Personal Details"}
                {tab === "skills" && "Skills & About"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmitEdit}>
            {selectedTab === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="md:col-span-2 flex flex-col items-center mb-3">
                  <div className="relative mb-3">
                    <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full w-28 h-28 flex items-center justify-center overflow-hidden">
                      {editFormData.profilePicture ? (
                        <img
                          src={editFormData.profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="w-full max-w-xs">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Profile Picture URL
                    </label>
                    <input
                      type="text"
                      name="profilePicture"
                      value={editFormData.profilePicture}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                      placeholder="Paste image URL"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editFormData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editFormData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={editFormData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    required
                    readOnly={true}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    required
                    readOnly={true}
                  />
                </div>
              </div>
            )}

            {selectedTab === "personal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Title/Position
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    placeholder="Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={editFormData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    placeholder="Tech Company Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={editFormData.age}
                    onChange={handleInputChange}
                    min="16"
                    max="100"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={editFormData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    College/University
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={editFormData.college}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    placeholder="University Name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={editFormData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={editFormData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={editFormData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    placeholder="United States"
                  />
                </div>
              </div>
            )}

            {selectedTab === "skills" && (
              <div className="grid grid-cols-1 gap-4 mb-5">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    About Me
                  </label>
                  <textarea
                    name="about"
                    value={editFormData.about}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    placeholder="Tell others about yourself..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Skills & Expertise
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {editFormData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1.5 text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-200"
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
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                      placeholder="Add a new skill"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-lg flex items-center transition-colors"
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

            <div className="pt-5 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {selectedTab === "basic" && "Step 1 of 3"}
                {selectedTab === "personal" && "Step 2 of 3"}
                {selectedTab === "skills" && "Step 3 of 3"}
              </div>
              <div className="flex gap-2">
                {selectedTab !== "basic" && (
                  <button
                    type="button"
                    onClick={() => setSelectedTab(selectedTab === "skills" ? "personal" : "basic")}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg font-medium transition-colors"
                  >
                    Back
                  </button>
                )}
                {selectedTab !== "skills" ? (
                  <button
                    type="button"
                    onClick={() => setSelectedTab(selectedTab === "basic" ? "personal" : "skills")
                      
                    }
                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    
                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center"
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