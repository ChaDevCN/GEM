import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { AcmeAccount } from "./acme.account.mysql.entity"

@Entity()
export class AcmeOrder {
    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(() => AcmeAccount, account => account.orders)
    account: AcmeAccount;

    @Column()
    orderUrl: string;

    @Column()
    status: string;

    @Column()
    expires: Date;

    @Column()
    finalizeUrl: string;

    @Column("simple-json")
    identifiers: {
        type: string;
        value: string;
        token?: string;
        dns?: string;
        url?: string;
        certificate?: string
        privateKey?: string
    }[];
}