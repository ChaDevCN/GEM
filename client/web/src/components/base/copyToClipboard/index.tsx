import { CopyToClipboard } from 'react-copy-to-clipboard';

import { CopyOutlined } from '@ant-design/icons';
import { message } from 'antd';
export const Copy = ({ text }: { text: string }) => {
	return (
		<div className="flex items-center gap-2 text-lg">
			<span>{text}</span>
			<CopyToClipboard
				text={text || '复制失败'}
				onCopy={() => message.success('复制成功')}
			>
				<CopyOutlined className="inline-block align-text-bottom" />
			</CopyToClipboard>
		</div>
	);
};
