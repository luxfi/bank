import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../base';
import { NewsLetterRepository } from '../repository';

@Entity({ customRepository: () => NewsLetterRepository })
export class NewsLetter extends BaseEntity {
  @Property({ nullable: false })
  email: string;

  @Property({ nullable: false })
  first_name: string;

  @Property({ nullable: false })
  last_name: string;
}
