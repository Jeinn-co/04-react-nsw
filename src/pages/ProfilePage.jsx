import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setNewName(data.username);
      });
  }, []);

  const handleUpdate = async () => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newName })
    });
    const data = await res.json();
    if (res.ok) setProfile(data);
    else alert(data.error);
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Profile</h2>
      <p>Current Username: {profile.username}</p>
      <img src={profile.avatar} alt="avatar" />
      <div style={{ marginTop: '10px' }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleUpdate} style={{ marginLeft: '10px' }}>
          Update Profile
        </button>
      </div>
    </div>
  );
}
