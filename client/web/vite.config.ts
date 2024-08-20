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
	}
});
