import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { EncryptionType, CertificateAuthority } from './acme.account.mysql.entity';

export class CreateAccountDto {
    @ApiProperty({
        description: 'The email address associated with the account',
        example: 'user@example.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The type of encryption to use for the account key',
        enum: EncryptionType,
        example: EncryptionType.RSA
    })
    @IsEnum(EncryptionType)
    @IsNotEmpty()
    encryptionType: EncryptionType;

    @ApiProperty({
        description: 'The domain for which the certificate will be issued',
        example: 'example.com'
    })
    @IsString()
    @IsNotEmpty()
    domain: string;

    @ApiProperty({
        description: 'The certificate authority to use',
        enum: CertificateAuthority,
        example: CertificateAuthority.LetsEncrypt
    })
    @IsEnum(CertificateAuthority)
    @IsNotEmpty()
    certificateAuthority: CertificateAuthority;
}

export class CreateOrderDto {
    @ApiProperty({
        description: 'The ID of the account to create the order for',
        example: 1
    })
    @IsNotEmpty()
    accountId: number;
}

export class VerifyDnsChallengeDto {
    @ApiProperty({ 'name': 'asd' })
    orderId: number
}

export class AccountResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'user@example.com' })
    email: string;

    @ApiProperty({ enum: EncryptionType, example: EncryptionType.RSA })
    encryptionType: EncryptionType;

    @ApiProperty({ example: 'example.com' })
    domain: string;

    @ApiProperty({ enum: CertificateAuthority, example: CertificateAuthority.LetsEncrypt })
    certificateAuthority: CertificateAuthority;
}

export class OrderResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'https://example.com/acme/order/123456' })
    orderUrl: string;

    @ApiProperty({ example: 'pending' })
    status: string;

    @ApiProperty({ example: '2023-09-02T15:00:00Z' })
    expires: Date;

    @ApiProperty({ example: 'https://example.com/acme/finalize/123456' })
    finalizeUrl: string;

    @ApiProperty({
        example: [{ type: 'dns', value: 'example.com' }]
    })
    identifiers: { type: string; value: string }[];
}