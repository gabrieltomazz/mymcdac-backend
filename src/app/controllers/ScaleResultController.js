import * as Yup from 'yup';

import Criteria from '../models/Criteria';
import util from '../../config/util';
import OptionAnswer from '../models/OptionAnswer';
import Project from '../models/Project';
import ScaleResult from '../models/ScaleResult';

class ScaleResultController {
    async getMedianScale(req, res) {
        const project_id = req.params.id;

        // verify if id is valid
        if (Number.isNaN(project_id)) {
            return res.status(400).json({ error: { mensagem: 'Project id Inválido!' } });
        }

        // find list of leaf from tree criteria
        const listCriteria = await Criteria.findAll({
            include: {
                model: Criteria,
                as: 'children',
                attributes: [],
            },
            where: { project_id, '$children.criterion_id$': null },
            attributes: ['id', 'name', 'title', 'order', 'criterion_id'],
            order: ['order'],
            raw: true,
        });

        // find project
        const project = await Project.findByPk(project_id);

        // find project scales
        const optionsProject = await OptionAnswer.findAll({
            where: { scale_id: project.scale_id },
            attributes: ['id', 'answer', 'neutral', 'good'],
            order: ['id'],
            raw: true,
        });

        // calcule values to leafs from Tree
        const result = await util.calculateLeafTree(listCriteria, optionsProject, project);

        // Create or Update ScaleResult
        for (let i = 0; i < result.length; i += 1) {
            for (let j = 0; j < result[i].options.length; j += 1) {
                const scaleResult = await ScaleResult.findOne({ where: { criterion_id: result[i].id, option_answer_id: result[i].options[j].id } });
                try {
                    if (scaleResult) {
                        const { id, median } = await scaleResult.update({ value: result[i].options[j].value });
                        result[i].options[j].id_scale_result = id;
                        result[i].options[j].median = median;
                    } else {
                        const { id, median } = await ScaleResult.create({ value: result[i].options[j].value, criterion_id: result[i].id, option_answer_id: result[i].options[j].id });
                        result[i].options[j].id_scale_result = id;
                        result[i].options[j].median = median;
                    }
                } catch (error) {
                    return res.status(400).json({ error: { mensagem: error } });
                }
            }
        }

        return res.status(200).json(result);
    }

    async update(req, res) {
        // Fields Validation
        const schema = Yup.array().of(
            Yup.object().shape({
                id: Yup.number().required(),
                median: Yup.boolean().required(),
            }),
        );

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: { mensagem: 'Dados Inválidos!' } });
        }

        const scaleResults = req.body;

        // update criterion
        await scaleResults.forEach(async (element) => {
            const option = await ScaleResult.findByPk(element.id);
            try {
                await option.update(element);
                return true;
            } catch (error) {
                return res.status(400).json({ error: { mensagem: error } });
            }
        });

        return res.status(200).json('Salvo com Sucesso!');
    }
}

export default new ScaleResultController();
