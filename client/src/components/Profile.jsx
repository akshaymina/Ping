import { useEffect, useState } from "react";

function Profile() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile.");
        }

        setEmail(data.user.email || "N/A");
        console.log(data.user.email);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Cleanup: abort fetch on unmount
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Profile</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2>Profile</h2>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <p>Email: {email}</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "16px",
    fontFamily: "sans-serif",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  error: {
    color: "red",
  },
};

export default Profile;
