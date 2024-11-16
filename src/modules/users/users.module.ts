import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '@App/modules/users/users.service';
import { UsersController } from '@App/modules/users/users.controller';
import { User } from '@App/modules/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [TypeOrmModule.forFeature([User]), JwtModule],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
