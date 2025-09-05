import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.model';

@Table({
  tableName: 'customers',
  timestamps: true,
})
export class Customer extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ allowNull: false })
  firstName: string;

  @Column({ allowNull: false })
  lastName: string;

  @Column({ allowNull: false, unique: true })
  email: string;

  @Column
  phoneNumber: string;

  @Column(DataType.TEXT)
  address: string;

  @Column
  dateOfBirth: Date;

  @Column
  occupation: string;

  @Column({ defaultValue: 'active' })
  status: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  createdBy: string;

  @BelongsTo(() => User, 'createdBy')
  creator: User;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}