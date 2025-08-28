import { Model } from 'sequelize-typescript';
import { Customer } from './customer.model';
export declare class User extends Model {
    id: number;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    lastLoginAt: Date;
    customers: Customer[];
    static hashPassword(instance: User): Promise<void>;
    comparePassword(password: string): Promise<boolean>;
    toJSON(): any;
}
