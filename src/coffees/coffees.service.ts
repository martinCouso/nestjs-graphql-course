import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Coffee } from './entities/coffee.entity/coffee.entity';
import { UserInputError } from 'apollo-server-express';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCoffeeInput } from './dto/update-coffee.input/update-coffee.input';
import { CreateCoffeeInput } from './dto/create-coffee.input/create-coffee.input';
import { Flavor } from './entities/flavor.entity/flavor.entity';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly pubSub: PubSub,
  ) {}

  async findAll() {
    return this.coffeeRepository.find();
  }

  async findById(id: number) {
    const coffee = this.coffeeRepository.findOne({
      where: { id: id },
    });
    if (!coffee) {
      throw new UserInputError(`Coffee #${id} does not exist`);
    }
    return coffee;
  }

  async createCoffee(createCoffeeInput: CreateCoffeeInput) {
    console.log('createCoffeeInput', createCoffeeInput);
    const flavorsFromDB = await Promise.all(
      createCoffeeInput.flavors.map((flavorName) =>
        this.preloadFlavorByName(flavorName),
      ),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeInput, //{name:"test coffee 1", brand: "test brand", flavors:["chocolate", "vanilla"]}
      flavors: flavorsFromDB, //flavors: [{id:1, name: "chocolate"}, {id:2, name:"vanilla"}]
    });
    const newCoffee = this.coffeeRepository.save(coffee);
    this.pubSub.publish('addedCoffee', { addedCoffee: newCoffee });
    return newCoffee;
  }

  async updateCoffee(
    id: number,
    updateCoffeeInput: UpdateCoffeeInput,
  ): Promise<Coffee> {
    let flavorsFromDB = null;
    if (updateCoffeeInput.flavors) {
      flavorsFromDB = await Promise.all(
        updateCoffeeInput.flavors.map((flavorName) =>
          this.preloadFlavorByName(flavorName),
        ),
      );
    }
    const { flavors, ...rest } = updateCoffeeInput;
    const coffee = await this.coffeeRepository.preload({
      id,
      ...rest,
      flavors: flavorsFromDB,
    });
    if (!coffee) {
      throw new UserInputError(`The coffee #${id} does not exist.`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async deleteCoffee(id: number): Promise<Coffee> {
    const coffee = await this.coffeeRepository.findOne({ where: { id: id } });
    if (!coffee) {
      throw new UserInputError(`The coffee #${id} does not exist.`);
    }
    return this.coffeeRepository.remove(coffee);
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: { name },
    });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
