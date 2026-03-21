import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

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

    async createAccount(customerId: string, name: string) {
        const { data } = await firstValueFrom(
            this.httpService.post(
                `${this.baseUrl}/webhooks/accounts`,
                { customerId, name },
                { headers: this.headers },
            ),
        );
        return data;
    }

    async createUser(accountId: string, user: {
        name: string;
        email: string;
        password: string;
        role: string;
    }) {
        const { data } = await firstValueFrom(
            this.httpService.post(
                `${this.baseUrl}/webhooks/users`,
                { ...user, accountId },
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