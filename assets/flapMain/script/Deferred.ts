export class Deferred<T = void> {
    public resolve: ((value?: T) => void) | undefined;
    public reject: ((value?: T) => void) | undefined;
    public promise: Promise<T>;
    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        })
    }

    public static wait(time: number) {
        let deferred = new Deferred();

        setTimeout(() => {
            deferred.resolve();
        }, time);

        return deferred;
    }
}