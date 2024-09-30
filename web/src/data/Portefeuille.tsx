interface Line {
    id: String,
    name: String,
    ponderation: number,
}

class Portefeuille {

    public lines: Line[] = [];
    public static instance : Portefeuille = this.getInstance();

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
        this.save();
    }
}

export default Portefeuille;