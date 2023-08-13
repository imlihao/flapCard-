
class logUtil {
    /**
     * yellow
     * @param args 
     */
    public log(...args: any[]): void {
        console.log(...args);
    }

    public logRed(...args: any[]): void {
        console.log(...args);
    }

    public logBlue(...args: any[]): void {
        console.log(...args);
    }

    public error(...args: any[]): void {
        console.error(...args);
    }

    public warn(...args: any[]): void {
        console.warn(...args);
    }

    public info(...args: any[]): void {
        console.info(...args);
    }
}
export const LogUtil = new logUtil();