import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '@tools/models/base';
import { ClientMetadataTemp } from '../repository/client-metadata-temp.repository';

@Entity({
  customRepository: () => ClientMetadataTemp,
  tableName: 'client_metadata_temp',
})
export class MetadataTemp extends BaseEntity {
  @Property()
  session: string;

  @Property({ type: 'json' })
  detail: Record<string, any>;

  @Property()
  clientId: string;
}
