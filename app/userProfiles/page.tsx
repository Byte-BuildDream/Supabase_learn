'use client'
import React, { useEffect, useState } from 'react';
import { UserProfileService } from '@/lib/userProfile';
import { UserProfile } from '@/types/userProfile';

export default function UserProfilesPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'create' | 'search' | 'list'>('list');
  
  // 表单状态
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatar_url: '',
    date_of_birth: '',
    gender: 0,
    address: '',
    city: '',
    state: '',
    country: '',
    website: '',
    occupation: '',
    interests: [] as string[],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  // 加载所有用户资料
  const loadProfiles = async () => {
    try {
      setIsLoading(true);
      const profiles = await UserProfileService.loadProfiles();
      setProfiles(profiles);
    } catch (error) {
      console.error(error);
      alert('加载用户资料失败: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  // 创建用户资料
  const createProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await UserProfileService.createProfile(formData);
      alert('用户资料创建成功');
      setFormData({
        username: '',
        bio: '',
        avatar_url: '',
        date_of_birth: '',
        gender: 0,
        address: '',
        city: '',
        state: '',
        country: '',
        website: '',
        occupation: '',
        interests: [],
      });
      loadProfiles();
      setActiveTab('list');
    } catch (error) {
      console.error(error);
      alert('创建失败: ' + error);
    }
  };

  // 更新用户资料
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;
    try {
      await UserProfileService.updateProfile(selectedProfile.username, formData);
      alert('用户资料更新成功');
      loadProfiles();
      setSelectedProfile(null);
    } catch (error) {
      console.error(error);
      alert('更新失败: ' + error);
    }
  };

  // 删除用户资料
  const deleteProfile = async (username: string) => {
    if (!window.confirm(`确定要删除用户 ${username} 的资料吗？`)) return;
    try {
      await UserProfileService.deleteProfile(username);
      alert('用户资料删除成功');
      loadProfiles();
    } catch (error) {
      console.error(error);
      alert('删除失败: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            用户资料管理
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'create'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              创建用户
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'search'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              搜索用户
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              用户列表
            </button>
          </div>
        </div>

        {activeTab === 'create' && (
          <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-purple-400">创建新用户</h2>
            <form onSubmit={createProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">用户名</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">头像URL</label>
                  <input
                    type="url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">出生日期</label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">性别</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value={0}>未指定</option>
                    <option value={1}>男</option>
                    <option value={2}>女</option>
                    <option value={3}>其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">职业</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">个人网站</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">个人简介</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">地址</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">城市</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">国家</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">兴趣爱好</label>
                <input
                  type="text"
                  placeholder="用逗号分隔多个兴趣"
                  value={formData.interests.join(', ')}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value.split(',').map(i => i.trim()) })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors"
              >
                创建用户
              </button>
            </form>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-purple-400">搜索用户</h2>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="输入用户名搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                onClick={() => {
                  const profile = profiles.find(p => p.username.toLowerCase().includes(searchQuery.toLowerCase()));
                  setSelectedProfile(profile || null);
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                搜索
              </button>
            </div>

            {selectedProfile && (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400">{selectedProfile.username}</h3>
                    <p className="text-gray-400">{selectedProfile.occupation}</p>
                  </div>
                  <button
                    onClick={() => deleteProfile(selectedProfile.username)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    删除
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">个人简介</p>
                    <p className="text-white">{selectedProfile.bio}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">所在地</p>
                    <p className="text-white">
                      {[selectedProfile.city, selectedProfile.state, selectedProfile.country]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'list' && (
          <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-purple-400">用户列表</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              </div>
            ) : profiles.length === 0 ? (
              <p className="text-gray-400 text-center py-8">暂无用户资料</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                  <div
                    key={profile.user_id}
                    className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-purple-400">{profile.username}</h3>
                        {profile.occupation && (
                          <p className="text-gray-400 text-sm">{profile.occupation}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteProfile(profile.username)}
                        className="text-red-400 hover:text-red-300"
                      >
                        删除
                      </button>
                    </div>
                    
                    {profile.bio && (
                      <p className="text-gray-300 text-sm mb-4">{profile.bio}</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {profile.city && (
                        <div>
                          <span className="text-gray-400">城市：</span>
                          <span className="text-white">{profile.city}</span>
                        </div>
                      )}
                      {profile.country && (
                        <div>
                          <span className="text-gray-400">国家：</span>
                          <span className="text-white">{profile.country}</span>
                        </div>
                      )}
                    </div>

                    {profile.interests && profile.interests.length > 0 && (
                      <div className="mt-4">
                        <p className="text-gray-400 text-sm mb-2">兴趣爱好：</p>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-900 text-purple-300 rounded-full text-xs"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
