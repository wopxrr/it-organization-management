import { IsEmail, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvitationDto {
  @ApiProperty({
    description: 'Array email yang akan diundang',
    example: ['member1@example.com', 'member2@example.com'],
    type: [String],
  })
  @IsArray({ message: 'Emails harus berupa array' })
  @ArrayMinSize(1, { message: 'Minimal 1 email harus diisi' })
  @IsEmail({}, { each: true, message: 'Setiap email harus valid' })
  emails!: string[];
}