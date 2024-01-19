export class MediatorNode {
    label: string;
    size: number;
    cluster_id: number;
    id: number;

    constructor(label: string, size: number, cluster_id: number, id: number) {
        this.label = label;
        this.size = size;
        this.cluster_id = cluster_id;
        this.id = id;
    }
}