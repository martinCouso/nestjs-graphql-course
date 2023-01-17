import * as GraphQlTypes from '../../../graphql';
import { IsOptional, MinLength } from 'class-validator';

export class UpdateCoffeeInput extends GraphQlTypes.UpdateCoffeeInput {
  @MinLength(3)
  @IsOptional()
  name: string;
}
