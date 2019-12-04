const dev = process.env.NODE_ENV !== 'production';

export const server = dev ? 'http://localhost:5678' : 'https://niello.now.sh';
