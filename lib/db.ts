import { createPool, Pool} from 'mysql';

let pool: Pool;

/**
 * generates pool connection to be used throughout the app
 */
export const init = () => {
    try {
        pool = createPool({
            host: "172.22.0.5",
            user: "root",
            password: "pass",
            database: "segue",
            insecureAuth: true,
            port: 3307
        });

        console.debug('MySql Adapter Pool generated successfully');
    } catch (error) {
        console.error('[mysql.connector][init][Error]: ', error);
        throw new Error('failed to initialized pool');
    }
};

/**
 * executes SQL queries in MySQL db
 *
 * @param {string} query - provide a valid SQL query
 * @param {string[] | Object} params - provide the parameterized values used
 * in the query
 */
export const executeQuery = <T>(query: string, params: string[] | Object): Promise<T> => {
    init()
    try {
        if (!pool) throw new Error('Pool was not created. Ensure pool is created when running the app.');

        return new Promise<T>((resolve, reject) => {
            pool.query(query, params, (error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });

    } catch (error) {
        console.error('[mysql.connector][execute][Error]: ', error);
        throw new Error('failed to execute MySQL query');
    }
}