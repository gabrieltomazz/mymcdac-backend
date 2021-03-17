let listCriteria = [];

class Util {
    async listToTree(list) {
        const map = [];
        const roots = [];
        let i;
        let node = {};
        for (i = 0; i < list.length; i += 1) {
            map[list[i].id] = i; // initialize the map
            list[i].children = []; // initialize the children
        }
        for (let x = 0; x < list.length; x += 1) {
            node = list[x];
            if (node.criterion_id !== null) {
                // if you have dangling branches check that map[node.parentId] exists
                list[map[node.criterion_id]].children.push(node);
            } else {
                roots.push(node);
            }
        }

        return roots;
    }

    async calculateLeafTree(list, options, project) {
        listCriteria = list;
        options.forEach((element) => {
            element.value = null;
            element.median = false;
        });

        listCriteria.forEach((element) => {
            element.options = JSON.parse(JSON.stringify(options));
        });

        for (let i = 0; i < listCriteria.length; i += 1) {
            for (let j = 0; j < listCriteria[i].options.length; j += 1) {
                if (listCriteria[i].options[j].neutral === 1) {
                    listCriteria[i].options[j].value = 0;
                    this.setNegativeValues(i, j, project.steps);
                    this.setValuesBetweenScales(i, j);
                } else if (listCriteria[i].options[j].good === 1) {
                    listCriteria[i].options[j].value = 100;
                    this.setPositiveValues(i, j, project.steps);
                }
            }
        }

        return listCriteria;
    }

    async setNegativeValues(position_criterion, position_option, steps) {
        let i = 0;
        while (i !== position_option) {
            if (i === 0) {
                listCriteria[position_criterion].options[i].value = 0 - (steps) * (listCriteria.length - position_criterion);
            } else {
                listCriteria[position_criterion].options[i].value = 0 - (((steps) * (listCriteria.length - position_criterion)) / position_option);
            }
            i += 1;
        }
    }

    async setPositiveValues(position_criterion, position_option, steps) {
        let i = listCriteria[position_criterion].options.length - 1;
        while (i !== position_option) {
            if (i === listCriteria[position_criterion].options.length - 1) {
                listCriteria[position_criterion].options[i].value = Math.round(100 + (steps) * (listCriteria.length - position_criterion));
            } else {
                listCriteria[position_criterion].options[i].value = Math.round(100 + (((steps) * (listCriteria.length - position_criterion)) / position_option));
            }
            i -= 1;
        }
    }

    async setValuesBetweenScales(position_criterion, position_option) {
        let qtdCentralAnswer = 0;
        let x = parseFloat(position_option) + 1;
        while (listCriteria[position_criterion].options[position_option].good !== 1) {
            qtdCentralAnswer += 1;
            position_option += 1;
        }

        const value = 100 / qtdCentralAnswer;
        let factorMult = 1;
        while (listCriteria[position_criterion].options[x].good !== 1) {
            listCriteria[position_criterion].options[x].value = Math.round(value * factorMult);
            x += 1;
            factorMult += 1;
        }
    }
}
export default new Util();
