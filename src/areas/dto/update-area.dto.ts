import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAreaDto } from './create-area.dto';

export class UpdateAreaDto extends PartialType(
    OmitType(CreateAreaDto, ['branchId'] as const)
) { }
