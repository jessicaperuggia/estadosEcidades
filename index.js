import { promises as fs } from "fs";

let states;
let cities;

let stateCities = [];
let longNameOfBrazil = [];
let shortNameOfBrazil = [];

createJson();
viewSate("sp");

async function bringState() {
    return JSON.parse(await fs.readFile("Estados.json"));
}


async function bringCity() {
    return JSON.parse(await fs.readFile("Cidades.json"));

}

async function createJson() {
    states = await bringState();
    cities = await bringCity();

    states.map((state) => {
        let stateCity = cities.filter((city) => {
            return city.Estado === state.ID;
        });

        let stateStructure = {
            id: state.ID,
            sigla: state.Sigla,
            nome: state.Nome,
            quantidadeDeCidades: stateCity.length,
            cidades: stateCity,
        };

        stateCities.push(stateStructure);
        fs.writeFile(`./states/${state.Sigla}.json`, JSON.stringify(stateStructure));
    });


    viewLargePopulation();
    viewSamallPopulation();
    viewLongNames();
    viewShortNames();
    viewLongNameOfBrazil(true);
    viewShortNameOfBrazil();
}

async function viewSate(uf) {
    const data = JSON.parse(await fs.readFile(`./states/${uf.toUpperCase()}.json`));
    console.log(`2 - ${data.nome} tem ${data.cidades.length} municípios`);
}

function viewLargePopulation() {
    let cityStructureState = stateCities.map((state) => {
        return {
            uf: state.sigla,
            quantidade: state.quantidadeDeCidades,
        };
    });

    console.log("3 - Estados que possuem mais cidades, seguidos da quantidade, em ordem decrescente",
        cityStructureState.sort((a, b) => b.quantidade - a.quantidade).slice(0, 5));
}

function viewSamallPopulation() {
    let cityStructureState = stateCities.map((state) => {
        return {
            uf: state.sigla,
            quantidade: state.quantidadeDeCidades,
        };
    });

    console.log("4 - Estatdos que possuem menos cidades, seguidos da quantidade, em ordem decrescente",
        cityStructureState
            .sort((a, b) => a.quantidade - b.quantidade)
            .slice(0, 5)
            .sort((a, b) => b.quantidade - a.quantidade));
}

function viewLongNames() {
    let longNameState = [];

    longNameState = stateCities.map((state) => {
        let longName = "";

        state.cidades.forEach((cidade) => {
            if (cidade.Nome.length > longName.length) {
                longName = cidade.Nome;
            } else if (cidade.Nome.length === longName.length) {
                longNameState.sort((a, b) => a.nome - b.nome);
            }
        });

        return {
            cidade: longName,
            uf: state.sigla,
        };
    });

    longNameOfBrazil = longNameState;
    console.log("5 - Cidades com os nomes mais longos de cada estado: ");
    console.log(longNameState);
}

function viewShortNames() {
    let shortNameState = [];

    shortNameState = stateCities.map((state) => {
        let shortName = viewLongNameOfBrazil(false);

        state.cidades.forEach((cidade) => {
            if (cidade.Nome.length < shortName.length) {
                shortName = cidade.Nome;
            } else if (cidade.Nome.length === shortName.length) {
                shortNameState.sort((a, b) => a.nome - b.nome);
            }
        });

        return {
            cidade: shortName,
            uf: state.sigla,
        };
    });

    shortNameOfBrazil = shortNameState;
    console.log("6 - Cidadea com os nomes mais curtos de cada estado: ");
    console.log(shortNameState);
}
function viewLongNameOfBrazil(view) {
    longNameOfBrazil.sort((a, b) => b.cidade.length - a.cidade.length);

    if (view) {
        console.log("7 - Cidade de maior nome entre todos os estados: ");
        console.log(longNameOfBrazil[0]);
    }
    return longNameOfBrazil[0].cidade;
}
function viewShortNameOfBrazil() {
    shortNameOfBrazil
        .sort((a, b) => a.cidade.localeCompare(b.cidade))
        .sort((a, b) => a.cidade.length - b.cidade.length);
    console.log("8 - Cidade de menor nome entre todos os estados: ");
    console.log(shortNameOfBrazil[0]);
}