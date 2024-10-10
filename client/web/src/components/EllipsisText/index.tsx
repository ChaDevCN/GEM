import { Tooltip } from 'antd';
export const EllipsisText = ({
	text,
	children
}: {
	text: string;
	children: React.ReactNode;
}) => (
	<Tooltip placement="top" title={text}>
		{children}
	</Tooltip>
);
