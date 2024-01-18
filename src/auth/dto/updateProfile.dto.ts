import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  @MinLength(8)
  public password: string;
}
