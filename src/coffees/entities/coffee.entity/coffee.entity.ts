import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as GraphQlTypes from '../../../graphql';
import { JoinTable } from 'typeorm';
import { Flavor } from '../flavor.entity/flavor.entity';

@Entity()
export class Coffee implements GraphQlTypes.Coffee {
  @Column()
  brand: string;

  @JoinTable()
  @ManyToMany(() => Flavor, (flavor: Flavor) => flavor.coffees, {
    cascade: true,
  })
  flavors: Flavor[];

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt?: Date | null;

  @Column({ nullable: true })
  type: GraphQlTypes.CoffeeType;
}
