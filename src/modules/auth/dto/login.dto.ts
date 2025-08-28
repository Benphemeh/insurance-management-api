import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'AOlayemi' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'Password1' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
