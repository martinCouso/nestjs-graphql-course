import * as GraphQlTypes from '../../../graphql';
import { MinLength } from 'class-validator';

export class CreateCoffeeInput extends GraphQlTypes.CreateCoffeeInput {
  @MinLength(3)
  name: string;
}
