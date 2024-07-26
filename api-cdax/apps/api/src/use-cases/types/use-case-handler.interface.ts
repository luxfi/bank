export abstract class UseCaseHandler {
    protected paymentProvider: any;
    abstract handle(...arr: any[]);
}
