import { useCallback } from 'react';

import { saveAs } from 'file-saver';
import JSZip from 'jszip';

interface Options {
	certificate: string;
	privateKey: string;
	filename: string;
}

export const useKeyZipDownloader = () => {
	const downloadZip = useCallback(
		async ({ certificate, privateKey, filename }: Options) => {
			const zip = new JSZip();
			zip.file('public_key.pem', certificate);
			zip.file('private_key.pem', privateKey);
			const content = await zip.generateAsync({ type: 'blob' });
			saveAs(content, `${filename}.zip`);
		},
		[]
	);
	return downloadZip;
};
