interface Line {
    id: String,
    name: String,
    ponderation: number,
}

export interface Record {
    date: String,
    value: number
}

class Portefeuille {

    public lines: Line[] = [];
    public static instance : Portefeuille = this.getInstance();
    public historical_data: {[key: string]: Record[]} = {};

    public constructor(lines: Line[]) {
        this.lines = lines;
    }

    public static getInstance() : Portefeuille {
        try {
            let pf = localStorage.getItem("portefeuille");
            if (typeof pf != "undefined" && pf != null) {
                const lines = JSON.parse(pf) as Line[];
                return new Portefeuille(lines);
            }
        } catch {}
        
        const newPf = new Portefeuille([]);
        localStorage.setItem("portefeuille", JSON.stringify(newPf.lines));
        return newPf;
    }

    public addLine(id : String, name: String) {
        for (let i=0; i<this.lines.length; i++) {
            if (this.lines[i].id === id) {
                return;
            }
        }
        this.lines.push({
            id: id, name: name, ponderation: 0.1
        });
        this.save();
    }

    public save() {
        localStorage.setItem("portefeuille", JSON.stringify(this.lines));
    }

    public isInPortefeuille(id: String) : Boolean {
        for (let i=0; i<this.lines.length; i++) {
            if (this.lines[i].id === id) {
                return true;
            }
        }
        return false;
    }

    public updatePonderation(id: String, newValue: number) {
        for (let i=0; i<this.lines.length; i++) {
            if (this.lines[i].id === id) {
                this.lines[i].ponderation = newValue;
            }
        }
        this.save();
    }

    public getTotalPonderation() : number {
        let out = 0.0;
        for (let i=0; i<this.lines.length; i++) {
            out += this.lines[i].ponderation;
        }
        return out;
    }

    public async simulatePortefeuille(): Promise<Record[]> {
        let longest: Record[] = [];
        for (let i=0; i<this.lines.length; i++) {
            if (typeof this.historical_data[this.lines[i].id as string] === "undefined") {
                const rawData = await fetch("https://raw.githubusercontent.com/mx791/financialAdvisor/refs/heads/main/data/out/" + this.lines[i].id + ".csv");
                const content = await rawData.text();
                const data = content.split("\n").map(i => {
                    return {date: i.split(",")[1], value: parseFloat(i.split(",")[3])}
                });
                this.historical_data[this.lines[i].id as string] = data;
                if (data.length > longest.length) {
                    longest = data;
                }
            }
        }
        let createdData: Record[] = [];
        for (let i=0; i<longest.length; i++) {
            let value = 0.0;
            let currentDate = longest[i];
            let valueOk = true;
            for (let e=0; e<this.lines.length; e++) {
                const index = longest.length - i;
                if (this.historical_data[e].length >= index) {
                    value += this.historical_data[e][index].value;
                } else {
                    valueOk = false;
                }
            }
            if (valueOk) {
                createdData.unshift({date: String(currentDate), value: value});
            }
        }
        return createdData;
    }
}

export default Portefeuille;