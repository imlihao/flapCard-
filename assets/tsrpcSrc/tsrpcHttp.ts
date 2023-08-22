import { HttpClient } from 'tsrpc-browser';
import { serviceProto } from './protocols/serviceProto';

// 创建全局唯一的 apiClient，需要时从该文件引入
export const apiClient = new HttpClient(serviceProto, {
  server: 'https://127.0.0.1:3000',
  json: true,
});