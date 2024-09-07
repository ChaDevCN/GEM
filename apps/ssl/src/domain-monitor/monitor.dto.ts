import { IsString, IsNotEmpty, Matches, IsInt, Min, Max, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { IPType, CertificateStatus } from './monitor.mysql.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCertificateMonitoringDto {
    @ApiProperty({ description: 'Domain name to monitor (without protocol)' })
    @IsString()
    @IsNotEmpty()
    @Matches(
        /^(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63})$/,
        {
            message: 'Domain must be a valid domain name without protocol',
        }
    )
    domain: string;

    @ApiProperty({ description: 'notes' })
    notes?: string

}

export class UpdateCheckIntervalDto {
    @ApiProperty({ description: 'New check interval in seconds', minimum: 60, maximum: 604800 })
    @IsInt()
    @Min(60)
    @Max(86400 * 7)
    newInterval: number;
}

export class UpdateCertificateMonitoringDto {
    @ApiPropertyOptional({ description: 'Additional notes' })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiPropertyOptional({ description: 'Port number', minimum: 1, maximum: 65535 })
    @IsInt()
    @Min(1)
    @Max(65535)
    @IsOptional()
    port?: number;

    @ApiPropertyOptional({ enum: IPType, description: 'IP type' })
    @IsEnum(IPType)
    @IsOptional()
    ipType?: IPType;

    @ApiPropertyOptional({ description: 'Alert threshold in days', minimum: 1, maximum: 365 })
    @IsInt()
    @Min(1)
    @Max(365)
    @IsOptional()
    alertThreshold?: number;
}

export class QueryCertificateMonitoringDto {
    @ApiPropertyOptional({ description: 'Domain name to filter' })
    @IsOptional()
    @IsString()
    domain?: string;

    @ApiPropertyOptional({ enum: CertificateStatus, description: 'Certificate status to filter' })
    @IsOptional()
    @IsEnum(CertificateStatus)
    status?: CertificateStatus;

    @ApiPropertyOptional({ description: 'Filter certificates expiring after this date' })
    @IsOptional()
    @IsDateString()
    expiresAfter?: Date;

    @ApiPropertyOptional({ description: 'Filter certificates expiring before this date' })
    @IsOptional()
    @IsDateString()
    expiresBefore?: Date;

    @ApiPropertyOptional({ description: 'Page number for pagination', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    limit?: number = 10;
}