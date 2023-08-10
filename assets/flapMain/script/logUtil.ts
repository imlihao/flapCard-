import chalk from 'chalk';

class logUtil {
    /**
     * yellow
     * @param args 
     */
    public log(...args: any[]): void {
        console.log(chalk.yellow(...args));
    }

    public logRed(...args: any[]): void {
        console.log(chalk.red(...args));
    }

    public logBlue(...args: any[]): void {
        console.log(chalk.blue(...args));
    }

    public error(...args: any[]): void {
        console.error(chalk.red(...args));
    }

    public warn(...args: any[]): void {
        console.warn(chalk.yellow(...args));
    }

    public info(...args: any[]): void {
        console.info(chalk.blue(...args));
    }

    public debug(...args: any[]): void {
        console.debug(chalk.gray(...args));
    }

    public table(data: any, columns?: string[]): void {
        if (columns) {
            console.table(data.map((row: any) => {
                const newRow: any = {};
                columns.forEach((column: string) => {
                    newRow[column] = chalk.white(row[column]);
                });
                return newRow;
            }), columns.map((column: string) => chalk.blue(column)));
        } else {
            console.table(data.map((row: any) => {
                const newRow: any = {};
                Object.keys(row).forEach((key: string) => {
                    newRow[key] = chalk.white(row[key]);
                });
                return newRow;
            }));
        }
    }
}
export const LogUtil = new logUtil();