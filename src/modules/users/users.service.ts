import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { User } from '@App/modules/users/entities/user.entity';
import { CreateUserDto } from '@App/modules/users/dto/create-user.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly configService: ConfigService,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const password = createUserDto.password;

		const salt = this.configService.get('app').salt;

		const hash = crypto
			.pbkdf2Sync(password, salt, 1000, 64, 'sha256')
			.toString(`hex`);

		createUserDto.password = hash;

		const createdUser = await this.userRepository.save(createUserDto);

		return createdUser;
	}

	async findOneByUsername(username: string): Promise<User> {
		const user = await this.userRepository.findOne({
			where: { username },
		});

		return user;
	}

	async findOneById(id: number): Promise<User> {
		const user = await this.userRepository.findOne({
			where: { id },
			select: { password: false },
		});

		if (!user) throw new NotFoundException('User not found');
		return user;
	}
}
