import {
  Table,
  Column,
  Model,
  PrimaryKey,
  HasMany,
  BeforeCreate,
  BeforeUpdate,
  DataType,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Customer } from './customer.model';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ allowNull: false, unique: true })
  username: string;

  @Column({ allowNull: false, unique: true })
  email: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ allowNull: false })
  firstName: string;

  @Column({ allowNull: false })
  lastName: string;

  @Column({ defaultValue: 'user' })
  role: string;

  @Column({ defaultValue: 'active' })
  status: string;

  @Column
  lastLoginAt: Date;

  @HasMany(() => Customer, 'createdBy')
  customers: Customer[];

  @BeforeCreate
  static async setId(instance: User) {
    if (!instance.id) {
      instance.id = uuidv4();
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      instance.password = await bcrypt.hash(instance.password, 10);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}
