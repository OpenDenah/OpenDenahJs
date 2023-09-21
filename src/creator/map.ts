interface Config {
    height: number;
    width: number;
    size: number;
    groundColor: string;
    nodeColor: string;
    hoverColor: string;
};

interface Coordinate {
    x: number;
    y: number;
};

export class Denah {
    private root: HTMLElement;
    private base: Array<Array<number>>;
    private config: Config;

    private coorX: number = 0;
    private coorY: number = 0;

    private isCreating: boolean = false;
    private start: Coordinate = null;
    private end: Coordinate = null;

    constructor(root: string|HTMLElement, config: Config = {
        height: 10,
        width: 10,
        size: 10,
        groundColor: '#E9E9E9',
        nodeColor: '#03e45f',
        hoverColor: '#f53333',
    }) {
        this.config = config;
        if (typeof root === 'string') {
            this.root = document.querySelector(root);
        } else {
            this.root = root;
        }
        this.createRoom();
    }

    public setWidth(width: number): void {
        this.config.width = width;
        this.createRoom();
    }

    public setHeight(height: number): void {
        this.config.height = height;
        this.createRoom();
    }

    public printRoot(): void {
        console.log(this.root);
        console.log(this.base.map(row => row.join(' ')).join('\n'));
    }

    public clear(): void {
        while(this.root.firstChild) {
            this.root.removeChild(this.root.lastChild);
        }
    }

    public render(): void {
        this.clear();

        const tileSize: Number = this.config.size;
        for (let x = 0; x < this.config.height; x++) {
            const row = document.createElement("div");
            row.style.height = `${tileSize}px`;
            row.style.display = 'flex';
            for(let y = 0; y < this.config.width; y++) {
                const col = document.createElement("div");
                col.id = `tile-${x}-${y}`;
                col.style.cursor = 'pointer';
                col.style.userSelect = 'none';
                col.style.display = 'inline-block';
                col.style.boxShadow = `inset 0px 0px 0px 0px ${this.config.hoverColor}`;
                col.style.transition = 'all ease-out .3s';
                col.style.backgroundColor = this.base[x][y] === 0 ? this.config.groundColor : this.config.nodeColor;
                col.style.height = `${tileSize}px`;
                col.style.width = `${tileSize}px`;
                col.addEventListener('mousedown', (e) => {
                    this.isCreating = true;
                    const [ a, x, y ] = e.target['id'].split('-');
                    this.start = { x, y };
                    console.log('down', this.start);
                });
                col.addEventListener('mouseup', (e) => {
                    this.isCreating = false;
                    const [ a, x, y ] = e.target['id'].split('-');
                    this.end = { x, y };
                    console.log('up', this.end);
                })
                col.addEventListener('mouseenter', (e) => {
                    col.style.boxShadow = `inset 0px 0px 0px 4px ${this.config.hoverColor}`;
                    if (this.isCreating) {
                        this.end = { x, y };

                        console.log(`from ${this.start.x}, ${this.start.y} to ${this.end.x}, ${this.end.y}`);

                        if ((this.start.x >= x && this.start.y >= y) || (this.start.x <= x && this.start.y <= y)) {
                            col.style.backgroundColor = this.config.nodeColor;
                        }
                    }
                });
                col.addEventListener('mouseleave', (e) => {
                    col.style.boxShadow = `inset 0px 0px 0px 0px ${this.config.hoverColor}`;
                    if (this.isCreating) {
                        // col.style.backgroundColor = this.config.groundColor;

                        if (!((this.start.x >= x && this.start.y >= y) || (this.start.x <= x && this.start.y <= y))) {
                            col.style.backgroundColor = this.config.groundColor;
                        }
                    }
                });
                row.appendChild(col);
            }
            this.root.appendChild(row);
        }
    }

    private createRoom(): void {
        this.base = Array(this.config.height).fill(0).map(() => Array(this.config.width).fill(0));
        
        this.root.style.display = "flex";
        this.root.style.flexDirection = "column";
        this.root.style.gap = "0px";
        this.root.style.height = `${this.config.height * this.config.size}px!important`;
        this.root.style.width = `${this.config.width * this.config.size}px!important`;
    }
};