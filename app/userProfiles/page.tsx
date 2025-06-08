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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">用户资料管理</h1>
        
        {/* 创建表单 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">创建新用户</h2>
          <form onSubmit={createProfile} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                placeholder="个人简介"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              创建
            </button>
          </form>
        </section>

        {/* 获取单个用户资料 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">查询用户资料</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="输入用户名"
              value={fetchUsername}
              onChange={(e) => setFetchUsername(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={fetchProfile}
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
            >
              查询
            </button>
          </div>
          {fetchedProfile && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <pre className="text-sm text-gray-700">
                {JSON.stringify(fetchedProfile, null, 2)}
              </pre>
            </div>
          )}
        </section>

        {/* 更新表单 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">更新用户资料</h2>
          <form onSubmit={updateProfile} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="要更新的用户名"
                value={updateUsername}
                onChange={(e) => setUpdateUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                placeholder="新的个人简介"
                value={updateBio}
                onChange={(e) => setUpdateBio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
            >
              更新
            </button>
          </form>
        </section>

        {/* 用户资料列表 */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">所有用户资料</h2>
          {profiles.length === 0 ? (
            <p className="text-gray-500 text-center py-4">暂无用户资料</p>
          ) : (
            <div className="space-y-4">
              {profiles.map((p) => (
                <div
                  key={p.user_id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{p.username}</h3>
                    <p className="text-gray-600">{p.bio}</p>
                  </div>
                  <button
                    onClick={() => deleteProfile(p.username)}
                    className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
