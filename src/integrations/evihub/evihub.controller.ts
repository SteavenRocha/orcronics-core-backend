import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { EvihubService } from "./evihub.service";
import { BuildQueryDto } from "../../common/dto/build-query.dto";
import { UpdateEvihubUserStatusDto } from "./dto/update-evihub-user-status.dto";
import { CreateEvihubUserDto } from "./dto/create-evihub-user.dto";

@Controller('evihub')
export class EvihubController {
    constructor(private readonly evihubService: EvihubService) { }

    @Get('users/account/:accountId')
    getUsersByAccount(
        @Param('accountId', ParseUUIDPipe) accountId: string,
        @Query() buildQueryDto: BuildQueryDto,
    ) {
        return this.evihubService.getUsersByAccount(accountId, buildQueryDto);
    }

    @Post('users')
    @HttpCode(HttpStatus.CREATED)
    createUser(
        @Body() dto: CreateEvihubUserDto,
    ) {
        return this.evihubService.createUser(dto);
    }

    @Patch('users/:id/status')
    @HttpCode(HttpStatus.NO_CONTENT)
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateEvihubUserStatusDto,
    ) {
        return this.evihubService.updateUserStatus(id, dto.isActive);
    }
}