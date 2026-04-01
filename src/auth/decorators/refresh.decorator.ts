import { applyDecorators, UseGuards } from "@nestjs/common";
import { Public } from "./public.decorator";
import { JwtRefreshGuard } from "../guards/jwt-refresh.guard";

export const Refresh = () =>
    applyDecorators(
        Public(),
        UseGuards(JwtRefreshGuard),
    );