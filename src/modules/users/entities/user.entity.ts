import { ReadingInterval } from '@App/modules/readings/entities/readings.entity';
import { UserRole } from '@App/modules/users/enums/role.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	username: string;

	@Column({ name: 'password' })
	password: string;

	@Column({ enum: UserRole, type: 'enum' })
	role: UserRole;

	@OneToMany(() => ReadingInterval, (readingInterval) => readingInterval.user)
	readingIntervals: ReadingInterval[];

	@Column({ type: 'timestamptz', default: () => `timezone('utc', now())` })
	created_at: Date;

	@Column({ type: 'timestamptz', default: () => `timezone('utc', now())` })
	updated_at: Date;
}
