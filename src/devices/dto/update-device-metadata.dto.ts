import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceMetadataDto } from './create-device-metadata.dto';

export class UpdateDeviceMetadataDto extends PartialType(CreateDeviceMetadataDto) { }