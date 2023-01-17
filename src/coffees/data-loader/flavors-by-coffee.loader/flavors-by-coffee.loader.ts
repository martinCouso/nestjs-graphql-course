import { Injectable, Scope } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Coffee } from '../../entities/coffee.entity/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Flavor } from '../../entities/flavor.entity/flavor.entity';
import DataLoader from 'dataloader';

@Injectable({ scope: Scope.REQUEST })
export class FlavorsByCoffeeLoader extends DataLoader<number, Flavor[]> {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
  ) {
    super((keys) => this.batchLoadFn(keys));
  }

  private async batchLoadFn(coffeeIds: readonly number[]): Promise<Flavor[][]> {
    const coffeesWithFlavors = await this.coffeeRepository.find({
      select: ['id'],
      relations: ['flavors'],
      where: {
        id: In(coffeeIds as number[]),
      },
    });

    return coffeesWithFlavors.map((coffee) => coffee.flavors);
  }
}
