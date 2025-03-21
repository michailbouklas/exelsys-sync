export class ProgressBar {
    private current: number = 0;
    private total: number;
    private barLength: number = 30;

    constructor(total: number) {
        this.total = total;
    }

    update(value: number, extras = '') {
        this.current = Math.min(Math.max(0, value), this.total);
        const percentage = Math.round((this.current / this.total) * 100);
        const filled = Math.min(
            this.barLength, 
            Math.max(0, Math.round((this.barLength * this.current) / this.total))
        );
        const remaining = Math.max(0, this.barLength - filled);
        const bar = '█'.repeat(filled) + '-'.repeat(remaining);
        process.stdout.write(`\r[${bar}] ${percentage}% | ${this.current}/${this.total} ${extras}`);
    }

    complete() {
        process.stdout.write('\n');
    }
}