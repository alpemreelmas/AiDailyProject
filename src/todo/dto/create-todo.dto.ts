import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsOptional()
  @IsBoolean()
  public completed: boolean;

  @IsString()
  @IsNotEmpty()
  public description: string;
}
