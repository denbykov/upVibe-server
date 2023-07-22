declare namespace Database {
  type DBValue = string | number | boolean | int;
  type DBQuery = {
    query: (query: string, values: DBValue[]) => Promise<any>;
    };

    type DBClientConfig = {
        user: string;
        host: string;
        database: string;
        port: number;
        password: string;
        max: number;
    };
    
}
