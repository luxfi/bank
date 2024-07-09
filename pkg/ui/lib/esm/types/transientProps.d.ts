type Transient<T, IgnoreKeys extends keyof T = never> = {
    [K in keyof T as K extends IgnoreKeys ? K : `$${string & K}`]?: T[K];
};
//# sourceMappingURL=transientProps.d.ts.map