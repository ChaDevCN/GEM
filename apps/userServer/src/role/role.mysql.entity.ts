import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

@Entity()
export class Role {
	@PrimaryGeneratedColumn()
	id?: number;
	@Column()
	name: string;

	@Column()
	systemId: number;

	@Column()
	systemName: string;

	@Column()
	creatorId?: number;

	@Column()
	creatorName?: string;

	@Column()
	updateId?: number;

	@Column()
	updateName?: string;

	@Column({ type: 'text', default: null })
	description?: string;

	@CreateDateColumn()
	createTime?: string;

	@UpdateDateColumn()
	updateTime?: string;
}
