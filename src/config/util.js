import ScaleResult from '../app/models/ScaleResult';

let listCriteria = [];

class Util {
    listToTree(list) {
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

    async buildFinalResult(criteriaList, options) {
        options = JSON.parse(JSON.stringify(options));
        for (let i = 0; i < criteriaList.length; i += 1) {
            // insert option in criterion
            criteriaList[i].options = JSON.parse(JSON.stringify(options));
            // initialize performance
            criteriaList[i].performanceMin = null;
            criteriaList[i].performanceMedia = null;
            criteriaList[i].performanceMax = null;

            // find resultScale and insert in criterion
            for (let j = 0; j < criteriaList[i].options.length; j += 1) {
                const result = await ScaleResult.findOne({
                    where: { option_answer_id: criteriaList[i].options[j].id, criterion_id: criteriaList[i].id },
                    attributes: ['id', 'value', 'median'],
                });
                criteriaList[i].options[j].value = result ? result.value : 0;
                criteriaList[i].options[j].median = result ? result.median : false;
                criteriaList[i].options[j].id_scale_result = result ? result.id : null;

                if (result && j === 0) criteriaList[i].performanceMin = result.value;
                if (result && result.median === true) criteriaList[i].performanceMedia = result.value;
                if (result && j === (criteriaList[i].options.length - 1)) criteriaList[i].performanceMax = result.value;
            }
        }

        criteriaList = this.listToTree(criteriaList);
        const generalCriteriaResult = this.calculaFinalResult(criteriaList, options);

        const mainCriteria = criteriaList.map((criterion) => ({
            name: criterion.name, title: criterion.title, performanceMax: criterion.performanceMax, performanceMedia: criterion.performanceMedia, performanceMin: criterion.performanceMin,
        }));

        generalCriteriaResult.mainCriteria = mainCriteria;

        const finalResult = {
            leafs: null,
            mainCriteria: null,
            gerenalCriteria: null,
        };

        finalResult.mainCriteria = criteriaList;
        finalResult.gerenalCriteria = generalCriteriaResult;
        return finalResult;
    }

    calculaFinalResult(criteriaList, options) {
        for (let x = 0; x < criteriaList.length; x += 1) {
            if (criteriaList[x].children.length > 0) {
                const {
                    finalOptions, performanceMax, performanceMedia, performanceMin,
                } = this.calculaFinalResult(criteriaList[x].children, criteriaList[x].options);
                criteriaList[x].options = finalOptions;
                criteriaList[x].performanceMax = performanceMax;
                criteriaList[x].performanceMedia = performanceMedia;
                criteriaList[x].performanceMin = performanceMin;
            }
        }
        return this.calculateScale(criteriaList.map((criterion) => ({
            options: criterion.options, percent: criterion.percent, performanceMax: criterion.performanceMax, performanceMedia: criterion.performanceMedia, performanceMin: criterion.performanceMin,
        })), options);
    }

    calculateScale(ListSons, options) {
        const finalOptions = options;

        for (let index = 0; index < finalOptions.length; index += 1) {
            finalOptions[index].value = (ListSons.reduce((resultado, opt) => resultado + (opt.options[index].value * opt.percent), 0)) / 100;
        }

        const [performanceMax, performanceMedia, performanceMin] = ListSons.reduce((resultado, opt) => {
            resultado[0] += Math.round((opt.performanceMax * opt.percent) / 100);
            resultado[1] += Math.round((opt.performanceMedia * opt.percent) / 100);
            resultado[2] += Math.round((opt.performanceMin * opt.percent) / 100);
            return resultado;
        }, [0, 0, 0]);

        return {
            finalOptions, performanceMax, performanceMedia, performanceMin,
        };
    }
}
export default new Util();
