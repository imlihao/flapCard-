import { HttpClient } from 'tsrpc-miniapp';
import { serviceProto } from './shared/protocols/serviceProto';

// 创建全局唯一的 apiClient，需要时从该文件引入
export const apiClient = new HttpClient(serviceProto, {
  server: 'https://xxx.com/api',
  json: true,
});