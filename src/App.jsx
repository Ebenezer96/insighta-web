import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api/v1";

function App() {
  const [profiles, setProfiles] = useState([]);
  const [query, setQuery] = useState("");

  const fetchProfiles = async () => {
    try {
      const res = await axios.get(`${API}/profiles/`, {
        withCredentials: true,
      });

      setProfiles(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const searchProfiles = async () => {
    try {
      const res = await axios.get(`${API}/profiles/search/`, {
        params: { q: query },
        withCredentials: true,
      });

      setProfiles(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const login = () => {
    window.location.href = `${API}/web/auth/github/login/`;
  };

  const logout = async () => {
    await axios.post(`${API}/web/auth/logout/`, {}, { withCredentials: true });
    window.location.reload();
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Insighta Dashboard</h1>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={login}>Login</button>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search (e.g. female adult in nigeria)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchProfiles}>Search</button>
      </div>

      <button
        onClick={() => {
          window.location.href = `${API}/profiles/export/`;
        }}
      >
        Export CSV
      </button>

      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
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
          {profiles.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.gender}</td>
              <td>{p.age}</td>
              <td>{p.age_group}</td>
              <td>{p.country_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;