import { Request, Response } from 'express';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';

const handleProxyErrors = (err: any, req: Request, res: Response | any) => {
  console.error('Proxy error:', err);
  if (res.status !== null) {
    res.status(500).json({ error: 'Proxy error', details: err.message });
  } else {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Proxy error', details: err.message }));
  }
};

export const createDropboxProxy = (target: string,) => createProxyMiddleware({
  target: target,
  changeOrigin: true,
  on: {
    error: handleProxyErrors
  },
});
