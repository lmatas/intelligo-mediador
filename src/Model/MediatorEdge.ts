export class MediatorEdge {
    weight: number;
    source: number;
    target: number;

    constructor(weight: number, source: number, target: number) {
        this.weight = weight;
        this.source= source;
        this.target = target;
    }
}