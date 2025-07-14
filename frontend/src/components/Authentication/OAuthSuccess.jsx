import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:3000/profile", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("username", data.username); // or however you store user info
          navigate("/home");
        } else {
          alert("OAuth login failed");
          navigate("/login");
        }
      } catch (err) {
        console.error("OAuth error:", err);
        alert("Something went wrong");
        navigate("/login");
      }
    }

    fetchUser();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen text-white text-xl">
      Logging you in via Google...
    </div>
  );
}
