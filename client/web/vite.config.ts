import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import unocss from 'unocss/vite';
import path from 'path';
export default defineConfig({
	plugins: [
		react(),
		unocss({
			theme: {
				colors: {
					card: {
						foreground: 'hsl(var(--card-foreground))'
					},
					header: {
						DEFAULT: 'hsl(var(--header))'
					}
				}
			}
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	server: {
		proxy: {
			'/api/v1': {
				target: 'http://127.0.0.1:40001',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/v1/, '/api')
			}
		}
	}
});
