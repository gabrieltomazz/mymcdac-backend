// import * as Yup from 'yup';

import Criteria from '../models/Criteria';
// import Util from '../../config/util';

class ScaleResultController {
    async getMedianScale(req, res) {
        const project_id = req.params.id;

        // verify if id is valid
        if (Number.isNaN(project_id)) {
            return res.status(400).json({ error: { mensagem: 'Project id Inválido!' } });
        }

        const listCriteria = await Criteria.findAll({
            include: {
                model: Criteria,
                as: 'children',
                attributes: [],
            },
            where: { project_id, '$children.criterion_id$': null },
            order: ['order'],
            raw: true,
        });

        return res.status(200).json(listCriteria);
    }
}

export default new ScaleResultController();
