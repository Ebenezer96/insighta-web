import { useEffect, useState } from "react";
import axios from "axios";

// Use environment variable (best practice for Vercel)
const API = import.meta.env.VITE_API_BASE_URL + "/api/v1";

function App() {
  const [profiles, setProfiles] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all profiles
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/profiles/`, {
        withCredentials: true,
      });

      setProfiles(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search profiles
  const searchProfiles = async () => {
    if (!query.trim()) {
      fetchProfiles();
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API}/profiles/search/`, {
        params: { q: query },
        withCredentials: true,
      });

      setProfiles(res.data.data || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // GitHub login
  const login = () => {
    window.location.href = `${API}/web/auth/github/login/`;
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post(
        `${API}/web/auth/logout/`,
        {},
        { withCredentials: true }
      );
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Export CSV (fixed)
  const exportCSV = async () => {
    try {
      const res = await axios.get(`${API}/profiles/export/`, {
        withCredentials: true,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "profiles.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Insighta Dashboard</h1>

      {/* Auth Buttons */}
      <div style={{ marginBottom: "15px" }}>
        <button onClick={login} style={{ marginRight: "10px" }}>
          Login
        </button>
        <button onClick={logout}>Logout</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search (e.g. female adult in nigeria)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={searchProfiles}>Search</button>
      </div>

      {/* Export */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={exportCSV}>Export CSV</button>
      </div>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Table */}
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Age Group</th>
            <th>Country</th>
          </tr>
        </thead>

        <tbody>
          {profiles.length > 0 ? (
            profiles.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.gender}</td>
                <td>{p.age}</td>
                <td>{p.age_group}</td>
                <td>{p.country_name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;