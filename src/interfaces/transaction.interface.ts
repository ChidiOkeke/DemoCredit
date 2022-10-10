export interface Transaction {
    transaction_id: string;
    transaction_type: string;
    from_account_id: string;
    to_account_id: string;
    date_issued: string;
    amount: number;
}