import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Nama organisasi',
    example: 'Komunitas IT Kampus',
  })
  @IsString({ message: 'Nama organisasi harus berupa teks' })
  @MinLength(3, { message: 'Nama organisasi minimal 3 karakter' })
  @MaxLength(255, { message: 'Nama organisasi maksimal 255 karakter' })
  name!: string;

  @ApiProperty({
    description: 'Deskripsi organisasi (opsional)',
    example: 'Komunitas mahasiswa IT untuk berbagi pengetahuan dan pengalaman',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Deskripsi harus berupa teks' })
  description?: string;
}