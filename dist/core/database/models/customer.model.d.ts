import { Model } from 'sequelize-typescript';
import { User } from './user.model';
export declare class Customer extends Model {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: Date;
    occupation: string;
    status: string;
    createdBy: number;
    creator: User;
    get fullName(): string;
}
