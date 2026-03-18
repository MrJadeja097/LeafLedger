import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlantTreeDto {
  @ApiProperty({ example: 28.6139 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 77.209 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ example: 'New Delhi, India', required: false })
  @IsString()
  @IsOptional()
  locationName?: string;

  @ApiProperty({ example: 'GreenEarth NGO', required: false })
  @IsString()
  @IsOptional()
  ngoPartner?: string;
}

export class ConfirmPlantingDto {
  @ApiProperty({ example: '42' })
  @IsString()
  tokenId: string;

  @ApiProperty({ example: '0xabc123...' })
  @IsString()
  transactionHash: string;

  @ApiProperty({ example: 'ipfs://...' })
  @IsString()
  metadataUri: string;
}
