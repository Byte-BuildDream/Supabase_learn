import { createClient } from '@/config/client';
import { UserProfile } from '@/types/userProfile';
/**
 * UserProfileService - 处理用户资料相关操作的服务。
 */
export const UserProfileService = {
  
  /**
   * 加载所有用户资料。
   * @returns {Promise<UserProfile[]>} 返回一个 Promise，解析为用户资料对象的数组。
   * @throws {Error} 如果获取用户资料时发生错误，则抛出错误。
   */
  async loadProfiles(): Promise<UserProfile[]> {
    const supabase = createClient()
    const { data, error } = await supabase.from('user_profiles').select('*');
    if (error) {
      throw new Error(`获取资料时发生错误: ${error.message}`);
    }
    return data || [];
  },
  /**
   * 在数据库中创建一个新的用户资料。
   * @param {Omit<UserProfile, 'user_id'>} userProfile - 要创建的用户资料数据。注意：不包含 user_id 字段。
   * @returns {Promise<UserProfile>} 返回一个 Promise，解析为新创建的用户资料对象。
   * @throws {Error} 如果创建用户资料时发生错误，则抛出错误。
   */
  async createProfile(userProfile: Omit<UserProfile, 'user_id'>): Promise<UserProfile> {
    try {
      const supabase = createClient();
      
      // 验证必填字段
      if (!userProfile.username?.trim()) {
        throw new Error('用户名不能为空');
      }

      // 检查用户名是否已存在
      const existingProfile = await this.fetchProfileByUsername(userProfile.username);
      if (existingProfile) {
        throw new Error('该用户名已被使用');
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([userProfile])
        .select()
        .single();

      if (error) {
        throw new Error(`创建用户资料失败: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`创建用户资料时发生错误: ${error.message}`);
      }
      throw new Error('创建用户资料时发生未知错误');
    }
  },
  /**
   * 根据用户名更新现有的用户资料。
   * @param {string} username - 要更新的用户资料的用户名。
   * @param {Partial<Omit<UserProfile, 'user_id'>>} updates - 要更新的用户资料字段。
   * @returns {Promise<UserProfile>} 返回一个 Promise，解析为更新后的用户资料对象。
   * @throws {Error} 如果更新用户资料时发生错误，则抛出错误。
   */
  async updateProfile(
    username: string, 
    updates: Partial<Omit<UserProfile, 'user_id'>>
  ): Promise<UserProfile> {
    try {
      const supabase = createClient();

      // 验证输入参数
      if (!username?.trim()) {
        throw new Error('用户名不能为空');
      }

      if (Object.keys(updates).length === 0) {
        throw new Error('没有提供要更新的字段');
      }

      // 检查用户是否存在
      const existingProfile = await this.fetchProfileByUsername(username);
      if (!existingProfile) {
        throw new Error('要更新的用户资料不存在');
      }

      // 如果更新包含用户名，检查新用户名是否已被使用
      if (updates.username && updates.username !== username) {
        const usernameExists = await this.fetchProfileByUsername(updates.username);
        if (usernameExists) {
          throw new Error('新用户名已被使用');
        }
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('username', username)
        .select()
        .single();

      if (error) {
        throw new Error(`更新用户资料失败: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`更新用户资料时发生错误: ${error.message}`);
      }
      throw new Error('更新用户资料时发生未知错误');
    }
  },
  /**
   * 根据用户名删除用户资料。
   * @param {string} username - 要删除的用户资料的用户名。
   * @returns {Promise<void>} 返回一个 Promise，当资料删除完成时解析。
   * @throws {Error} 如果删除用户资料时发生错误，则抛出错误。
   */
  async deleteProfile(username: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('user_profiles').delete().eq('username', username);
    if (error) {
      throw new Error(`删除资料时发生错误: ${error.message}`);
    }
  },
  /**
   * 根据用户名获取用户资料。
   * @param {string} username - 要获取的用户资料的用户名。
   * @returns {Promise<UserProfile | null>} 返回一个 Promise，解析为找到的用户资料对象或 null（如果未找到）。
   * @throws {Error} 如果获取用户资料时发生错误，则抛出错误。
   */
  async fetchProfileByUsername(username: string): Promise<UserProfile | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('username', username)
      .single();
    if (error) {
      throw new Error(`获取资料时发生错误: ${error.message}`);
    }
    return data;
  }
};