import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import * as GraphQlTypes from '../../graphql';

@Resolver('DrinksResult')
export class DrinksResolver {
  @Query('drinks')
  async findAll(): Promise<GraphQlTypes.DrinksResult[]> {
    let coffee = new GraphQlTypes.Coffee();
    coffee = {
      id: 23,
      name: 'test 23c',
      brand: 'test 23b',
    };
    let tea = new GraphQlTypes.Tea();
    tea = {
      name: 'test 23t',
    };

    return [tea, coffee];
  }

  @ResolveField()
  __resolveType(value: GraphQlTypes.Drink) {
    console.log(
      'value instanceof GraphQlTypes.Coffee',
      value instanceof GraphQlTypes.Coffee,
    );
    /*if (value instanceof GraphQlTypes.Coffee) {
      return 'Coffee';
    } else if (value instanceof GraphQlTypes.Tea) {
      return 'Tea';
    }
    return null;*/
    if ('brand' in value) {
      return 'Coffee';
    }
    return 'Tea';
  }
}
