import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsBoolean, IsInt, Min, Max, Matches } from 'class-validator';

export class CreateCertificateDto {
    @ApiProperty({ description: 'Domain name to monitor (without protocol)' })
    @IsString()
    @IsNotEmpty()
    @Matches(
        /^(?!.*[*])(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63})$/,
        {
            message: 'Domain must be a valid domain name without protocol and cannot contain asterisks',
        }
    )
    domain: string;

    @ApiProperty({ description: 'Email address for certificate notifications' })
    @IsString()
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({ description: 'Whether to automatically renew the certificate' })
    @IsBoolean()
    autoRenew: boolean;

    @ApiProperty({ description: 'Number of days before expiry to renew the certificate' })
    @IsInt()
    @Min(1, { message: 'Renewal days must be at least 1' })
    @Max(90, { message: 'Renewal days cannot exceed 90' })
    renewalDaysBeforeExpiry: number;
}