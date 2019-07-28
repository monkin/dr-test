import { Immediate } from "rebylon";

export function loadImage(url: string): PromiseLike<HTMLImageElement> {
    return new Immediate(new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Failed to load image '${url}'`));
        image.src = url;
    }));
}