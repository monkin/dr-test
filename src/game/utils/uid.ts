let counter = 0;
export function uid(prefix: string = "uid") {
    return `${prefix}_${(counter++).toFixed()}`;
}