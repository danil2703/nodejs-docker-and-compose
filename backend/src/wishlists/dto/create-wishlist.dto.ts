import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @Length(0, 1500)
  @IsOptional()
  description: string;

  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
