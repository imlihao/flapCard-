import { WsClient } from 'tsrpc-browser';
import { serviceProto } from './protocols/serviceProto';

// 创建客户端
export const client = new WsClient(serviceProto, {
  server: 'ws://127.0.0.1:3000',
  json: true,
});

// 连接
client.connect().then((res) => {
  // 连接不一定成功（例如网络错误），所以要记得错误处理
  if (!res.isSucc) {
    console.log(res.errMsg);
  }
});