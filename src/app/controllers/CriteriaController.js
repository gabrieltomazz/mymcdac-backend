import * as Yup from 'yup';

import Criteria from '../models/Criteria';
import Util from '../../config/util';

class CriteriaController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            criterion_id: Yup.number(),
        });

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (error) {
            return res.status(400).json(error);
        }

        const criterion = req.body;
        criterion.project_id = req.params.id;

        // create criterion
        try {
            const {
                id, name, criterion_id, project_id,
            } = await Criteria.create(criterion);

            return res.status(200).json({
                id,
                name,
                criterion_id,
                project_id,
            });
        } catch (error) {
            return res.status(400).json({ error: { mensagem: 'Erro! Falha ao salvar critério.' } });
        }
    }

    async update(req, res) {
        // Fields Validation
        const schema = Yup.object().shape({
            id: Yup.number().required(),
            name: Yup.string().required(),
        });

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (error) {
            return res.status(400).json(error);
        }

        const project_id = req.params.id;
        const id_criterion = req.params.criterion_id;
        const criterion = req.body;

        // verify if id is valid
        if (Number.isNaN(project_id) || Number.isNaN(id_criterion)) {
            return res.status(400).json({ error: { mensagem: 'Ids Inválidos!' } });
        }

        try {
            const criterionResult = await Criteria.findByPk(id_criterion);
            const { id, name } = await criterionResult.update(criterion);
            return res.status(200).json({ id, name });
        } catch (error) {
            return res.status(400).json({ error: { mensagem: error } });
        }
    }

    async getCriteriaByProjectId(req, res) {
        const project_id = req.params.id;

        // verify if id is valid
        if (Number.isNaN(project_id)) {
            return res.status(400).json({ error: { mensagem: 'Project id Inválido!' } });
        }

        try {
            const listCriteria = await Criteria.findAll({
                where: { project_id },
                raw: true,
            });

            const result = await Util.listToTree(listCriteria);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ error: { mensagem: error } });
        }
    }

    async delete(req, res) {
        const { criterion_id } = req.params;

        // verify if id is valid
        if (Number.isNaN(criterion_id)) {
            return res.status(400).json({ error: { mensagem: 'Criterion id Inválido!' } });
        }

        try {
            // delete project
            await Criteria.destroy({
                where: {
                    id: criterion_id,
                },
            });

            return res.status(200).json({ success: { mensagem: 'Removido com Sucesso!' } });
        } catch (error) {
            return res.status(400).json({ error: { mensagem: error } });
        }
    }
}

export default new CriteriaController();
