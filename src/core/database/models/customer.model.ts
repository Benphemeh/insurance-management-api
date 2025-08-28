import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';


@Table({
  tableName: 'customers',
  timestamps: true,
})
export class Customer extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

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
  @Column
  createdBy: number;

  @BelongsTo(() => User, 'createdBy')
  creator: User;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
