import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import unocss from 'unocss/vite';
import path from 'path';
import CompressionPlugin from 'vite-plugin-compression';
import removeConsole from 'vite-plugin-remove-console';
import { visualizer } from "rollup-plugin-visualizer"
export default defineConfig({
	plugins: [
		react(),
		removeConsole(),
		unocss({
			theme: {
				colors: {
					card: {
						foreground: 'hsl(var(--card-foreground))'
					},
					header: {
						DEFAULT: 'hsl(var(--header))'
					},
					primary: {
						DEFAULT: 'hsl(var(--primary))'
					}
				}
			}
		}),
		CompressionPlugin({
			verbose: true,
			threshold: 1025,
			filter: /\.(js|mjs|json|css|html)$/i,
			disable: false,
			algorithm: 'gzip',
			ext: '.gz',
			compressionOptions: { level: 7 },
			deleteOriginFile: false
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	server: {
		proxy: {
			// user
			'/api/v1': {
				target: 'http://127.0.0.1:40001',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/v1/, '/api')
			},
			// ssl
			'/api/v2': {
				target: 'http://127.0.0.1:40002',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/v2/, '/api')
			},
			// tenapi
			'/api/v3': {
				target: 'https://tenapi.cn',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/v3/, '')
			}
		}
	},
	build: {
		outDir: path.resolve(__dirname, '../../dist/client'),
		chunkSizeWarningLimit: 500,
		cssCodeSplit: true,
		assetsInlineLimit: 10000,
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		},
	}
});
