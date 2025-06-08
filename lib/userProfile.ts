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
  async createProfile(userProfile: Omit<UserProfile, 'user_id'>): Promise<UserProfile | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from('user_profiles').insert([userProfile]);
    if (error) {
      return null;
    }
    if(data){
        return data[0];
    }
    return null;  // 返回新插入的用户资料
  },
  /**
   * 根据用户名更新现有的用户资料。
   * @param {string} username - 要更新的用户资料的用户名。
   * @param {Partial<Omit<UserProfile, 'user_id'>>} updates - 要更新的用户资料字段。
   * @returns {Promise<UserProfile>} 返回一个 Promise，解析为更新后的用户资料对象。
   * @throws {Error} 如果更新用户资料时发生错误，则抛出错误。
   */
  async updateProfile(username: string, updates: Partial<Omit<UserProfile, 'user_id'>>): Promise<UserProfile | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('username', username);
    if (error) {
      throw new Error(`更新资料时发生错误: ${error.message}`);
    }
    if(data){
        return data[0];
    }
    return null;   // 返回更新后的用户资料
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