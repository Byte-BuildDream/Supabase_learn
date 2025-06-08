'use client'
import React, { useEffect, useState } from 'react';
import { UserProfileService } from '@/lib/userProfile';
import { UserProfile } from '@/types/userProfile';
export default function UserProfilesPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [fetchUsername, setFetchUsername] = useState('');
  const [fetchedProfile, setFetchedProfile] = useState<UserProfile | null>(null);
  const [updateUsername, setUpdateUsername] = useState('');
  const [updateBio, setUpdateBio] = useState('');
  // 加载所有用户资料
  const loadProfiles = async () => {
    try {
      const profiles = await UserProfileService.loadProfiles();
      setProfiles(profiles);
    } catch (error) {
      console.error(error);
      alert('Error loading profiles: ' + error);
    }
  };
  useEffect(() => {
    loadProfiles();
  }, []);
  // 创建用户资料
  const createProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return alert('Username is required');
    try {
      await UserProfileService.createProfile({ username, bio });
      alert('Profile created successfully');
      // 重置表单
      setUsername('');
      setBio('');
      loadProfiles();
    } catch (error) {
      console.error(error);
      alert('Create error: ' + error);
    }
  };
  // 获取单个用户资料
  const fetchProfile = async () => {
    if (!fetchUsername) return alert('Please enter username');
    try {
      const profile = await UserProfileService.fetchProfileByUsername(fetchUsername);
      setFetchedProfile(profile);
    } catch (error) {
      console.error(error);
      alert('Fetch error: ' + error);
      setFetchedProfile(null);
    }
  };
  // 更新用户资料
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateUsername) return alert('Username required to update');
    try {
      await UserProfileService.updateProfile(updateUsername, { bio: updateBio });
      alert('Profile updated successfully');
      // 重置表单
      setUpdateUsername('');
      setUpdateBio('');
      loadProfiles();
    } catch (error) {
      console.error(error);
      alert('Update error: ' + error);
    }
  };
  // 删除用户资料
  const deleteProfile = async (username: string) => {
    if (!window.confirm(`Are you sure you want to delete the profile for ${username}?`)) return;
    try {
      await UserProfileService.deleteProfile(username);
      alert('Profile deleted successfully');
      loadProfiles();
    } catch (error) {
      console.error(error);
      alert('Delete error: ' + error);
    }
  };
  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>User Profiles CRUD</h1>
      {/* 创建表单 */}
      <section>
        <h2>Create Profile</h2>
        <form onSubmit={createProfile}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          <button type="submit">Create</button>
        </form>
      </section>
      {/* 获取单个用户资料 */}
      <section style={{ marginTop: 20 }}>
        <h2>Fetch Profile</h2>
        <input
          type="text"
          placeholder="Username"
          value={fetchUsername}
          onChange={(e) => setFetchUsername(e.target.value)}
        />
        <button onClick={fetchProfile}>Fetch</button>
        {fetchedProfile && (
          <pre style={{ background: '#eee', padding: 10, marginTop: 10 }}>
            {JSON.stringify(fetchedProfile, null, 2)}
          </pre>
        )}
      </section>
      {/* 更新表单 */}
      <section style={{ marginTop: 20 }}>
        <h2>Update Profile</h2>
        <form onSubmit={updateProfile}>
          <input
            type="text"
            placeholder="Username (to update)"
            value={updateUsername}
            onChange={(e) => setUpdateUsername(e.target.value)}
            required
          />
          <input
            placeholder="New Bio"
            value={updateBio}
            onChange={(e) => setUpdateBio(e.target.value)}
          />
          <button type="submit">Update</button>
        </form>
      </section>
      {/* 用户资料列表（可删除） */}
      <section style={{ marginTop: 20 }}>
        <h2>All User Profiles</h2>
        {profiles.length === 0 && <p>No profiles found.</p>}
        <ul>
          {profiles.map((p) => (
            <li key={p.user_id}>
              <strong>{p.username}</strong> - {p.bio} {' '}
              <button onClick={() => deleteProfile(p.username)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
