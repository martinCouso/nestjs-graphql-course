import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Repository } from 'typeorm';
import { Flavor } from './entities/flavor.entity/flavor.entity';
import { Coffee } from './entities/coffee.entity/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FlavorsByCoffeeLoader } from './data-loader/flavors-by-coffee.loader/flavors-by-coffee.loader';

@Resolver('Coffee')
export class RelationsResolverResolver {
  constructor(private readonly flavorsByCoffeeLoader: FlavorsByCoffeeLoader) {}

  @ResolveField('flavors')
  async getFlavorsByCoffeeId(@Parent() coffee: Coffee) {
    console.log('getFlavorsByCoffeeId', coffee);
    return this.flavorsByCoffeeLoader.load(coffee.id);
  }
}
