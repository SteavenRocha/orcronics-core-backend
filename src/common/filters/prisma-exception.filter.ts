import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core'
import { Prisma } from '../../generated/prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
    override catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        switch (exception.code) {
            case 'P2002': {
                const targets = (exception.meta?.target as string[]) || ['field'];
                const field = targets.join(', ');

                response.status(HttpStatus.CONFLICT).json({
                    statusCode: HttpStatus.CONFLICT,
                    message: `The ${field} is already in use.`,
                    error: 'Conflict',
                });
                break;
            }
            case 'P2025': {
                response.status(HttpStatus.NOT_FOUND).json({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'The requested record does not exist or you do not have access.',
                    error: 'Not Found',
                });
                break;
            }
            case 'P2003': {
                response.status(HttpStatus.BAD_REQUEST).json({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Operation failed due to a relationship constraint (Foreign Key).',
                    error: 'Bad Request',
                });
                break;
            }
            default:
                super.catch(exception, host);
                break;
        }
    }
}