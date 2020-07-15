interface Date {
    toDateString(): string;
}

Date.prototype.toDateString = function() {
    return `${this.getMonth() + 1}/${this.getDate()}/${this.getFullYear()}`;
}