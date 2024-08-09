import { IsEmail, IsNotEmpty, IsUrl, Length } from 'class-validator';
import { BaseEntity } from '../../entities/base-entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
  @Length(2, 30)
  @Column({ unique: true })
  username: string;

  @Length(2, 200)
  @Column({ default: 'Пока ничего не рассказал о себе' })
  about: string;

  @IsUrl()
  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
