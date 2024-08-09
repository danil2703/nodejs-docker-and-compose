import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;

  @IsNotEmpty()
  @IsNumber()
  itemId: number;
}
