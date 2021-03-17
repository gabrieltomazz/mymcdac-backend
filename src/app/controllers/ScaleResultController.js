// import * as Yup from 'yup';

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
        result.forEach(async (criteria) => {
            criteria.options.forEach(async (options) => {
                const scaleResult = await ScaleResult.findOne({ where: { criterion_id: criteria.id, option_answer_id: options.id } });
                try {
                    if (scaleResult) {
                        await scaleResult.update({ value: options.value });
                    } else {
                        await ScaleResult.create({ value: options.value, criterion_id: criteria.id, option_answer_id: options.id });
                    }
                    return true;
                } catch (error) {
                    return res.status(400).json({ error: { mensagem: error } });
                }
            });
        });

        return res.status(200).json(result);
    }
}

export default new ScaleResultController();
