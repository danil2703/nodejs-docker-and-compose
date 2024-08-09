import { IsInt, IsPositive, IsUrl, Max, Min } from 'class-validator';
import { BaseEntity } from 'src/entities/base-entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @Min(1)
  @Max(250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({
    type: 'numeric',
    scale: 2,
    default: 0,
  })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @Min(1)
  @Max(1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({
    default: 0,
  })
  @IsPositive()
  @IsInt()
  copied: number;
}
