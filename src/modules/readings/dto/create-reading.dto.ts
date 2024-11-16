import { User } from '@App/modules/users/entities/user.entity';
import {
	IsNumber,
	IsNotEmpty,
	Min,
	Validate,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	IsOptional,
} from 'class-validator';

@ValidatorConstraint({ name: 'StartPageLessThanEndPage', async: false })
export class StartPageLessThanEndPageConstraint
	implements ValidatorConstraintInterface
{
	validate(startPage: number, args: ValidationArguments) {
		const endPage = (args.object as any).endPage;
		return startPage < endPage;
	}

	defaultMessage() {
		return `startPage must be less than endPage`;
	}
}

export class CreateReadingDto {
	@IsNotEmpty()
	@IsNumber()
	@Min(1, { message: 'startPage must be at least 1' })
	@Validate(StartPageLessThanEndPageConstraint)
	startPage: number;

	@IsNotEmpty()
	@IsNumber()
	endPage: number;

	@IsNotEmpty()
	@IsNumber()
	bookId: number;

	@IsOptional()
	user: User;
}
