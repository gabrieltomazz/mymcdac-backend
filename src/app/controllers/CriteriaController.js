import * as Yup from 'yup';

import Criteria from '../models/Criteria';
import Util from '../../config/util';

class CriteriaController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            title: Yup.string(),
            percent: Yup.number(),
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
                id, name, title, percent, criterion_id, project_id,
            } = await Criteria.create(criterion);

            return res.status(200).json({
                id,
                name,
                title,
                percent,
                criterion_id,
                project_id,
                children: [],
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
            title: Yup.string(),
            percent: Yup.string(),
            order: Yup.number(),
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
            const { id, name, title } = await criterionResult.update(criterion);
            return res.status(200).json({ id, name, title });
        } catch (error) {
            return res.status(400).json({ error: { mensagem: error } });
        }
    }

    async updateCriteria(req, res) {
        // Fields Validation
        const schema = Yup.array().of(
            Yup.object().shape({
                id: Yup.number(),
                name: Yup.string(),
                title: Yup.string(),
                percent: Yup.number(),
                order: Yup.number(),
            }),
        );

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (error) {
            return res.status(400).json(error);
        }

        const project_id = req.params.id;
        const criteriaList = req.body;

        // verify if id is valid
        if (Number.isNaN(project_id)) {
            return res.status(400).json({ error: { mensagem: 'Ids Inválidos!' } });
        }

        // update criterion
        criteriaList.forEach(async (element) => {
            const criterion = await Criteria.findByPk(element.id);
            try {
                await criterion.update(element);
                return true;
            } catch (error) {
                return res.status(400).json({ error: { mensagem: error } });
            }
        });

        return res.status(200).json('Salvo com Sucesso!');
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

            const result = Util.listToTree(listCriteria);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ error: { mensagem: error } });
        }
    }

    async getCriteriaLefs(req, res) {
        const project_id = req.params.id;

        // verify if id is valid
        if (Number.isNaN(project_id)) {
            return res.status(400).json({ error: { mensagem: 'Project id Inválido!' } });
        }

        try {
            const listCriteria = await Criteria.findAll({
                include: {
                    model: Criteria,
                    as: 'children',
                    attributes: [],
                },
                where: { project_id, '$children.criterion_id$': null },
                order: ['order'],
            });

            return res.status(200).json(listCriteria);
        } catch (error) {
            return res.status(400).json({ error: { mensagem: error } });
        }
    }

    async getCriteriaContributionRates(req, res) {
        const project_id = req.params.id;

        // verify if id is valid
        if (Number.isNaN(project_id)) {
            return res.status(400).json({ error: { mensagem: 'Project id Inválido!' } });
        }

        try {
            const listCriteria = await Criteria.findAll({
                include: {
                    model: Criteria,
                    required: true,
                    as: 'children',
                    attributes: ['id', 'name', 'percent'],
                    group: ['$criteria.criterion_id$'],
                },
                attributes: [['name', 'title']],
                order: ['id'],
                where: { project_id },
            });
            const mainCriteria = await Criteria.findAll({
                where: { project_id, criterion_id: null },
                attributes: ['id', 'name', 'percent'],
            });

            listCriteria.unshift({
                title: 'Critérios Principais',
                children: mainCriteria,
            });

            // '$children.criterion_id$': null
            return res.status(200).json(listCriteria);
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
