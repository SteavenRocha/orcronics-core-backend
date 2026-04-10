import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { BuildQueryDto } from "src/common/dto/build-query.dto";
import { CreateEvihubUserDto } from "./dto/create-evihub-user.dto";

@Injectable()
export class EvihubService {
    constructor(
        private httpService: HttpService,
        private configService: ConfigService,
    ) { }

    private get baseUrl() {
        return this.configService.getOrThrow<string>('EVIHUB_API_URL');
    }

    private get headers() {
        return { 'x-api-key': this.configService.getOrThrow<string>('EVIHUB_API_KEY') };
    }

    // ==================== ACCOUNT ====================

    async createAccount(customerId: string) {
        const { data } = await firstValueFrom(
            this.httpService.post(
                `${this.baseUrl}/webhooks/accounts`,
                { customerId },
                { headers: this.headers },
            ),
        );
        return data;
    }

    async updateAccountStatus(accountId: string, isActive: boolean) {
        const { data } = await firstValueFrom(
            this.httpService.patch(
                `${this.baseUrl}/webhooks/accounts/${accountId}/status`,
                { isActive },
                { headers: this.headers },
            ),
        );
        return data;
    }

    // ==================== USER ====================

    async getUsersByAccount(accountId: string, buildQueryDto: BuildQueryDto) {
        const { data } = await firstValueFrom(
            this.httpService.get(
                `${this.baseUrl}/webhooks/users/account/${accountId}`,
                {
                    headers: this.headers,
                    params: buildQueryDto,
                },
            ),
        );
        return data;
    }

    async createUser(dto: CreateEvihubUserDto) {
        const { data } = await firstValueFrom(
            this.httpService.post(
                `${this.baseUrl}/webhooks/users`,
                dto,
                { headers: this.headers },
            ),
        );
        return data;
    }

    async updateUserStatus(userId: string, isActive: boolean) {
        const { data } = await firstValueFrom(
            this.httpService.patch(
                `${this.baseUrl}/webhooks/users/${userId}/status`,
                { isActive },
                { headers: this.headers },
            ),
        );
        return data;
    }
}