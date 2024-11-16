import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@App/modules/users/enums/role.enum';
import { ROLES_KEY } from '@App/modules/auth/decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);
		if (!requiredRoles) {
			return true;
		}

		const { user } = context.switchToHttp().getRequest();
		return requiredRoles.some((role) => user.role == role);
	}
}
