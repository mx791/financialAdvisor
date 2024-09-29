interface Line {
    id: String,
    name: String,
    ponderation: number,
}

class Portefeuille {

    public lines: Line[] = [];

    public static getInstance() : Portefeuille {
        let pf = localStorage.getItem("portefeuille")
        if (typeof pf != "undefined" && pf != null) {
            return JSON.parse(pf) as Portefeuille;
        }
        const newPf = new Portefeuille();
        localStorage.setItem("portefeuille", JSON.stringify(newPf));
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
    }
}

export default Portefeuille;